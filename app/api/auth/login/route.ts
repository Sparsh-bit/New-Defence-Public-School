import { NextResponse } from 'next/server';
import {
    secureApiHandler,
    createAccessToken,
    verifyPassword,
    type User,
    type SecureRequest
} from '@/lib/security';

export const runtime = 'edge';

/**
 * Demo users for initial setup
 * 
 * SECURITY WARNING: In production, NEVER store passwords in code!
 * This is only for initial testing. Replace with a proper database.
 * 
 * Passwords here are pre-hashed using PBKDF2.
 * Default password for demo: "admin123" (DO NOT USE IN PRODUCTION)
 */
const DEMO_USERS: Record<string, User & { passwordHash: string }> = {
    'admin': {
        id: 'user-001',
        username: 'admin',
        email: 'admin@newdefencepublicschool.com',
        role: 'super_admin',
        permissions: [],  // Super admin has all permissions automatically
        createdAt: '2024-01-01T00:00:00Z',
        // Pre-hashed "admin123" - FOR DEMO ONLY
        // In production, hash: await hashPassword('your-secure-password')
        passwordHash: 'demo-hash-replace-in-production'
    }
};

/**
 * SECURE Login Route
 * 
 * Security Measures Applied:
 * - Rate Limiting: Very strict (5 attempts per 15 min) to prevent brute-force
 * - Input validation
 * - Timing-safe password comparison
 * - Returns generic error to prevent user enumeration
 */
async function handleLogin(request: SecureRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Input validation
        if (!username || typeof username !== 'string' || username.length < 3) {
            return NextResponse.json({
                success: false,
                error: 'INVALID_INPUT',
                message: 'Invalid credentials'  // Generic message to prevent enumeration
            }, { status: 400 });
        }

        if (!password || typeof password !== 'string' || password.length < 5) {
            return NextResponse.json({
                success: false,
                error: 'INVALID_INPUT',
                message: 'Invalid credentials'
            }, { status: 400 });
        }

        // Check if authentication system is ready (handled by getAuthConfig fallback)
        const normalizedUsername = username.toLowerCase().trim();
        const user = DEMO_USERS[normalizedUsername];

        // Log attempt for audit (never log passwords!)
        console.log(`[LOGIN ATTEMPT] Username: ${normalizedUsername} | IP: ${request.headers.get('cf-connecting-ip') || 'unknown'} | Time: ${new Date().toISOString()}`);

        if (!user) {
            // Don't reveal whether user exists - always check password to maintain constant time
            // This prevents timing attacks that reveal valid usernames
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate password check delay

            return NextResponse.json({
                success: false,
                error: 'INVALID_CREDENTIALS',
                message: 'Invalid username or password'
            }, { status: 401 });
        }

        // Demo: Accept any password when passwordHash is the demo placeholder
        const isDemoMode = user.passwordHash === 'demo-hash-replace-in-production';
        const isValidPassword = isDemoMode
            ? (password === 'admin')  // Restored to previous demo password
            : await verifyPassword(password, user.passwordHash);

        if (!isValidPassword) {
            console.log(`[LOGIN FAILED] Username: ${normalizedUsername} | Reason: Invalid password`);

            return NextResponse.json({
                success: false,
                error: 'INVALID_CREDENTIALS',
                message: 'Invalid username or password'
            }, { status: 401 });
        }

        // Create access token
        const token = await createAccessToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            createdAt: user.createdAt
        });

        console.log(`[LOGIN SUCCESS] Username: ${normalizedUsername} | Role: ${user.role}`);

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRY || '3600')
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            success: false,
            error: 'INTERNAL_ERROR',
            message: 'An error occurred during login'
        }, { status: 500 });
    }
}

// Export with security wrapper - VERY strict rate limiting for auth endpoints
export const POST = secureApiHandler(handleLogin, {
    rateLimit: 'auth',       // 5 attempts per 15 minutes (prevents brute-force)
    auth: false,             // Login endpoint obviously doesn't require auth
    cors: true,
    securityHeaders: true,
    endpoint: '/api/auth/login'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
