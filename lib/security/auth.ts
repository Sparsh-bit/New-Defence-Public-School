/**
 * Production-Grade Authentication & Authorization System
 * 
 * Uses JWT tokens with secure defaults:
 * - RS256 or HS256 signing
 * - Short expiration times
 * - Refresh token rotation
 * - Role-based access control (RBAC)
 * 
 * Security Benefits:
 * - Prevents unauthorized access to admin functions
 * - Protects sensitive data and operations
 * - Enables audit trails via user identification
 * - Implements principle of least privilege
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
    createdAt: string;
    lastLogin?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'public';

export type Permission =
    | 'content:read'
    | 'content:write'
    | 'content:delete'
    | 'gallery:read'
    | 'gallery:write'
    | 'gallery:delete'
    | 'admissions:read'
    | 'admissions:write'
    | 'admissions:delete'
    | 'admissions:export'
    | 'users:read'
    | 'users:write'
    | 'users:delete'
    | 'settings:read'
    | 'settings:write';

export interface JWTPayload {
    sub: string;          // User ID
    username: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
    iat: number;          // Issued at (Unix timestamp)
    exp: number;          // Expiration (Unix timestamp)
    jti: string;          // JWT ID for revocation
    iss: string;          // Issuer
    aud: string;          // Audience
}

export interface AuthConfig {
    jwtSecret: string;
    accessTokenExpiry: number;  // seconds
    refreshTokenExpiry: number; // seconds
    issuer: string;
    audience: string;
}

export interface AuthResult {
    authenticated: boolean;
    user?: JWTPayload;
    error?: string;
    errorCode?: 'MISSING_TOKEN' | 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'INSUFFICIENT_PERMISSIONS';
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC) CONFIGURATION
// ============================================================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    super_admin: [
        'content:read', 'content:write', 'content:delete',
        'gallery:read', 'gallery:write', 'gallery:delete',
        'admissions:read', 'admissions:write', 'admissions:delete', 'admissions:export',
        'users:read', 'users:write', 'users:delete',
        'settings:read', 'settings:write'
    ],
    admin: [
        'content:read', 'content:write', 'content:delete',
        'gallery:read', 'gallery:write', 'gallery:delete',
        'admissions:read', 'admissions:write', 'admissions:delete', 'admissions:export',
        'users:read',
        'settings:read'
    ],
    editor: [
        'content:read', 'content:write',
        'gallery:read', 'gallery:write',
        'admissions:read'
    ],
    viewer: [
        'content:read',
        'gallery:read',
        'admissions:read'
    ],
    public: []
};

// ============================================================================
// JWT UTILITIES (Edge-compatible using Web Crypto API)
// ============================================================================

/**
 * Get auth configuration from environment
 * NEVER hardcode secrets - always use environment variables
 */
export function getAuthConfig(): AuthConfig {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error('CRITICAL: JWT_SECRET environment variable is not set!');
        throw new Error('Authentication configuration missing');
    }

    // Validate secret strength
    if (jwtSecret.length < 32) {
        console.error('CRITICAL: JWT_SECRET is too weak. Use at least 32 characters.');
        throw new Error('Authentication configuration invalid');
    }

    return {
        jwtSecret,
        accessTokenExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY || '3600'),      // 1 hour default
        refreshTokenExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY || '604800'),  // 7 days default
        issuer: process.env.JWT_ISSUER || 'ndps-api',
        audience: process.env.JWT_AUDIENCE || 'ndps-web'
    };
}

/**
 * Base64URL encode/decode functions for JWT
 */
function base64UrlEncode(data: ArrayBuffer | string): string {
    const bytes = typeof data === 'string'
        ? new TextEncoder().encode(data)
        : new Uint8Array(data);

    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
    // Add padding if needed
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
        base64 += '='.repeat(4 - pad);
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Create HMAC-SHA256 signature using Web Crypto API
 */
async function createSignature(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    return base64UrlEncode(signature);
}

/**
 * Verify HMAC-SHA256 signature using Web Crypto API
 */
async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);
    const signatureData = base64UrlDecode(signature);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );

    return crypto.subtle.verify('HMAC', key, signatureData.buffer as ArrayBuffer, messageData);
}

/**
 * Generate a unique JWT ID
 */
