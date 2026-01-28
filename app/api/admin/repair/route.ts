import { NextResponse } from 'next/server';
import { adminApiHandler, type SecureRequest } from '@/lib/security';
import { getDatabase } from '@/lib/db';

export const runtime = 'edge';

/**
 * DATABASE REPAIR UTILITY
 * 
 * This endpoint is used to apply schema migrations to the D1 database
 * directly from the application. This is useful when the remote
 * database schema falls behind the code.
 */
async function handleRepair(request: SecureRequest) {
    try {
        const db = getDatabase();

        console.log(`[DB REPAIR] Triggered by user: ${request.user?.username}`);

        // We use try-catch for each ALTER TABLE because SQLite doesn't have 'IF NOT EXISTS' for columns
        const tasks = [
            {
                name: 'admissions_table', sql: `CREATE TABLE IF NOT EXISTS admissions (
                id TEXT PRIMARY KEY,
                student_name TEXT NOT NULL,
                father_name TEXT NOT NULL,
                mother_name TEXT,
                class_applying_for TEXT NOT NULL,
                date_of_birth TEXT,
                contact_number TEXT,
                email TEXT,
                address TEXT,
                status TEXT DEFAULT 'pending',
                submitted_at TEXT NOT NULL,
                data_json TEXT
            )` },
            { name: 'academic_year', sql: "ALTER TABLE results ADD COLUMN academic_year TEXT" },
            { name: 'batch_id', sql: "ALTER TABLE results ADD COLUMN batch_id TEXT" },
            { name: 'upload_date', sql: "ALTER TABLE results ADD COLUMN upload_date TEXT" }
        ];

        const results = [];

        for (const task of tasks) {
            try {
                await db.prepare(task.sql).run();
                results.push({ column: task.name, status: 'Added successfully' });
            } catch (e: any) {
                if (e.message?.includes('duplicate column name') || e.message?.includes('already exists')) {
                    results.push({ column: task.name, status: 'Already exists' });
                } else {
                    results.push({ column: task.name, status: 'Error', error: e.message });
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Schema repair process completed.',
            results
        });

    } catch (error: any) {
        console.error('Repair failed:', error);
        return NextResponse.json({
            success: false,
            message: 'Database repair failed',
            error: error.message
        }, { status: 500 });
    }
}

// Restricted to Super Admin or at least admin:write
export const GET = adminApiHandler(handleRepair, 'settings:write');
