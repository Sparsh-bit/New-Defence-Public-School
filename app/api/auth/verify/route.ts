import { NextResponse } from 'next/server';
import {
    secureApiHandler,
    authenticate,
    type SecureRequest
} from '@/lib/security';

export const runtime = 'edge';

/**
 * SECURE Token Verification Route
 * 
 * Used to verify if a token is still valid and get current user info.
 * 
 * Security Measures Applied:
 * - Rate Limiting: Standard API
 * - Token validation
 */
async function handleVerify(request: SecureRequest) {
    try {
        const authResult = await authenticate(request);

        if (!authResult.authenticated) {
            return NextResponse.json({
                success: false,
                valid: false,
                error: authResult.errorCode,
                message: authResult.error
            }, { status: 401 });
        }

        const user = authResult.user!;

        return NextResponse.json({
            success: true,
            valid: true,
            user: {
                id: user.sub,
                username: user.username,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            },
            expiresAt: user.exp * 1000  // Convert to milliseconds for JS Date
        });

    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json({
            success: false,
            valid: false,
            error: 'VERIFICATION_ERROR',
            message: 'Token verification failed'
        }, { status: 500 });
    }
}

// Export with security wrapper
export const GET = secureApiHandler(handleVerify, {
    rateLimit: 'api',
    auth: { required: true },
    cors: true,
    securityHeaders: true,
    endpoint: '/api/auth/verify'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
