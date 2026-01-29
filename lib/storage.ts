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
 * 
 * DESIGN:
 * 1. If R2_PUBLIC_URL is set, use it as the base.
 * 2. If it's a relative path (starts with /), return it as is (it's a static asset).
 * 3. Otherwise, use our secure storage proxy route as fallback.
 */
export function getPublicUrl(filename: string): string {
    if (!filename || typeof filename !== 'string') return '';

    // 1. If it's already an absolute URL or a path to a static image, return it
    if (filename.startsWith('http') || filename.startsWith('/images/') || filename.startsWith('/api/storage/')) {
        return filename;
    }

    const baseUrl = process.env.R2_PUBLIC_URL;

    // 2. Use Public URL if configured
    if (baseUrl) {
        // Ensure no double slashes if filename starts with /
        const cleanFilename = filename.replace(/^\/+/, '');
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBaseUrl}/${cleanFilename}`;
    }

    // 3. Performance/Development Fallback
    if (process.env.NODE_ENV === 'development') {
        return `/api/placeholder?file=${encodeURIComponent(filename)}`;
    }

    // 4. Production Fallback: Use our Storage Proxy
    // Strip any leading slashes to prevent // paths or double slashes in the final URL
    const cleanFilename = filename.replace(/^\/+/, '');
    return `/api/storage/${cleanFilename}`;
}
