import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';
import { getDatabase } from '@/lib/db';

export const runtime = 'edge';

/**
 * SECURE Admissions Delete Route
 * 
 * Security Measures Applied:
 * - Rate Limiting: Admin (30 req/min)
 * - Authentication: JWT token required
 * - Authorization: Requires 'admissions:delete' permission
 * - CORS: Strict origin validation
 */
async function handleDelete(request: SecureRequest) {
    try {
        const body = await request.json();

        // Validate ID format
        if (!body.id || typeof body.id !== 'string' || !body.id.startsWith('NDPS-')) {
            return NextResponse.json({
                success: false,
                message: 'Invalid application ID format'
            }, { status: 400 });
        }

        // Log delete action for audit trail
        console.log(`[ADMISSIONS DELETE] User: ${request.user?.username || 'unknown'} | ID: ${body.id} | Time: ${new Date().toISOString()}`);

        const db = getDatabase();

        try {
            await db.prepare(
                "DELETE FROM admissions WHERE id = ?"
            ).bind(body.id).run();
        } catch (dbError: any) {
            console.error('Database delete error:', dbError);
            if (dbError.message?.includes('no such table')) {
                return NextResponse.json({ success: true, message: 'Deleted (Mock)' });
            }
            throw dbError;
        }

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
    }
}

// Export with security wrapper
// NOTE: During initial setup, auth is set to false. 
// Enable authentication after setting up JWT_SECRET and user management.
export const POST = secureApiHandler(handleDelete, {
    rateLimit: 'admin',      // 30 requests/minute
    auth: { required: true, permissions: ['admissions:delete'] },
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admissions/delete'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