function generateJti(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// TOKEN OPERATIONS
// ============================================================================

/**
 * Create a JWT access token
 */
export async function createAccessToken(user: User): Promise<string> {
    const config = getAuthConfig();
    const now = Math.floor(Date.now() / 1000);

    const payload: JWTPayload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions.length > 0 ? user.permissions : ROLE_PERMISSIONS[user.role],
        iat: now,
        exp: now + config.accessTokenExpiry,
        jti: generateJti(),
        iss: config.issuer,
        aud: config.audience
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));

    const signatureInput = `${headerEncoded}.${payloadEncoded}`;
    const signature = await createSignature(signatureInput, config.jwtSecret);

    return `${signatureInput}.${signature}`;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<AuthResult> {
    try {
        const config = getAuthConfig();

        // Split token into parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            return { authenticated: false, error: 'Invalid token format', errorCode: 'INVALID_TOKEN' };
        }

        const [headerEncoded, payloadEncoded, signature] = parts;

        // Verify signature
        const signatureInput = `${headerEncoded}.${payloadEncoded}`;
        const isValid = await verifySignature(signatureInput, signature, config.jwtSecret);

        if (!isValid) {
            return { authenticated: false, error: 'Invalid token signature', errorCode: 'INVALID_TOKEN' };
        }

        // Decode and validate payload
        const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadEncoded));
        const payload: JWTPayload = JSON.parse(payloadJson);

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            return { authenticated: false, error: 'Token has expired', errorCode: 'EXPIRED_TOKEN' };
        }

        // Validate issuer and audience
        if (payload.iss !== config.issuer || payload.aud !== config.audience) {
            return { authenticated: false, error: 'Invalid token claims', errorCode: 'INVALID_TOKEN' };
        }

        return { authenticated: true, user: payload };

    } catch (error) {
        console.error('Token verification error:', error);
        return { authenticated: false, error: 'Token verification failed', errorCode: 'INVALID_TOKEN' };
    }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: Request): string | null {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) return null;

    // Support "Bearer <token>" format
    if (authHeader.toLowerCase().startsWith('bearer ')) {
        return authHeader.slice(7);
    }

    return null;
}

// ============================================================================
// AUTHORIZATION MIDDLEWARE
// ============================================================================

/**
 * Authenticate a request and return user info
 */
export async function authenticate(request: Request): Promise<AuthResult> {
    const token = extractToken(request);

    if (!token) {
        return {
            authenticated: false,
            error: 'No authentication token provided',
            errorCode: 'MISSING_TOKEN'
        };
    }

    return verifyToken(token);
}

/**
 * Check if user has required permission
 */
export function hasPermission(user: JWTPayload, permission: Permission): boolean {
    // Super admin has all permissions
    if (user.role === 'super_admin') return true;

    return user.permissions.includes(permission);
}

/**
 * Check if user has at least one of the required permissions
 */
export function hasAnyPermission(user: JWTPayload, permissions: Permission[]): boolean {
    if (user.role === 'super_admin') return true;
    return permissions.some(p => user.permissions.includes(p));
}

/**
 * Check if user has all required permissions
 */
export function hasAllPermissions(user: JWTPayload, permissions: Permission[]): boolean {
    if (user.role === 'super_admin') return true;
    return permissions.every(p => user.permissions.includes(p));
}

/**
 * Authorization guard for API routes
 * Use this to protect routes that require authentication
 */
export async function requireAuth(
    request: Request,
    requiredPermissions?: Permission | Permission[]
): Promise<{ authorized: boolean; user?: JWTPayload; response?: Response }> {

    // First, authenticate the request
    const authResult = await authenticate(request);

    if (!authResult.authenticated) {
        const status = authResult.errorCode === 'MISSING_TOKEN' ? 401 :
            authResult.errorCode === 'EXPIRED_TOKEN' ? 401 : 403;

        return {
            authorized: false,
            response: new Response(
                JSON.stringify({
                    success: false,
                    error: authResult.errorCode,
                    message: authResult.error
                }),
                {
                    status,
                    headers: {
                        'Content-Type': 'application/json',
                        'WWW-Authenticate': 'Bearer realm="NDPS API", error="invalid_token"'
                    }
                }
            )
        };
    }

    // If no permissions required, just authentication is enough
    if (!requiredPermissions) {
        return { authorized: true, user: authResult.user };
    }

    // Check permissions
    const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

    const hasRequiredPermissions = hasAllPermissions(authResult.user!, permissions);

    if (!hasRequiredPermissions) {
        return {
            authorized: false,
            response: new Response(
                JSON.stringify({
                    success: false,
                    error: 'INSUFFICIENT_PERMISSIONS',
                    message: 'You do not have permission to perform this action'
                }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        };
    }

    return { authorized: true, user: authResult.user };
}

/**
 * Role guard - check if user has required role or higher
 */
export function requireRole(user: JWTPayload, minRole: UserRole): boolean {
    const roleHierarchy: UserRole[] = ['public', 'viewer', 'editor', 'admin', 'super_admin'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(minRole);

    return userRoleIndex >= requiredRoleIndex;
}

// ============================================================================
// PASSWORD UTILITIES (for login implementation)
// ============================================================================

/**
 * Hash a password using PBKDF2 (Edge-compatible)
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    const hashArray = new Uint8Array(derivedBits);
    const saltHex = Array.from(salt, b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(hashArray, b => b.toString(16).padStart(2, '0')).join('');

    return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [saltHex, hashHex] = storedHash.split(':');

    if (!saltHex || !hashHex) return false;

    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    const computedHash = Array.from(new Uint8Array(derivedBits), b => b.toString(16).padStart(2, '0')).join('');

    // Timing-safe comparison
    if (computedHash.length !== hashHex.length) return false;

    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
        result |= computedHash.charCodeAt(i) ^ hashHex.charCodeAt(i);
    }

    return result === 0;
}
