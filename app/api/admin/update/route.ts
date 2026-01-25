import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';

import { getStorageBucket } from '@/lib/storage';

export const runtime = process.env.NODE_ENV === 'production' ? 'edge' : 'nodejs';

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

        // Access the bound R2 Bucket via the storage utility
        const bucket = getStorageBucket();

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

        // Handle Downloads Meta Updates
        if (body.type === 'downloads_meta') {
            const data = body.fullData;

            // SAFETY: Max 3 Results PDFs
            if (data.results && data.results.length > 3) {
                return NextResponse.json({
                    success: false,
                    message: 'Database Safety Limit: Max 3 Result PDFs allowed.'
                }, { status: 400 });
            }

            // Max 10 General PDFs
            if (data.general && data.general.length > 10) {
                return NextResponse.json({
                    success: false,
                    message: 'Database Safety Limit: Max 10 General PDFs allowed.'
                }, { status: 400 });
            }

            await bucket.put('downloads.json', JSON.stringify(data), {
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
    rateLimit: 'admin', auth: { required: true, permissions: ['content:write'] }, cors: true, securityHeaders: true, endpoint: '/api/admin/update'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
