/**
 * Security Module - Main Export
 * 
 * This is the central export for all security utilities.
 * Import from here for a clean and consistent API.
 */

// Rate Limiting
export {
    rateLimit,
    checkRateLimit,
    withRateLimit,
    getClientIdentifier,
    RATE_LIMIT_PRESETS,
    type RateLimitConfig,
    type RateLimitResult,
    type RateLimitPreset
} from './rate-limiter';

// Authentication & Authorization
export {
    authenticate,
    requireAuth,
    createAccessToken,
    verifyToken,
    extractToken,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    requireRole,
    hashPassword,
    verifyPassword,
    getAuthConfig,
    ROLE_PERMISSIONS,
    type User,
    type UserRole,
    type Permission,
    type JWTPayload,
    type AuthResult
} from './auth';

// CORS
export {
    getCorsConfig,
    getCorsHeaders,
    handlePreflight,
    validateCors,
    addCorsHeaders,
    withCors,
    isOriginAllowed,
    getSecurityHeaders,
    addSecurityHeaders,
    type CorsConfig
} from './cors';

// Combined security wrapper
export {
    secureApiHandler,
    publicApiHandler,
    authenticatedApiHandler,
    adminApiHandler,
    uploadApiHandler,
    type SecureHandlerOptions,
    type SecureRequest
} from './api-wrapper';
