import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';
import { getDatabase } from '@/lib/db';

export const runtime = process.env.NODE_ENV === 'production' ? 'edge' : 'nodejs';

interface ResultResponse {
    sr_no: string;
    student_name: string;
    class: string;
    stream: string;
    subjects_json: string;
    total_marks: number;
    percentage: number;
    result_status: string;
    academic_year: string;
}

/**
 * Public Result Search API (Production Refined V2)
 * 
 * Logic:
 * 1. Search by SR No (Primary Index)
 * 2. Order by Academic Year DESC (Latest first)
 * 3. Validate name with fuzzy compatibility
 */
async function handleGetResult(request: SecureRequest) {
    try {
        const body = (await request.json()) as { sr_no?: string; student_name?: string };
        const srNoInput = String(body.sr_no || '').trim().toUpperCase();
        const nameInput = String(body.student_name || '').trim().toUpperCase();

        if (!srNoInput || !nameInput) {
            return NextResponse.json({ success: false, message: 'Both Admission No and Name are required.' }, { status: 400 });
        }

        // Security: Input length validation
        if (srNoInput.length > 50 || nameInput.length > 50) {
            return NextResponse.json({ success: false, message: 'Invalid input length.' }, { status: 400 });
        }

        const db = getDatabase();

        // Optimized Query: Find latest record for this SR No
        // NOTE: In D1/SQL, we'd use ORDER BY academic_year DESC
        const result = await db.prepare(
            "SELECT * FROM results WHERE UPPER(sr_no) = ? ORDER BY academic_year DESC"
        ).bind(srNoInput).first<ResultResponse>();

        if (!result) {
            return NextResponse.json({ success: false, message: 'Result not found. Please verify your Admission No.' }, { status: 404 });
        }

        // --- NAME VERIFICATION ---
        const dbNameClean = String(result.student_name || '').toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ').trim();
        const inputNameClean = nameInput.replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ').trim();

        const isExactMatch = dbNameClean === inputNameClean;
        const isFuzzyMatch = dbNameClean.includes(inputNameClean) || inputNameClean.includes(dbNameClean);

        if (!isExactMatch && !isFuzzyMatch) {
            return NextResponse.json({
                success: false,
                message: "Identity Mismatch: The provided name does not match school records for this Admission No."
            }, { status: 403 });
        }

        let subjects = [];
        try {
            subjects = JSON.parse(result.subjects_json);
        } catch (e) {
            console.error("Data integrity error", srNoInput);
        }

        // Optimized Response with Caching
        const response = NextResponse.json({
            success: true,
            data: {
                srNo: result.sr_no,
                studentName: result.student_name,
                class: result.class,
                stream: result.stream,
                subjects: subjects,
                totalMarks: result.total_marks,
                percentage: result.percentage,
                status: result.result_status,
                year: result.academic_year
            }
        });

        // Cache search result for 30 seconds to reduce D1 reads for refresh-happy users
        response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');

        return response;

    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ success: false, message: msg }, { status: 500 });
    }
}

export const POST = secureApiHandler(handleGetResult, {
    rateLimit: 'search', auth: false, cors: true, securityHeaders: true, endpoint: '/api/result'
});
