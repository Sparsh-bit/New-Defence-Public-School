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
 * This ensures the database stores environment-agnostic identifiers.
 */
export function cleanseUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    try {
        if (url.startsWith('http')) {
            const parsed = new URL(url.startsWith('//') ? `https:${url}` : url);
            // If it's a domain we recognize (r2.dev or similar), extract path
            if (parsed.hostname.includes('r2.dev')) {
                return parsed.pathname.replace(/^\/+/, '');
            }
        }
        // Strip common proxy prefix if it exists
        return url.replace(/^\/?api\/storage\//, '').replace(/^\/+/, '').split('?')[0];
    } catch (e) {
        return url;
    }
}

/**
 * Get the public URL for a file
 * 
 * Logic:
 * 1. Static Assets (/images/...) - Return as-is
 * 2. Already Proxied Paths - Return as-is
 * 3. Absolute URL Analysis: If it's a broken R2 link, wrap it in our stable proxy.
 * 4. Otherwise, use proxy for everything R2-related for maximum production stability.
 */
export function getPublicUrl(filename: string): string {
    if (!filename || typeof filename !== 'string') return '';

    // 1. Static Assets (/images/...) - Return as-is
    if (filename.startsWith('/images/')) {
        return filename;
    }

    // 2. Already Proxied Paths - Return as-is
    if (filename.startsWith('/api/storage/')) {
        return filename;
    }

    // 3. Absolute URL Analysis
    if (filename.startsWith('http') || filename.startsWith('//')) {
        const fullUrl = filename.startsWith('//') ? `https:${filename}` : filename;
        try {
            const url = new URL(fullUrl);
            // If it's a default Cloudflare r2.dev domain, it's often blocked or unstable.
            // We force it through our stable same-domain proxy.
            if (url.hostname.includes('.r2.dev')) {
                const cleanPath = url.pathname.replace(/^\/+/, '');
                return `/api/storage/${cleanPath}`;
            }
            return fullUrl; // Non-R2 absolute URLs are returned as-is
        } catch (e) {
            // Invalid URL string, fall through to default logic
        }
    }

    // 4. Base Configuration Logic
    const baseUrl = process.env.R2_PUBLIC_URL;
    const cleanFilename = filename.replace(/^\/+/, '');

    // 5. Custom Domain Proxy (Environment Strategy)
    // If we have a custom public URL and it's NOT an r2.dev domain, use it.
    if (baseUrl && !baseUrl.includes('.r2.dev')) {
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBaseUrl}/${cleanFilename}`;
    }

    // 6. ULTIMATE PRODUCTION FALLBACK: Same-Domain Proxy
    // This is the most professional and stable method as it avoids all cross-domain/rate-limit issues.
    return `/api/storage/${cleanFilename}`;
}
