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
/**
 * CLEANSE URL: Converts any URL (absolute, proxied, or relative) into a raw R2 key.
 * This is the ultimate "scrubber" for the database.
 */
export function cleanseUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';

    // Safety: Remove any whitespace
    let target = url.trim();

    // 1. Handle Proxy URLs: /api/storage/KEY or https://domain.com/api/storage/KEY
    if (target.includes('/api/storage/')) {
        target = target.split('/api/storage/')[1];
    }
    // 2. Handle R2 Direct URLs: https://pub-xxx.r2.dev/KEY
    else if (target.includes('r2.dev/')) {
        target = target.split('r2.dev/')[1];
    }
    // 3. Handle Absolute URLs from other environments
    else if (target.startsWith('http')) {
        try {
            const parsed = new URL(target.startsWith('//') ? `https:${target}` : target);
            target = parsed.pathname.replace(/^\/+/, '');
        } catch (e) {
            // If URL parsing fails, stick with original but strip leading slash
            target = target.replace(/^\/+/, '');
        }
    }

    // Final Polish: Strip leading slashes, query params, and decode encoded chars (like %20)
    try {
        const decoded = decodeURIComponent(target);
        return decoded.replace(/^\/+/, '').split('?')[0].trim();
    } catch (e) {
        return target.replace(/^\/+/, '').split('?')[0].trim();
    }
}

/**
 * Get the public URL for a file
 * 
 * Logic:
 * 1. Static Assets (/images/...) - Return as-is
 * 2. R2 Assets - ALWAYS force through our stable same-origin proxy /api/storage/
 *    This avoids CORS issues and stabilizes connection on Cloudflare Pages.
 */
export function getPublicUrl(filename: string): string {
    if (!filename || typeof filename !== 'string') return '';

    // 1. Static Assets Handling
    if (filename.startsWith('/images/')) {
        return filename;
    }
    if (filename.startsWith('images/')) {
        return `/${filename}`;
    }

    // 2. Already Proxied Paths (Relative) - Return as-is
    if (filename.startsWith('/api/storage/')) {
        return filename;
    }

    // 3. Absolute URL Analysis
    if (filename.startsWith('http') || filename.startsWith('//')) {
        const key = cleanseUrl(filename);
        // Recursively call to handle if the cleansed key is a static asset
        return getPublicUrl(key);
    }

    // 4. Base Configuration Logic (Proxy First for R2)
    const cleanFilename = filename.replace(/^\/+/, '');
    if (!cleanFilename) return '';

    return `/api/storage/${cleanFilename}`;
}
