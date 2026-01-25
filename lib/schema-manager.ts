import { D1Database } from './db';

/**
 * DATABASE SCHEMA ORCHESTRATOR
 * 
 * This utility ensures that the D1 database schema is always in sync with the application requirements.
 * It automatically handles table creation and column migrations without requiring manual patches.
 */

export const SCHEMA_VERSION = 2; // Current expected schema version

export async function ensureDatabaseSchema(db: D1Database) {
    console.log('[SCHEMA] Synchronizing database schema...');

    try {
        // 1. Ensure RESULTS table exists with foundational schema
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS results (
                sr_no TEXT PRIMARY KEY,
                student_name TEXT,
                class TEXT,
                stream TEXT,
                subjects_json TEXT,
                total_marks REAL,
                percentage REAL,
                result_status TEXT
            )
        `).run();

        // 2. Perform Intelligent Column Migration
        // We check for missing columns and add them dynamically.
        // This is the "Industry Standard" way to handle schema evolution in serverless/edge environments.

        const columnChecks = [
            { name: 'academic_year', type: 'TEXT' },
            { name: 'batch_id', type: 'TEXT' },
            { name: 'upload_date', type: 'TEXT' }
        ];

        // Fetch current columns
        // Note: D1 .all() returns results in .results
        const tableInfo = await db.prepare("PRAGMA table_info(results)").all();
        const existingColumns = (tableInfo.results || []).map((col: any) => col.name);

        const migrationStatements = [];
        for (const col of columnChecks) {
            if (!existingColumns.includes(col.name)) {
                console.log(`[SCHEMA] Migrating: Adding missing column '${col.name}'`);
                migrationStatements.push(db.prepare(`ALTER TABLE results ADD COLUMN ${col.name} ${col.type}`));
            }
        }

        if (migrationStatements.length > 0) {
            await db.batch(migrationStatements);
            console.log(`[SCHEMA] Successfully applied ${migrationStatements.length} migrations.`);
        } else {
            console.log('[SCHEMA] Database is up to date.');
        }

        return { success: true };
    } catch (error) {
        console.error('[SCHEMA] Synchronization failed:', error);
        throw error; // Re-throw to be handled by the API caller
    }
}
