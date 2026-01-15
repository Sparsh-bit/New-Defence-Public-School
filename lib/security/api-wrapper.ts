/**
 * Secure API Handler Wrapper
 * 
 * This is a unified wrapper that applies all security measures
 * to API routes in a clean, composable way.
 * 
 * Usage:
 *   export const POST = secureApiHandler(myHandlerFn, {
 *     rateLimit: 'admin',
 *     auth: { required: true, permissions: ['content:write'] },
 *     cors: true
 *   });
 */

import { NextResponse } from 'next/server';
import { rateLimit, type RateLimitPreset, type RateLimitResult } from './rate-limiter';
import { requireAuth, type Permission, type JWTPayload } from './auth';
import { handlePreflight, validateCors, addCorsHeaders, addSecurityHeaders } from './cors';

export interface SecureHandlerOptions {
    /**
     * Rate limiting preset or false to disable
     */
    rateLimit?: RateLimitPreset | false;

    /**
     * Authentication options
     */
    auth?: {
        required: boolean;
        permissions?: Permission | Permission[];
    } | false;

    /**
     * Enable CORS handling
     */
    cors?: boolean;

    /**
     * Add security headers to response
     */
    securityHeaders?: boolean;

    /**
     * Endpoint name for rate limiting (defaults to URL path)
     */
    endpoint?: string;
}

export interface SecureRequest extends Request {
    user?: JWTPayload;
    rateLimitInfo?: RateLimitResult;
}

type Handler = (request: SecureRequest) => Promise<Response>;

/**
 * Create a secure API handler with all security measures applied
 */
export function secureApiHandler(
    handler: Handler,
    options: SecureHandlerOptions = {}
): (request: Request) => Promise<Response> {

    const {
        rateLimit: rateLimitPreset = 'api',
        auth = false,
        cors = true,
        securityHeaders = true,
        endpoint
    } = options;

    return async (request: Request): Promise<Response> => {
        try {
            // 1. Handle CORS preflight
            if (cors && request.method === 'OPTIONS') {
                return handlePreflight(request);
            }

            // 2. Validate CORS origin
            if (cors) {
                const corsError = validateCors(request);
                if (corsError) return corsError;
            }

            // 3. Apply rate limiting
            const endpointName = endpoint || new URL(request.url).pathname;
            let rateLimitInfo: RateLimitResult | undefined;

            if (rateLimitPreset !== false) {
                rateLimitInfo = rateLimit(request, rateLimitPreset, endpointName);

                if (!rateLimitInfo.success) {
                    let response = new Response(
                        JSON.stringify({
                            success: false,
                            error: 'RATE_LIMIT_EXCEEDED',
                            message: 'Too many requests. Please try again later.',
                            retryAfter: rateLimitInfo.retryAfter
                        }),
                        {
                            status: 429,
                            headers: {
                                'Content-Type': 'application/json',
                                ...rateLimitInfo.headers
                            }
                        }
                    );

                    if (cors) response = addCorsHeaders(response, request);
                    if (securityHeaders) response = addSecurityHeaders(response);

                    return response;
                }
            }

            // 4. Authenticate & Authorize
            let user: JWTPayload | undefined;

            if (auth && auth.required) {
                const authResult = await requireAuth(request, auth.permissions);

                if (!authResult.authorized) {
                    let response = authResult.response!;
                    if (cors) response = addCorsHeaders(response, request);
                    if (securityHeaders) response = addSecurityHeaders(response);
                    return response;
                }

                user = authResult.user;
            }

            // 5. Execute the handler with enhanced request
            const secureRequest = request as SecureRequest;
            secureRequest.user = user;
            secureRequest.rateLimitInfo = rateLimitInfo;

            let response = await handler(secureRequest);

            // 6. Add rate limit headers to successful response
            if (rateLimitInfo) {
                const newHeaders = new Headers(response.headers);
                Object.entries(rateLimitInfo.headers).forEach(([key, value]) => {
                    newHeaders.set(key, value);
                });
                response = new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            }

            // 7. Add CORS and security headers
            if (cors) response = addCorsHeaders(response, request);
            if (securityHeaders) response = addSecurityHeaders(response);

            return response;

        } catch (error) {
            console.error('Secure handler error:', error);

            let response = new Response(
                JSON.stringify({
                    success: false,
                    error: 'INTERNAL_ERROR',
                    message: 'An unexpected error occurred'
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (cors) response = addCorsHeaders(response, request);
            if (securityHeaders) response = addSecurityHeaders(response);

            return response;
        }
    };
}

/**
 * Preset for public API routes (read-only, no auth, lenient rate limiting)
 */
export function publicApiHandler(handler: Handler) {
    return secureApiHandler(handler, {
        rateLimit: 'public',
        auth: false,
        cors: true
    });
}

/**
 * Preset for authenticated API routes
 */
export function authenticatedApiHandler(
    handler: Handler,
    permissions?: Permission | Permission[]
) {
    return secureApiHandler(handler, {
        rateLimit: 'api',
        auth: { required: true, permissions },
        cors: true
    });
}

/**
 * Preset for admin API routes (strict rate limiting, admin auth)
 */
export function adminApiHandler(
    handler: Handler,
    permissions?: Permission | Permission[]
) {
    return secureApiHandler(handler, {
        rateLimit: 'admin',
        auth: { required: true, permissions: permissions || ['settings:write'] },
        cors: true
    });
}

/**
 * Preset for upload endpoints (very strict rate limiting)
 */
export function uploadApiHandler(
    handler: Handler,
    permissions?: Permission | Permission[]
) {
    return secureApiHandler(handler, {
        rateLimit: 'upload',
        auth: { required: true, permissions: permissions || ['gallery:write'] },
        cors: true
    });
}
