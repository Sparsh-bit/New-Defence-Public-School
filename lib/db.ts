/**
 * Centralized D1 Database Provider
 * 
 * EDGE COMPATIBLE VERSION:
 * - No Node.js 'fs' or 'path' imports.
 * - In-memory simulation for local dev to ensure Edge compatibility.
 */

// D1 Interface subsets
export interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(): Promise<T | null>;
    run<T = unknown>(): Promise<{ success: boolean; results?: T[] }>;
    all<T = unknown>(): Promise<{ success: boolean; results: T[] }>;
}

export interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<unknown[]>;
}

// Internal statement type for mock
interface MockPreparedStatement extends D1PreparedStatement {
    _query: string;
    _bound: unknown[];
}

// In-memory Database for local development (Edge-safe)
const memoryDb = {
    results: [] as any[],
    admissions: [] as any[]
};

/**
 * Mock D1 Database for Local Development (Edge Compatible)
 */
class DevDatabase implements D1Database {
    prepare(query: string): D1PreparedStatement {
        const self = this;

        const createStatement = (boundValues: unknown[] = []): MockPreparedStatement => {
            const stmt: MockPreparedStatement = {
                _query: query,
                _bound: boundValues,
                bind(...args: unknown[]) {
                    return createStatement(args);
                },
                async first<T>() {
                    const isAdmissions = query.toUpperCase().includes('ADMISSIONS');
                    const table = isAdmissions ? memoryDb.admissions : memoryDb.results;

                    if (query.toUpperCase().includes('SELECT')) {
                        const boundValue = stmt._bound[0];
                        const found = table.find((r: any) =>
                            String(isAdmissions ? (r.id) : (r.sr_no || '')).toUpperCase() === String(boundValue || '').toUpperCase()
                        );
                        return (found as T) || null;
                    }
                    return null;
                },
                async run() {
                    const queryUpper = query.toUpperCase();
                    if (queryUpper.includes('DELETE')) {
                        if (queryUpper.includes('BATCH_ID')) {
                            const batchId = stmt._bound[0];
                            memoryDb.results = memoryDb.results.filter((r: any) => String(r.batch_id) !== String(batchId));
                        } else {
                            const [cls, strm, year] = stmt._bound;
                            memoryDb.results = memoryDb.results.filter((r: any) => !(String(r.class) === String(cls) && String(r.stream) === String(strm) && String(r.academic_year) === String(year)));
                        }
                    }
                    return { success: true };
                },
                async all<T>() {
                    const queryUpper = query.toUpperCase();
                    if (queryUpper.includes('ADMISSIONS')) {
                        // Return all admissions sorted by date descending
                        const sorted = [...memoryDb.admissions].sort((a, b) =>
                            new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
                        );
                        return { success: true, results: sorted as unknown as T[] };
                    }
                    if (queryUpper.includes('SELECT') && queryUpper.includes('DISTINCT ACADEMIC_YEAR')) {
                        const years = Array.from(new Set(memoryDb.results.map((r: any) => r.academic_year)))
                            .map(y => ({ academic_year: y }));
                        return { success: true, results: years as unknown as T[] };
                    }
                    if (queryUpper.includes('SELECT') && queryUpper.includes('DISTINCT BATCH_ID')) {
                        const batches = Array.from(new Set(memoryDb.results.filter(r => r.batch_id).map((r: any) => r.batch_id)))
                            .map(b => {
                                const first = memoryDb.results.find(r => r.batch_id === b);
                                return { batch_id: b, academic_year: first?.academic_year, upload_date: first?.upload_date, class: first?.class, stream: first?.stream };
                            });
                        return { success: true, results: batches as unknown as T[] };
                    }
                    return { success: true, results: [] };
                }
            };
            return stmt;
        };

        return createStatement();
    }

    async batch(statements: D1PreparedStatement[]): Promise<unknown[]> {
        for (const stmt of (statements as MockPreparedStatement[])) {
            const query = stmt._query || '';
            const bound = stmt._bound || [];
            const queryUpper = query.toUpperCase();

            if (queryUpper.includes('DELETE')) {
                if (queryUpper.includes('BATCH_ID')) {
                    const batchId = bound[0];
                    memoryDb.results = memoryDb.results.filter((r: any) => String(r.batch_id) !== String(batchId));
                } else {
                    const [cls, strm, year] = bound;
                    memoryDb.results = memoryDb.results.filter((r: any) => !(String(r.class) === String(cls) && String(r.stream) === String(strm) && String(r.academic_year) === String(year)));
                }
            } else if (queryUpper.includes('INSERT INTO ADMISSIONS')) {
                const [id, student, father, mother, cls, dob, contact, email, address, status, submitted_at] = bound;
                memoryDb.admissions.push({
                    id,
                    student_name: student,
                    father_name: father,
                    mother_name: mother,
                    class_applying_for: cls,
                    date_of_birth: dob,
                    contact_number: contact,
                    email,
                    address,
                    status,
                    submitted_at
                });
            } else if (queryUpper.includes('INSERT')) {
                const [sr, name, cls, strm, subjects, total, perc, status, year, batchId, uploadDate] = bound;
                memoryDb.results.push({
                    sr_no: sr,
                    student_name: name,
                    class: cls,
                    stream: strm,
                    subjects_json: subjects,
                    total_marks: total,
                    percentage: perc,
                    result_status: status,
                    academic_year: year,
                    batch_id: batchId,
                    upload_date: uploadDate
                });
            }
        }
        return statements.map(() => ({ success: true }));
    }
}

/**
 * Get the D1 Database binding or a stable dev fallback
 */
export function getDatabase(): D1Database {
    const db = (process.env as any).DB as D1Database;

    if (db) return db;

    // Local Development Fallback (Memory)
    return new DevDatabase();
}
