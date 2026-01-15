/**
 * Production-Grade CORS Configuration
 * 
 * Implements strict Cross-Origin Resource Sharing (CORS) policy
 * to prevent unauthorized cross-origin requests.
 * 
 * Security Benefits:
 * - Prevents CSRF attacks from malicious websites
 * - Controls which domains can access APIs
 * - Protects sensitive operations from cross-origin abuse
 * - Environment-specific configuration (dev/staging/prod)
 */

export interface CorsConfig {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    allowCredentials: boolean;
    maxAge: number;  // Preflight cache duration in seconds
}

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

/**
 * Get CORS configuration from environment
 * Origins should be comma-separated in env vars
 */
export function getCorsConfig(): CorsConfig {
    const env = process.env.NODE_ENV || 'development';

    // Parse allowed origins from environment variable
    const envOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean) || [];

    // Default origins based on environment
    const defaultOrigins: Record<string, string[]> = {
        development: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:8787',  // Wrangler dev server
        ],
        staging: [
            // Add your staging domains here
            process.env.STAGING_URL || 'https://staging.example.com',
        ],
        production: [
            // Production domains - NEVER use wildcard (*)
            process.env.PRODUCTION_URL || 'https://example.com',
            'https://www.newdefencepublicschool.com',
            'https://newdefencepublicschool.com',
            // Add Cloudflare Pages default domain if used
            ...(process.env.CF_PAGES_URL ? [process.env.CF_PAGES_URL] : []),
        ]
    };

    // Combine environment-specific defaults with custom origins
    const origins = [...new Set([
        ...(defaultOrigins[env] || defaultOrigins.development),
        ...envOrigins
    ])];

    return {
        allowedOrigins: origins,

        // Standard methods - be restrictive
        allowedMethods: (process.env.CORS_ALLOWED_METHODS || 'GET,POST,PUT,DELETE,OPTIONS')
            .split(',')
            .map(m => m.trim()),

        // Headers required for API operations
        allowedHeaders: (process.env.CORS_ALLOWED_HEADERS ||
            'Content-Type,Authorization,X-Requested-With,Accept,Origin,Cache-Control')
            .split(',')
            .map(h => h.trim()),

        // Headers the client can access
        exposedHeaders: [
            'X-RateLimit-Limit',
            'X-RateLimit-Remaining',
            'X-RateLimit-Reset',
            'Retry-After',
            'Content-Disposition'
        ],

        // Enable credentials for authenticated requests
        // IMPORTANT: When true, cannot use wildcard (*) origin
        allowCredentials: process.env.CORS_ALLOW_CREDENTIALS !== 'false',

        // Preflight cache duration (24 hours)
        maxAge: parseInt(process.env.CORS_MAX_AGE || '86400')
    };
}

// ============================================================================
// ORIGIN VALIDATION
// ============================================================================

/**
 * Validate if the origin is allowed
 * Supports exact match and subdomain wildcards
 */
export function isOriginAllowed(origin: string | null, config: CorsConfig): boolean {
    if (!origin) {
        // Requests without origin (same-origin, server-to-server) are typically allowed
        // But be cautious - some proxies strip the Origin header
        return true;
    }

    // Check for exact match
    if (config.allowedOrigins.includes(origin)) {
        return true;
    }

    // Check for wildcard subdomain patterns (e.g., *.example.com)
    for (const allowedOrigin of config.allowedOrigins) {
        if (allowedOrigin.startsWith('*.')) {
            const domain = allowedOrigin.slice(2);
            try {
                const originUrl = new URL(origin);
                if (originUrl.hostname.endsWith(domain) || originUrl.hostname === domain.slice(1)) {
                    return true;
                }
            } catch {
                // Invalid origin URL, reject
                return false;
            }
        }
    }

    return false;
}

// ============================================================================
// CORS HEADERS
// ============================================================================

/**
 * Generate CORS headers for a response
 */
