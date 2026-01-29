import { NextResponse } from 'next/server';
import { adminApiHandler, type SecureRequest } from '@/lib/security';
import { getDatabase } from '@/lib/db';
import { getStorageBucket, getPublicUrl, cleanseUrl } from '@/lib/storage';

export const runtime = 'edge';

/**
 * DATABASE REPAIR UTILITY
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
            { name: 'upload_date', sql: "ALTER TABLE results ADD COLUMN upload_date TEXT" },
            {
                name: 'gallery_sync',
                sql: "SELECT 1", // Placeholder for logic below
                run: async () => {
                    const bucket = getStorageBucket();

                    // 1. Sync Gallery
                    const galleryObj = await bucket.get('gallery.json');
                    if (galleryObj) {
                        const galleryData = await galleryObj.json() as any;
                        if (galleryData.events) {
                            galleryData.events = galleryData.events.map((url: string) => cleanseUrl(url));
                        }
                        if (galleryData.infrastructure) {
                            galleryData.infrastructure = galleryData.infrastructure.map((url: string) => cleanseUrl(url));
                        }
                        await bucket.put('gallery.json', JSON.stringify(galleryData), {
                            httpMetadata: { contentType: 'application/json' }
                        });
                    }

                    // 2. Sync Downloads
                    const downloadsObj = await bucket.get('downloads.json');
                    if (downloadsObj) {
                        const downloadsData = await downloadsObj.json() as any;
                        if (downloadsData.results) {
                            downloadsData.results = downloadsData.results.map((doc: any) => ({
                                ...doc,
                                url: cleanseUrl(doc.url)
                            }));
                        }
                        if (downloadsData.general) {
                            downloadsData.general = downloadsData.general.map((doc: any) => ({
                                ...doc,
                                url: cleanseUrl(doc.url)
                            }));
                        }
                        await bucket.put('downloads.json', JSON.stringify(downloadsData), {
                            httpMetadata: { contentType: 'application/json' }
                        });
                    }
                    return "Database cleansed and keys normalized successfully.";
                }
            }
        ];

        const results = [];

        for (const task of tasks) {
            try {
                if (task.run) {
                    const msg = await task.run();
                    results.push({ column: task.name, status: 'Completed', detail: msg });
                } else {
                    await db.prepare(task.sql).run();
                    results.push({ column: task.name, status: 'Added successfully' });
                }
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
