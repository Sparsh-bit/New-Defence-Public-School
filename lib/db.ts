/**
 * Centralized D1 Database Provider
 * 
 * Provides industry-standard D1 binding access with a robust
 * disk-based fallback for local development.
 */
import fs from 'fs';
import path from 'path';

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

/**
 * Mock D1 Database for Local Development
 */
class DevDatabase implements D1Database {
    private dbPath: string;

    constructor() {
        this.dbPath = path.join(process.cwd(), 'dev_db', 'd1_mock.json');
        if (!fs.existsSync(path.dirname(this.dbPath))) {
            fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
        }
        if (!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, JSON.stringify({ results: [] }));
        }
    }

    private getData(): { results: any[] } {
        return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    }

    private setData(data: { results: any[] }) {
        fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    }

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
                    const data = self.getData();
                    const table = data.results || [];

                    if (query.toUpperCase().includes('SELECT')) {
                        const found = table.find((r: any) =>
                            String(r.sr_no || '').toUpperCase() === String(stmt._bound[0] || '').toUpperCase()
                        );
                        return (found as T) || null;
                    }
                    return null;
                },
                async run() {
                    const data = self.getData();
                    if (query.toUpperCase().includes('DELETE')) {
                        if (query.toUpperCase().includes('BATCH_ID')) {
                            const batchId = stmt._bound[0];
                            data.results = data.results.filter((r: any) => String(r.batch_id) !== String(batchId));
                        } else {
                            const cls = stmt._bound[0];
                            const strm = stmt._bound[1];
                            const year = stmt._bound[2];
                            data.results = data.results.filter((r: any) => !(String(r.class) === String(cls) && String(r.stream) === String(strm) && String(r.academic_year) === String(year)));
                        }
                        self.setData(data);
                    }
                    return { success: true };
                },
                async all<T>() {
                    const data = self.getData();
                    const queryUpper = query.toUpperCase();
                    if (queryUpper.includes('SELECT') && queryUpper.includes('DISTINCT ACADEMIC_YEAR')) {
                        const years = Array.from(new Set(data.results.map((r: any) => r.academic_year)))
                            .map(y => ({ academic_year: y }));
                        return { success: true, results: years as unknown as T[] };
                    }
                    if (queryUpper.includes('SELECT') && queryUpper.includes('DISTINCT BATCH_ID')) {
                        const batches = Array.from(new Set(data.results.filter(r => r.batch_id).map((r: any) => r.batch_id)))
                            .map(b => {
                                const first = data.results.find(r => r.batch_id === b);
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
        console.warn(`[DEV DB] Executing Batch with ${statements.length} operations`);

        const data = this.getData();
        if (!data.results) data.results = [];

        for (const stmt of (statements as MockPreparedStatement[])) {
            const query = stmt._query || '';
            const bound = stmt._bound || [];
            const queryUpper = query.toUpperCase();

            if (queryUpper.includes('DELETE')) {
                if (queryUpper.includes('BATCH_ID')) {
                    const batchId = bound[0];
                    data.results = data.results.filter((r: any) => String(r.batch_id) !== String(batchId));
                } else {
                    const [cls, strm, year] = bound;
                    data.results = data.results.filter((r: any) => !(String(r.class) === String(cls) && String(r.stream) === String(strm) && String(r.academic_year) === String(year)));
                }
            } else if (queryUpper.includes('INSERT')) {
                const [sr, name, cls, strm, subjects, total, perc, status, year, batchId, uploadDate] = bound;
                data.results.push({
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

        this.setData(data);
        return statements.map(() => ({ success: true }));
    }
}

/**
 * Get the D1 Database binding or a stable dev fallback
 */
export function getDatabase(): D1Database {
    const db = (process.env as any).DB as D1Database;

    if (!db || process.env.NODE_ENV === 'development') {
        if (typeof window === 'undefined') {
            return new DevDatabase();
        }
    }

    if (!db) {
        throw new Error('Database Error: DB binding not found.');
    }

    return db;
}