export function getCorsHeaders(request: Request, config?: CorsConfig): Record<string, string> {
    const corsConfig = config || getCorsConfig();
    const origin = request.headers.get('origin');

    const headers: Record<string, string> = {};

    // Only add CORS headers if origin is allowed
    if (isOriginAllowed(origin, corsConfig)) {
        // Use the requesting origin (not wildcard) when credentials are allowed
        if (corsConfig.allowCredentials && origin) {
            headers['Access-Control-Allow-Origin'] = origin;
        } else if (origin && corsConfig.allowedOrigins.includes(origin)) {
            headers['Access-Control-Allow-Origin'] = origin;
        }

        // Methods allowed for this resource
        headers['Access-Control-Allow-Methods'] = corsConfig.allowedMethods.join(', ');

        // Headers the client can send
        headers['Access-Control-Allow-Headers'] = corsConfig.allowedHeaders.join(', ');

        // Headers the client can read from response
        headers['Access-Control-Expose-Headers'] = corsConfig.exposedHeaders.join(', ');

        // Allow credentials (cookies, authorization headers)
        if (corsConfig.allowCredentials) {
            headers['Access-Control-Allow-Credentials'] = 'true';
        }

        // How long the preflight response can be cached
        headers['Access-Control-Max-Age'] = corsConfig.maxAge.toString();
    }

    // Always include Vary header for proper caching
    headers['Vary'] = 'Origin';

    return headers;
}

/**
 * Handle CORS preflight (OPTIONS) request
 */
export function handlePreflight(request: Request): Response {
    const config = getCorsConfig();
    const origin = request.headers.get('origin');

    // If origin is not allowed, return empty response without CORS headers
    if (!isOriginAllowed(origin, config)) {
        return new Response(null, {
            status: 403,
            statusText: 'Forbidden',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }

    // Return successful preflight response with CORS headers
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request, config)
    });
}

// ============================================================================
// CORS MIDDLEWARE
// ============================================================================

/**
 * CORS validation function for API routes
 * Returns null if origin is valid, or a rejection response if not
 */
export function validateCors(request: Request): Response | null {
    const config = getCorsConfig();
    const origin = request.headers.get('origin');

    // Skip validation for same-origin requests (no Origin header)
    if (!origin) {
        return null;
    }

    // Check if origin is allowed
    if (!isOriginAllowed(origin, config)) {
        console.warn(`CORS blocked request from unauthorized origin: ${origin}`);

        return new Response(
            JSON.stringify({
                success: false,
                error: 'CORS_BLOCKED',
                message: 'Cross-origin request blocked by security policy'
            }),
            {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Vary': 'Origin'
                }
            }
        );
    }

    return null;
}

/**
 * Add CORS headers to an existing response
 */
export function addCorsHeaders(response: Response, request: Request): Response {
    const corsHeaders = getCorsHeaders(request);
    const newHeaders = new Headers(response.headers);

    Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
    });

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
}

/**
 * Complete CORS middleware wrapper
 * Handles preflight and adds headers to responses
 */
export function withCors(
    handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
    return async (request: Request): Promise<Response> => {
        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            return handlePreflight(request);
        }

        // Validate origin for actual requests
        const corsError = validateCors(request);
        if (corsError) {
            return corsError;
        }

        // Execute handler and add CORS headers to response
        const response = await handler(request);
        return addCorsHeaders(response, request);
    };
}

// ============================================================================
// SECURITY HEADERS
// ============================================================================

/**
 * Additional security headers for API responses
 */
export function getSecurityHeaders(): Record<string, string> {
    return {
        // Prevent clickjacking
        'X-Frame-Options': 'DENY',

        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',

        // XSS protection
        'X-XSS-Protection': '1; mode=block',

        // Referrer policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',

        // Content Security Policy for API responses
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",

        // Permissions Policy (disable unnecessary features)
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
}

/**
 * Add all security headers to a response
 */
export function addSecurityHeaders(response: Response): Response {
    const securityHeaders = getSecurityHeaders();
    const newHeaders = new Headers(response.headers);

    Object.entries(securityHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
    });

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
}
