/**
 * Centralized Storage/Database Provider
 */
import fs from 'fs';
import path from 'path';

interface R2ObjectBody {
    json<T>(): Promise<T>;
    arrayBuffer(): Promise<ArrayBuffer>;
}

interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(key: string, value: any, options?: any): Promise<any>;
}

/**
 * Disk-based Bucket for Local Development
 * Industry Standard: Simulates cloud storage using the local filesystem.
 */
class DiskBucket implements R2Bucket {
    private baseDir: string;

    constructor() {
        this.baseDir = path.join(process.cwd(), 'dev_db');
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
    }

    private getFilePath(key: string) {
        const fullPath = path.join(this.baseDir, key);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return fullPath;
    }

    async get(key: string): Promise<R2ObjectBody | null> {
        const filePath = this.getFilePath(key);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath);
            return {
                json: async () => JSON.parse(content.toString()),
                arrayBuffer: async () => {
                    const ab = new ArrayBuffer(content.length);
                    const view = new Uint8Array(ab);
                    for (let i = 0; i < content.length; ++i) {
                        view[i] = content[i];
                    }
                    return ab;
                }
            };
        }
        return null;
    }

    async put(key: string, value: any): Promise<any> {
        const filePath = this.getFilePath(key);
        let content: any = value;

        if (typeof value === 'object' && !(value instanceof Buffer) && !(value instanceof ArrayBuffer) && !(value instanceof Uint8Array)) {
            content = JSON.stringify(value, null, 2);
        }

        fs.writeFileSync(filePath, content);
        return { key };
    }
}

/**
 * Get the bound R2 bucket or a stable disk-based dev fallback
 */
export function getStorageBucket(): R2Bucket {
    const bucket = process.env.NDPS_BUCKET as unknown as R2Bucket;

    // In dev, always prefer DiskBucket for local persistence
    if (process.env.NODE_ENV === 'development' || !bucket) {
        if (typeof window === 'undefined') {
            return new DiskBucket();
        }
    }

    return bucket;
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(filename: string): string {
    const baseUrl = process.env.R2_PUBLIC_URL || '';
    if (!baseUrl && process.env.NODE_ENV === 'development') {
        return `/api/placeholder?file=${encodeURIComponent(filename)}`;
    }
    return `${baseUrl}/${filename}`;
}
