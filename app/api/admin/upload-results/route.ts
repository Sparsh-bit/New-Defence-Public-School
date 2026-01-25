import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';
import { deriveInfoFromSrNo } from '@/lib/result-utils';
import { getDatabase } from '@/lib/db';
import * as XLSX from 'xlsx';

export const runtime = 'edge';

interface SubjectMark {
    subject: string;
    marks: number;
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

/**
 * PRODUCTION-GRADE SMART EXCEL PARSER (V6 - YEAR SUPPORT)
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

        if (action === 'delete-batch') {
            const batchId = String(formData.get('batch_id') || '').trim();
            if (!batchId) return NextResponse.json({ success: false, message: 'Batch ID required.' }, { status: 400 });
            await db.prepare("DELETE FROM results WHERE batch_id = ?").bind(batchId).run();
            return NextResponse.json({ success: true, message: `Successfully removed batch: ${batchId}` });
        }

        // --- NORMAL UPLOAD LOGIC ---
        if (!file || !adminClass || !adminStream || !adminYear) {
            return NextResponse.json({ success: false, message: 'Incomplete upload parameters.' }, { status: 400 });
        }

        const fileName = file.name || 'manual-upload';
        const batchId = `${fileName}-${Date.now()}`;
        const uploadDate = new Date().toISOString();

        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });

        if (rows.length < 2) return NextResponse.json({ success: false, message: 'Empty worksheet.' }, { status: 400 });

        let headerRowIndex = -1;
        let colIndex_Adm = -1;
        let colIndex_Name = -1;

        for (let i = 0; i < Math.min(rows.length, 30); i++) {
            const rowArr = rows[i] as unknown[];
            for (let j = 0; j < rowArr.length; j++) {
                const val = String(rowArr[j] || '').trim().toLowerCase();
                if (val.includes('adm.no') || val.includes('adm no') || val === 'adm. no') {
                    headerRowIndex = i;
                    colIndex_Adm = j;
                }
                if (val === 'student' || val === 'student name' || val === 'student_name') {
                    colIndex_Name = j;
                }
            }
            if (headerRowIndex !== -1 && colIndex_Name !== -1) break;
        }

        if (headerRowIndex === -1 || colIndex_Adm === -1 || colIndex_Name === -1) {
            return NextResponse.json({ success: false, message: "Could not identify table headers." }, { status: 400 });
        }

        const mainHeaders = rows[headerRowIndex] as unknown[];
        const subHeaders = (rows[headerRowIndex + 1] as unknown[]) || [];

        let colIndex_Total = -1;
        let colIndex_Perc = -1;
        let colIndex_Status = -1;
        const subjectCols: { name: string, omIndex: number }[] = [];

        for (let j = 0; j < mainHeaders.length; j++) {
            const sub = String(subHeaders[j] || '').trim().toLowerCase();
            let context = "";
            for (let k = j; k >= 0; k--) {
                if (mainHeaders[k]) { context = String(mainHeaders[k]).trim().toLowerCase(); break; }
            }

            if (context.includes('overall result')) {
                if (sub === 'o.m') colIndex_Total = j;
                if (sub === 'result') colIndex_Status = j;
            } else if (context.includes('total')) {
                colIndex_Total = j;
            }

            if (context.includes('%') || context.includes('percentage')) colIndex_Perc = j;

            if (sub === 'o.m' && !context.includes('overall') && !context.includes('total')) {
                if (context && !['student', 'class', 'sr', 'adm'].some(k => context.includes(k))) {
                    subjectCols.push({ name: String(mainHeaders[j] || context).trim(), omIndex: j });
                }
            }
        }

        const validResults: ResultRecord[] = [];
        const startDataAt = headerRowIndex + (subHeaders.length > 0 && subHeaders.some(s => String(s).toLowerCase().includes('o.m')) ? 2 : 1);

        for (let i = startDataAt; i < rows.length; i++) {
            const row = rows[i] as unknown[];
            if (!row || row.length === 0) continue;

            const srVal = String(row[colIndex_Adm] || '').trim();
            if (!srVal || srVal === 'null' || srVal.toLowerCase().includes('adm.no')) continue;

            try {
                const info = deriveInfoFromSrNo(srVal);
                if (info.class !== adminClass || info.stream !== adminStream) {
                    throw new Error(`Row mismatch: Student ${srVal} belongs to ${info.class}-${info.stream}. Your selection: ${adminClass}-${adminStream}.`);
                }

                const subjects: SubjectMark[] = subjectCols.map(sc => ({
                    subject: sc.name,
                    marks: Number(row[sc.omIndex] || 0)
                }));

                validResults.push({
                    sr_no: srVal,
                    student_name: String(row[colIndex_Name] || '').trim().toUpperCase(),
                    class: info.class,
                    stream: info.stream,
                    subjects_json: JSON.stringify(subjects),
                    total_marks: Number(row[colIndex_Total] || 0),
                    percentage: Number(row[colIndex_Perc] || 0),
                    result_status: String(row[colIndex_Status] || 'PASS').toUpperCase(),
                    academic_year: adminYear,
                    batch_id: batchId,
                    upload_date: uploadDate
                });
            } catch (err) {
                if (err instanceof Error && err.message.includes('Row mismatch')) {
                    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
                }
            }
        }

        if (validResults.length === 0) {
            return NextResponse.json({ success: false, message: "No valid student records found." }, { status: 400 });
        }

        const statements = [];
        // Delete targeted category overlap
        statements.push(db.prepare("DELETE FROM results WHERE class = ? AND stream = ? AND academic_year = ?").bind(adminClass, adminStream, adminYear));

        const insertStmt = db.prepare(`
            INSERT INTO results (sr_no, student_name, class, stream, subjects_json, total_marks, percentage, result_status, academic_year, batch_id, upload_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const res of validResults) {
            statements.push(insertStmt.bind(
                res.sr_no, res.student_name, res.class, res.stream,
                res.subjects_json, res.total_marks, res.percentage, res.result_status,
                res.academic_year, res.batch_id, res.upload_date
            ));
        }

        await db.batch(statements);

        return NextResponse.json({
            success: true,
            message: `Successfully syncronized ${validResults.length} records for ${adminYear}.`
        });

    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Sync Error';
        return NextResponse.json({ success: false, message: msg }, { status: 500 });
    }
}

/**
 * LIST RECENT BATCHES
 */
async function handleListBatches() {
    try {
        const db = getDatabase();
        const batches = await db.prepare("SELECT DISTINCT batch_id FROM results").all();
        return NextResponse.json({ success: true, data: batches.results || [] });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch batches' }, { status: 500 });
    }
}

export const GET = secureApiHandler(handleListBatches, { rateLimit: 'admin', auth: { required: true, permissions: ['content:read'] } });

export const POST = secureApiHandler(handleUploadResults, {
    rateLimit: 'admin', auth: { required: true, permissions: ['content:write'] }, cors: true, securityHeaders: true, endpoint: '/api/admin/upload-results'
});

export const OPTIONS = secureApiHandler(async () => new Response(null), { rateLimit: false, auth: false, cors: true });
