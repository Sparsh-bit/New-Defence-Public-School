import { NextResponse } from 'next/server';
import {
    secureApiHandler,
    createAccessToken,
    verifyPassword,
    getAuthConfig,
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
    'ndps1996': {
        id: 'user-001',
        username: 'ndps1996',
        email: 'admin@newdefencepublicschool.com',
        role: 'super_admin',
        permissions: [],  // Super admin has all permissions automatically
        createdAt: '2024-01-01T00:00:00Z',
        // Hashed password for "sanjay@281280"
        passwordHash: '1bc1cbd31783abd2af2b946913c1b201:0b0081810d759c5bfeeb5ce4287dd1083fe159167356bd9e01e1adc5f13f7696'
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
                message: 'Invalid credentials'
            }, { status: 400 });
        }

        if (!password || typeof password !== 'string' || password.length < 5) {
            return NextResponse.json({
                success: false,
                error: 'INVALID_INPUT',
                message: 'Invalid credentials'
            }, { status: 400 });
        }

        const normalizedUsername = username.toLowerCase().trim();
        const user = DEMO_USERS[normalizedUsername];

        console.log(`[LOGIN ATTEMPT] Username: ${normalizedUsername} | Time: ${new Date().toISOString()}`);

        if (!user) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Timing attack protection
            return NextResponse.json({
                success: false,
                error: 'INVALID_CREDENTIALS',
                message: 'Invalid username or password'
            }, { status: 401 });
        }

        const isValidPassword = await verifyPassword(password, user.passwordHash);

        if (!isValidPassword) {
            console.log(`[LOGIN FAILED] Username: ${normalizedUsername} | Reason: Invalid password`);
            return NextResponse.json({
                success: false,
                error: 'INVALID_CREDENTIALS',
                message: 'Invalid username or password'
            }, { status: 401 });
        }

        // Login Successful
        const token = await createAccessToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            createdAt: user.createdAt
        });

        console.log(`[LOGIN SUCCESS] Username: ${user.username} | Role: ${user.role}`);

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
