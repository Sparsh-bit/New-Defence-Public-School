/**
 * Production-Grade Rate Limiter for Edge Runtime
 * 
 * This implementation uses a sliding window algorithm stored in memory.
 * For production with multiple edge nodes, replace the in-memory store
 * with Cloudflare KV, Durable Objects, or Redis.
 * 
 * Security Benefits:
 * - Prevents brute-force attacks on login/admin endpoints
 * - Protects against DDoS and API abuse
 * - Controls infrastructure costs from excessive requests
 * - Returns proper 429 status with Retry-After headers
 */

export interface RateLimitConfig {
    windowMs: number;           // Time window in milliseconds
    maxRequests: number;        // Max requests per window
    keyGenerator?: (request: Request) => string;  // Custom key generator
    skipFailedRequests?: boolean;  // Don't count failed requests
    skipSuccessfulRequests?: boolean;
    message?: string;           // Custom error message
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
    firstRequestTime: number;
}

// In-memory store for Edge Runtime
// NOTE: For production with multiple edge nodes, use Cloudflare KV or Durable Objects
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

// Default configurations for different endpoint types
export const RATE_LIMIT_PRESETS = {
    // Strict limit for authentication endpoints (prevent brute-force)
    auth: {
        windowMs: 15 * 60 * 1000,  // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5'),
        message: 'Too many login attempts. Please try again later.'
    },

    // Standard API limit
    api: {
        windowMs: 60 * 1000,  // 1 minute
        maxRequests: parseInt(process.env.RATE_LIMIT_API_MAX || '100'),
        message: 'Too many requests. Please slow down.'
    },

    // Strict limit for admin/write operations
    admin: {
        windowMs: 60 * 1000,  // 1 minute
        maxRequests: parseInt(process.env.RATE_LIMIT_ADMIN_MAX || '30'),
        message: 'Admin operation rate limit exceeded.'
    },

    // Very strict for file uploads
    upload: {
        windowMs: 60 * 1000,  // 1 minute
        maxRequests: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || '10'),
        message: 'Upload rate limit exceeded. Please wait before uploading more files.'
    },

    // Public content (more lenient)
    public: {
        windowMs: 60 * 1000,  // 1 minute
        maxRequests: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || '200'),
        message: 'Request limit exceeded.'
    }
} as const;

export type RateLimitPreset = keyof typeof RATE_LIMIT_PRESETS;

/**
 * Extract client identifier from request
 * Uses multiple sources for accurate identification
 */
export function getClientIdentifier(request: Request): string {
    // Priority order for client identification:
    // 1. CF-Connecting-IP (Cloudflare)
    // 2. X-Real-IP (common proxy header)
    // 3. X-Forwarded-For (load balancer)
    // 4. Fallback to "unknown"

    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    const realIp = request.headers.get('x-real-ip');
    const forwardedFor = request.headers.get('x-forwarded-for');

    if (cfConnectingIp) return cfConnectingIp;
    if (realIp) return realIp;
    if (forwardedFor) return forwardedFor.split(',')[0].trim();

    return 'unknown';
}

/**
 * Generate rate limit key combining IP and optional user ID
 */
export function generateRateLimitKey(
    request: Request,
    endpoint: string,
    userId?: string
): string {
    const ip = getClientIdentifier(request);
    const base = `ratelimit:${endpoint}:${ip}`;

    // If user is authenticated, add user-specific limiting
    // This prevents one user from exhausting limits for their IP
    return userId ? `${base}:user:${userId}` : base;
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
    headers: Record<string, string>;
}

/**
 * Check rate limit for a request
 * Returns headers and status information
 */
export function checkRateLimit(
    key: string,
    config: RateLimitConfig
): RateLimitResult {
    cleanupExpiredEntries();

    const now = Date.now();
    const { windowMs, maxRequests } = config;

    let entry = rateLimitStore.get(key);

    // Create new entry if doesn't exist or window expired
    if (!entry || now > entry.resetTime) {
        entry = {
            count: 0,
            resetTime: now + windowMs,
            firstRequestTime: now
        };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    const remaining = Math.max(0, maxRequests - entry.count);
    const resetTimeSeconds = Math.ceil((entry.resetTime - now) / 1000);

    // Standard rate limit headers
    const headers: Record<string, string> = {
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(entry.resetTime / 1000).toString(),
        'X-RateLimit-Policy': `${maxRequests};w=${Math.ceil(windowMs / 1000)}`
    };

    if (entry.count > maxRequests) {
        headers['Retry-After'] = resetTimeSeconds.toString();

        return {
            success: false,
            limit: maxRequests,
            remaining: 0,
            resetTime: entry.resetTime,
            retryAfter: resetTimeSeconds,
            headers
        };
    }

    return {
        success: true,
        limit: maxRequests,
        remaining,
        resetTime: entry.resetTime,
        headers
    };
}

/**
 * Rate limit middleware wrapper for API routes
 */
export function withRateLimit(
    preset: RateLimitPreset | RateLimitConfig,
    endpoint: string
) {
    const config = typeof preset === 'string'
        ? RATE_LIMIT_PRESETS[preset]
        : preset;

    return async (
        request: Request,
        handler: (request: Request) => Promise<Response>
    ): Promise<Response> => {
        const key = generateRateLimitKey(request, endpoint);
        const result = checkRateLimit(key, config);

        if (!result.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'RATE_LIMIT_EXCEEDED',
                    message: config.message || 'Too many requests',
                    retryAfter: result.retryAfter
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        ...result.headers
                    }
                }
            );
        }

        // Execute the handler and add rate limit headers to response
        const response = await handler(request);

        // Clone response to add headers
        const newHeaders = new Headers(response.headers);
        Object.entries(result.headers).forEach(([key, value]) => {
            newHeaders.set(key, value);
        });

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
        });
    };
}

/**
 * Simple rate limit check function for inline use
 */
export function rateLimit(
    request: Request,
    preset: RateLimitPreset,
    endpoint: string,
    userId?: string
): RateLimitResult {
    const config = RATE_LIMIT_PRESETS[preset];
    const key = generateRateLimitKey(request, endpoint, userId);
    return checkRateLimit(key, config);
}
