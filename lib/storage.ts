/**
 * Centralized Storage/Database Provider
 * 
 * DESIGNED FOR EDGE COMPATIBILITY:
 * - No Node.js 'fs' or 'path' imports at top level.
 * - Environment-aware binding resolution.
 */

export interface R2ObjectBody {
    json<T>(): Promise<T>;
    arrayBuffer(): Promise<ArrayBuffer>;
}

export interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(key: string, value: any, options?: any): Promise<any>;
    delete(key: string): Promise<void>;
}

// In-memory fallback for environments without storage (local dev edge simulation)
const memoryStorage = new Map<string, any>();

/**
 * Get the bound R2 bucket or a stable fallback
 */
export function getStorageBucket(): R2Bucket {
    // Cloudflare R2 Binding
    const bucket = (process.env as any).NDPS_BUCKET as unknown as R2Bucket;

    if (bucket) return bucket;

    // Local Development Fallback
    // NOTE: Edge runtime does NOT support 'fs'. 
    // This memory mock ensures the site functions during local development
    // but data persists ONLY until the dev server restarts.
    return {
        async get(key: string): Promise<R2ObjectBody | null> {
            const data = memoryStorage.get(key);
            if (!data) return null;
            return {
                json: async () => typeof data === 'string' ? JSON.parse(data) : data,
                arrayBuffer: async () => {
                    if (data instanceof ArrayBuffer) return data;
                    if (data instanceof Uint8Array) return data.buffer as ArrayBuffer;
                    const enc = new TextEncoder();
                    return enc.encode(JSON.stringify(data)).buffer as ArrayBuffer;
                }
            };
        },
        async put(key: string, value: any): Promise<any> {
            memoryStorage.set(key, value);
            return { key };
        },
        async delete(key: string): Promise<void> {
            memoryStorage.delete(key);
        }
    };
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
