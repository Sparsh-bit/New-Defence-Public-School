import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';
import { getDatabase } from '@/lib/db';
import { ensureDatabaseSchema } from '@/lib/schema-manager';
import * as XLSX from 'xlsx';

export const runtime = 'edge';

interface SubjectMark {
    subject: string;
    maxMarks: number;
    obtainedMarks: number;
}

interface ResultRecord {
    sr_no: string;
    student_name: string;
    class: string;
    stream: string;
    subjects_json: string;
    total_marks: number;
    percentage: number;
    result_status: string;
    academic_year: string;
    batch_id: string;
    upload_date: string;
}

interface ParseDebugInfo {
    totalRows: number;
    dataStartRow: number;
    subjectCount: number;
    headerRowIndex: number;
    subjectNames: string[];
    skippedRows: number;
    validRows: number;
}

// ============================================================================
// FIXED COLUMN POSITIONS (As per Excel template specification)
// ============================================================================
const COL_ADMISSION_NO = 0;   // Column A - Admission Number / SR No
// Column B (Roll Number) is at index 1 but not used in current parsing
const COL_STUDENT_NAME = 2;   // Column C - Student Name
// Column D (Class) is at index 3 but we use admin-selected class
const COL_SUBJECTS_START = 4; // Column E onwards - Subject pairs (MM, OM)

// ============================================================================
// STREAM DETECTION FROM SR NO
// ============================================================================
interface StreamInfo {
    class: string;
    stream: string;
}

/**
 * Derives class and stream from SR No suffix
 * Supports: -H (Class 10), -MATH, -BIO, -ARTS, -COMMERCE (Class 12)
 * Also supports future streams via pattern matching
 */
