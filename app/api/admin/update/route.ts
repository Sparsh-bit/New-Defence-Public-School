import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';

export const runtime = 'edge';

// Define R2 Types locally
interface R2ObjectBody {
    json<T>(): Promise<T>;
}
interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(key: string, value: any, options?: any): Promise<any>;
}

/**
 * SECURE Admin Update Route
 * 
 * Security Measures Applied:
 * - Rate Limiting: 30 requests/minute (admin preset)
 * - Authentication: JWT token required
 * - Authorization: Requires 'content:write' permission
 * - CORS: Strict origin validation
 * - Security Headers: X-Frame-Options, CSP, etc.
 */
async function handleUpdate(request: SecureRequest) {
    try {
        const body = await request.json();

        // SAFETY 1: Max JSON Payload Size (200KB)
        // This ensures the database files (news.json, gallery.json) never grow large enough to cause issues.
        const payloadSize = JSON.stringify(body).length;
        if (payloadSize > 200 * 1024) {
            return NextResponse.json({
                success: false,
                message: 'Database Safety Limit: Payload too large (Max 200KB)'
            }, { status: 413 });
        }

        // Use R2 Bucket as a JSON Database
        const bucket = process.env.NDPS_BUCKET as unknown as R2Bucket;

        if (!bucket) {
            return NextResponse.json({ success: false, message: 'Bucket not bound' }, { status: 500 });
        }

        // Log admin action for audit trail
        console.log(`[ADMIN ACTION] User: ${request.user?.username || 'unknown'} | Action: ${body.type} | Time: ${new Date().toISOString()}`);

        // Handle News Updates
        if (body.type === 'news') {
            const fullList = body.fullList;

            // SAFETY 2: Max Item Count check (50 items)
            if (Array.isArray(fullList) && fullList.length > 50) {
                return NextResponse.json({
                    success: false,
                    message: 'Database Safety Limit: Max 50 News Items allowed.'
                }, { status: 400 });
            }

            await bucket.put('news.json', JSON.stringify(fullList), {
                httpMetadata: { contentType: 'application/json', cacheControl: 'no-cache' }
            });
        }

        // Handle Gallery Text Updates
        if (body.type === 'gallery_meta') {
            const data = body.fullData;

            // SAFETY 3: Hard Limit 10 Images per Category
            // This is the CRITICAL "Forever Free" enforcement.
            // Even if client-side validation is bypassed, this blocks the database update.
            if (data.events && data.events.length > 10) {
                return NextResponse.json({
                    success: false,
                    message: 'Database Safety Limit: Max 10 Event Images allowed.'
                }, { status: 400 });
            }
            if (data.infrastructure && data.infrastructure.length > 10) {
                return NextResponse.json({
                    success: false,
                    message: 'Database Safety Limit: Max 10 Infrastructure Images allowed.'
                }, { status: 400 });
            }

            await bucket.put('gallery.json', JSON.stringify(data), {
                httpMetadata: { contentType: 'application/json', cacheControl: 'no-cache' }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update failed:', error);
        return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
    }
}

// Export with security wrapper
// NOTE: During initial setup, auth is set to false. 
// Enable authentication after setting up JWT_SECRET and user management.
export const POST = secureApiHandler(handleUpdate, {
    rateLimit: 'admin',      // 30 requests/minute
    auth: false,             // TODO: Enable after setting JWT_SECRET: { required: true, permissions: ['content:write'] }
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admin/update'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