function detectStreamFromSrNo(srNo: string): StreamInfo | null {
    if (!srNo) return null;

    const upperSr = srNo.toUpperCase().trim();

    // Class 10 patterns
    if (upperSr.endsWith('-H') || upperSr.includes('-10')) {
        return { class: '10', stream: 'GENERAL' };
    }

    // Class 12 patterns - explicit streams
    if (upperSr.endsWith('-MATH') || upperSr.includes('-MATHS')) {
        return { class: '12', stream: 'MATH' };
    }
    if (upperSr.endsWith('-BIO') || upperSr.includes('-BIOLOGY')) {
        return { class: '12', stream: 'BIO' };
    }
    if (upperSr.endsWith('-ARTS') || upperSr.includes('-ART')) {
        return { class: '12', stream: 'ARTS' };
    }
    if (upperSr.endsWith('-COMM') || upperSr.includes('-COMMERCE')) {
        return { class: '12', stream: 'COMMERCE' };
    }
    if (upperSr.endsWith('-HUM') || upperSr.includes('-HUMANITIES')) {
        return { class: '12', stream: 'HUMANITIES' };
    }

    // Generic pattern: anything with -12 followed by stream code
    const pattern12 = /-12-?([A-Z]+)$/i;
    const match12 = upperSr.match(pattern12);
    if (match12) {
        return { class: '12', stream: match12[1].toUpperCase() };
    }

    return null;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Checks if a value looks like a valid admission/SR number
 */
function isValidAdmissionNo(value: unknown): boolean {
    if (!value) return false;
    const str = String(value).trim();
    if (!str || str.length < 2 || str.length > 50) return false;
    // Must contain at least one alphanumeric character
    if (!/[a-zA-Z0-9]/.test(str)) return false;
    // Should not be a header text
    const lower = str.toLowerCase();
    if (lower.includes('adm') || lower.includes('sr') || lower.includes('no') ||
        lower.includes('roll') || lower.includes('name') || lower.includes('class') ||
        lower.includes('subject') || lower.includes('m.m') || lower.includes('o.m') ||
        lower.includes('result') || lower.includes('total') || lower.includes('pre-board')) {
        return false;
    }
    return true;
}

/**
 * Checks if a value looks like a valid student name
 */
function isValidStudentName(value: unknown): boolean {
    if (!value) return false;
    const str = String(value).trim();
    if (!str || str.length < 2 || str.length > 100) return false;
    // Should contain mostly letters
    const letterCount = (str.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 2) return false;
    // Should not be a header text
    const lower = str.toLowerCase();
    if (lower === 'student' || lower === 'student name' || lower.includes('m.m') ||
        lower.includes('o.m') || lower.includes('roll')) {
        return false;
    }
    return true;
}

/**
 * Checks if a pair of values looks like valid marks (MM/OM)
 */
function isValidMarksPair(mm: unknown, om: unknown): boolean {
    const mmNum = Number(mm);
    const omNum = Number(om);
    // Both should be numbers, MM should be positive, OM should be 0 or positive
    if (isNaN(mmNum) || isNaN(omNum)) return false;
    if (mmNum <= 0 || mmNum > 200) return false; // Reasonable MM range
    if (omNum < 0 || omNum > mmNum) return false;
    return true;
}

/**
 * Checks if a header cell indicates "Overall Result" or similar
 */
function isOverallResultColumn(value: unknown): boolean {
    if (!value) return false;
    const str = String(value).toLowerCase().trim();
    return str.includes('overall') || str.includes('total') || str.includes('grand') ||
        str.includes('aggregate') || str.includes('final');
}

// ============================================================================
// SUBJECT NAME EXTRACTION
// ============================================================================

/**
 * Attempts to extract subject name from merged header row
 * Falls back to generic naming if not possible
 */
function extractSubjectName(headerRow: unknown[], subHeaderRow: unknown[], colIndex: number, subjectIndex: number): string {
    // Try to find the subject name by looking backwards from the MM column
    // In merged cells, only the first cell of the merge contains the value
    for (let k = colIndex; k >= 0; k--) {
        const val = headerRow[k];
        if (val) {
            const str = String(val).trim();
            // Skip if it's a metadata column
            const lower = str.toLowerCase();
            if (lower.includes('adm') || lower.includes('roll') || lower.includes('name') ||
                lower.includes('class') || lower.includes('overall') || lower.includes('total') ||
                lower.includes('m.m') || lower.includes('o.m') || lower.includes('result') ||
                lower.includes('pre-board') || lower.includes('exam')) {
                continue;
            }
            // Found a valid subject name
            return str.toUpperCase();
        }
    }

    // Check if subheader has subject info
    const subVal = subHeaderRow[colIndex];
    if (subVal) {
        const str = String(subVal).trim();
        const lower = str.toLowerCase();
        if (!lower.includes('m.m') && !lower.includes('o.m') && str.length > 1) {
            return str.toUpperCase();
        }
    }

    // Fallback to generic naming
    return `SUBJECT_${subjectIndex + 1}`;
}

// ============================================================================
// MAIN PARSER - POSITION-BASED DYNAMIC SUBJECT DETECTION
// ============================================================================

interface ParseResult {
    success: boolean;
    records: ResultRecord[];
    debug: ParseDebugInfo;
    error?: string;
}

/**
 * PRODUCTION-GRADE EXCEL PARSER V7 - UNIVERSAL STREAM SUPPORT
 * 
 * Key Features:
 * - Fixed position mapping for columns 0-3
 * - Dynamic subject detection from column 4 onwards
 * - Supports MM/OM pairs for each subject
 * - Auto-detects header rows by data validation
 * - Works with merged headers
 * - Future-proof for new streams and subjects
 */
function parseExcelData(
    rows: unknown[][],
    adminClass: string,
    adminStream: string,
    adminYear: string,
    batchId: string,
    uploadDate: string
): ParseResult {
    const debug: ParseDebugInfo = {
        totalRows: rows.length,
        dataStartRow: -1,
        subjectCount: 0,
        headerRowIndex: -1,
        subjectNames: [],
        skippedRows: 0,
        validRows: 0
    };

    if (rows.length < 3) {
        return { success: false, records: [], debug, error: 'File has too few rows to contain valid data.' };
    }

    // ========================================================================
    // STEP 1: Find where actual student data begins
    // We look for the first row that has valid admission no and student name
    // ========================================================================
    let dataStartRow = -1;
    let headerRowCandidate = -1;

    for (let i = 0; i < Math.min(rows.length, 20); i++) {
        const row = rows[i] as unknown[];
        if (!row || row.length < 4) continue;

        const admVal = row[COL_ADMISSION_NO];
        const nameVal = row[COL_STUDENT_NAME];

        // Check if this looks like a header row (for reference)
        const admStr = String(admVal || '').toLowerCase();
        if (admStr.includes('adm') || admStr.includes('sr') || admStr.includes('roll')) {
            headerRowCandidate = i;
            continue;
        }

        // Check if this looks like student data
        if (isValidAdmissionNo(admVal) && isValidStudentName(nameVal)) {
            dataStartRow = i;
            break;
        }
    }

    if (dataStartRow === -1) {
        return {
            success: false,
            records: [],
            debug,
            error: 'Could not locate student data rows. Ensure columns A, B, C, D contain Adm No, Roll No, Name, Class respectively.'
        };
    }

    debug.dataStartRow = dataStartRow;
    debug.headerRowIndex = headerRowCandidate !== -1 ? headerRowCandidate : dataStartRow - 1;

    // ========================================================================
    // STEP 2: Detect subject columns dynamically
    // From column 4 onwards, every pair of columns is (Max Marks, Obtained Marks)
    // Stop when we hit "Overall Result" type columns or run out of valid pairs
    // ========================================================================
    const firstDataRow = rows[dataStartRow] as unknown[];
    const headerRow = debug.headerRowIndex >= 0 ? (rows[debug.headerRowIndex] as unknown[]) : [];
    const subHeaderRow = debug.headerRowIndex >= 0 && debug.headerRowIndex + 1 < dataStartRow
        ? (rows[debug.headerRowIndex + 1] as unknown[]) : [];

    interface SubjectColumn {
        name: string;
        mmIndex: number;
        omIndex: number;
    }
    const subjectColumns: SubjectColumn[] = [];

    let overallResultStartCol = -1;
    let colIndex = COL_SUBJECTS_START;

    while (colIndex + 1 < firstDataRow.length) {
        // Check if this is an "Overall Result" column
        const headerVal = headerRow[colIndex];
        if (isOverallResultColumn(headerVal)) {
            overallResultStartCol = colIndex;
            break;
        }

        const mmVal = firstDataRow[colIndex];
        const omVal = firstDataRow[colIndex + 1];

        // Validate this looks like a marks pair
        if (isValidMarksPair(mmVal, omVal)) {
            const subjectName = extractSubjectName(headerRow, subHeaderRow, colIndex, subjectColumns.length);
            subjectColumns.push({
                name: subjectName,
                mmIndex: colIndex,
                omIndex: colIndex + 1
            });
            colIndex += 2;
        } else {
            // Check if we're at overall/total columns
            const valStr = String(mmVal || '').toLowerCase();
            if (valStr.includes('pass') || valStr.includes('fail') || valStr.includes('comp') ||
                isOverallResultColumn(headerRow[colIndex])) {
                overallResultStartCol = colIndex;
                break;
            }
            colIndex++;
        }
    }

    if (subjectColumns.length === 0) {
        return {
            success: false,
            records: [],
            debug,
            error: 'No subject columns detected. Ensure subject data starts from column E with MM/OM pairs.'
        };
    }

    debug.subjectCount = subjectColumns.length;
    debug.subjectNames = subjectColumns.map(s => s.name);

    // ========================================================================
    // STEP 3: Detect Total, Percentage, and Result Status columns
    // These typically follow after all subject columns
    // ========================================================================
    let colTotal = -1;
    let colPercentage = -1;
    let colStatus = -1;

    if (overallResultStartCol !== -1) {
        // Scan from overall result start to find specific columns
        for (let j = overallResultStartCol; j < firstDataRow.length && j < overallResultStartCol + 10; j++) {
            const subHeaderVal = String(subHeaderRow[j] || '').toLowerCase().trim();
            const headerVal = String(headerRow[j] || '').toLowerCase().trim();

            if (subHeaderVal === 'o.m' || subHeaderVal === 'om' || headerVal.includes('total') ||
                headerVal.includes('obtained') || headerVal.includes('marks obtained')) {
                if (colTotal === -1) colTotal = j;
            }
            if (subHeaderVal === '%' || headerVal.includes('%') || headerVal.includes('percent')) {
                colPercentage = j;
            }
            if (subHeaderVal === 'result' || headerVal === 'result' || headerVal.includes('status')) {
                colStatus = j;
            }
        }
    }

    // If not found in overall section, try to find them by value patterns
    if (colTotal === -1 || colPercentage === -1) {
        const lastSubjectEnd = subjectColumns[subjectColumns.length - 1].omIndex;
        for (let j = lastSubjectEnd + 1; j < firstDataRow.length; j++) {
            const val = firstDataRow[j];
            const numVal = Number(val);

            if (!isNaN(numVal)) {
                // Total is typically a larger number (sum of all OMs)
                if (colTotal === -1 && numVal > 50 && numVal <= 1000) {
                    colTotal = j;
                    continue;
                }
                // Percentage is typically 0-100
                if (colPercentage === -1 && numVal >= 0 && numVal <= 100) {
                    colPercentage = j;
                    continue;
                }
            } else {
                const strVal = String(val || '').toUpperCase().trim();
                if (colStatus === -1 && (strVal === 'PASS' || strVal === 'FAIL' || strVal.includes('COMP'))) {
                    colStatus = j;
                }
            }
        }
    }

    // ========================================================================
    // STEP 4: Process all student data rows
    // ========================================================================
    const records: ResultRecord[] = [];
    const adminClassUpper = adminClass.toUpperCase().trim();
    const adminStreamUpper = adminStream.toUpperCase().trim();

    for (let i = dataStartRow; i < rows.length; i++) {
        const row = rows[i] as unknown[];
        if (!row || row.length < 4) {
            debug.skippedRows++;
            continue;
        }

        const admNo = String(row[COL_ADMISSION_NO] || '').trim();
        const studentName = String(row[COL_STUDENT_NAME] || '').trim();

        // Validate required fields
        if (!isValidAdmissionNo(admNo) || !isValidStudentName(studentName)) {
            debug.skippedRows++;
            continue;
        }

        // Validate stream if detectable from SR No
        const detectedStream = detectStreamFromSrNo(admNo);
        if (detectedStream) {
            // Only validate if detection is possible - allow mismatch with warning in logs
            if (detectedStream.stream !== adminStreamUpper || detectedStream.class !== adminClassUpper) {
                // Log but don't fail - admin selection takes precedence
                console.warn(`[Result Import] Stream mismatch for ${admNo}: detected ${detectedStream.class}-${detectedStream.stream}, admin selected ${adminClassUpper}-${adminStreamUpper}`);
            }
        }

        // Extract subject marks
        const subjects: SubjectMark[] = [];
        for (const subCol of subjectColumns) {
            const maxMarks = Number(row[subCol.mmIndex] || 0);
            const obtainedMarks = Number(row[subCol.omIndex] || 0);

            // Only include if we have valid marks
            if (maxMarks >= 0 && obtainedMarks >= 0) {
                subjects.push({
                    subject: subCol.name,
                    maxMarks: maxMarks,
                    obtainedMarks: obtainedMarks
                });
            }
        }

        // Skip if no subjects found
        if (subjects.length === 0) {
            debug.skippedRows++;
            continue;
        }

        // Calculate total and percentage if not available from columns
        let totalMarks = colTotal !== -1 ? Number(row[colTotal] || 0) : 0;
        let percentage = colPercentage !== -1 ? Number(row[colPercentage] || 0) : 0;
        const resultStatus = colStatus !== -1 ? String(row[colStatus] || 'PASS').toUpperCase().trim() : 'PASS';

        // Calculate if not found
        if (totalMarks === 0) {
            totalMarks = subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
        }
        if (percentage === 0 && totalMarks > 0) {
            const maxTotal = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
            if (maxTotal > 0) {
                percentage = Math.round((totalMarks / maxTotal) * 100 * 100) / 100;
            }
        }

        // Convert subjects to legacy format for backward compatibility
        // The existing result API expects { subject, marks }
        const subjectsForStorage = subjects.map(s => ({
            subject: s.subject,
            marks: s.obtainedMarks,
            maxMarks: s.maxMarks
        }));

        records.push({
            sr_no: admNo.toUpperCase(),
            student_name: studentName.toUpperCase(),
            class: adminClassUpper,
            stream: adminStreamUpper,
            subjects_json: JSON.stringify(subjectsForStorage),
            total_marks: totalMarks,
            percentage: percentage,
            result_status: resultStatus || 'PASS',
            academic_year: adminYear,
            batch_id: batchId,
            upload_date: uploadDate
        });

        debug.validRows++;
    }

    if (records.length === 0) {
        return {
            success: false,
            records: [],
            debug,
            error: `No valid student records found. Checked ${debug.totalRows} rows, skipped ${debug.skippedRows}. Ensure data has valid Admission No and Student Name.`
        };
    }

    return { success: true, records, debug };
}

// ============================================================================
// API HANDLER - UPLOAD RESULTS
// ============================================================================

/**
 * PRODUCTION-GRADE SMART EXCEL PARSER V7 - UNIVERSAL STREAM SUPPORT
 */
async function handleUploadResults(request: SecureRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const adminClass = String(formData.get('class') || '').trim();
        const adminStream = String(formData.get('stream') || '').trim();
        const adminYear = String(formData.get('year') || '').trim();
        const action = String(formData.get('action') || 'upload').trim();

        const db = getDatabase();

        // Ensure database schema is up to date before proceeding
        await ensureDatabaseSchema(db);

        if (action === 'delete-batch') {
            const batchId = String(formData.get('batch_id') || '').trim();
            if (!batchId) return NextResponse.json({ success: false, message: 'Batch ID required.' }, { status: 400 });
            await db.prepare("DELETE FROM results WHERE batch_id = ?").bind(batchId).run();
            return NextResponse.json({ success: true, message: `Successfully removed batch: ${batchId}` });
        }

        // --- NORMAL UPLOAD LOGIC ---
        if (!file || !adminClass || !adminStream || !adminYear) {
            return NextResponse.json({ success: false, message: 'Incomplete upload parameters. Class, Stream, Year, and File are required.' }, { status: 400 });
        }

        const fileName = file.name || 'manual-upload';
        const batchId = `${fileName}-${Date.now()}`;
        const uploadDate = new Date().toISOString();

        // Parse Excel file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });

        if (rows.length < 2) {
            return NextResponse.json({ success: false, message: 'Empty or invalid worksheet.' }, { status: 400 });
        }

        // Parse data using position-based parser
        const parseResult = parseExcelData(rows, adminClass, adminStream, adminYear, batchId, uploadDate);

        if (!parseResult.success) {
            console.error('[Result Import] Parse failed:', parseResult.error, parseResult.debug);
            return NextResponse.json({
                success: false,
                message: parseResult.error || 'Failed to parse Excel file.',
                debug: process.env.NODE_ENV === 'development' ? parseResult.debug : undefined
            }, { status: 400 });
        }

        console.log('[Result Import] Parse success:', {
            recordCount: parseResult.records.length,
            subjects: parseResult.debug.subjectNames,
            stream: `${adminClass}-${adminStream}`
        });

        // Delete existing records for this category before inserting
        const statements = [];
        statements.push(
            db.prepare("DELETE FROM results WHERE class = ? AND stream = ? AND academic_year = ?")
                .bind(adminClass.toUpperCase(), adminStream.toUpperCase(), adminYear)
        );

        // Insert new records
        const insertStmt = db.prepare(`
            INSERT INTO results (sr_no, student_name, class, stream, subjects_json, total_marks, percentage, result_status, academic_year, batch_id, upload_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const record of parseResult.records) {
            statements.push(insertStmt.bind(
                record.sr_no,
                record.student_name,
                record.class,
                record.stream,
                record.subjects_json,
                record.total_marks,
                record.percentage,
                record.result_status,
                record.academic_year,
                record.batch_id,
                record.upload_date
            ));
        }

        await db.batch(statements);

        return NextResponse.json({
            success: true,
            message: `Successfully synchronized ${parseResult.records.length} records for ${adminYear} (${adminClass}-${adminStream}).`,
            details: {
                recordCount: parseResult.records.length,
                subjects: parseResult.debug.subjectNames,
                skippedRows: parseResult.debug.skippedRows
            }
        });

    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Sync Error';
        console.error('[Result Import] Error:', msg, error);
        return NextResponse.json({ success: false, message: `Import failed: ${msg}` }, { status: 500 });
    }
}

/**
 * LIST RECENT BATCHES
 */
async function handleListBatches() {
    try {
        const db = getDatabase();
        await ensureDatabaseSchema(db);
        const batches = await db.prepare("SELECT DISTINCT batch_id FROM results").all();
        return NextResponse.json({ success: true, data: batches.results || [] });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch batches' }, { status: 500 });
    }
}

export const GET = secureApiHandler(handleListBatches, { rateLimit: 'admin', auth: { required: true, permissions: ['content:read'] } });

export const POST = secureApiHandler(handleUploadResults, {
    rateLimit: 'admin', auth: { required: true, permissions: ['content:write'] }, cors: true, securityHeaders: true, endpoint: '/api/admin/upload-results'
});

export const OPTIONS = secureApiHandler(async () => new Response(null), { rateLimit: false, auth: false, cors: true });
