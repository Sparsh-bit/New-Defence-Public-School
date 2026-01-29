import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';

import { getStorageBucket, cleanseUrl } from '@/lib/storage';

export const runtime = 'edge';

/**
 * SECURE Admin Update Route
 */
async function handleUpdate(request: SecureRequest) {
    try {
        const body = await request.json();

        // SAFETY 1: Max JSON Payload Size (200KB)
        const payloadSize = JSON.stringify(body).length;
        if (payloadSize > 200 * 1024) {
            return NextResponse.json({
                success: false,
                message: 'Database Safety Limit: Payload too large (Max 200KB)'
            }, { status: 413 });
        }

        const bucket = getStorageBucket();

        // Handle Gallery Text Updates
        if (body.type === 'gallery_meta') {
            const data = body.fullData;

            // Cleanse URLs into Keys for storage portability
            if (data.events) {
                data.events = data.events.map((url: string) => cleanseUrl(url));
            }
            if (data.infrastructure) {
                data.infrastructure = data.infrastructure.map((url: string) => cleanseUrl(url));
            }

            // SAFETY 3: Hard Limit 10 Images per Category
            if (data.events && data.events.length > 10) {
                return NextResponse.json({ success: false, message: 'Max 10 images allowed.' }, { status: 400 });
            }

            await bucket.put('gallery.json', JSON.stringify(data), {
                httpMetadata: { contentType: 'application/json', cacheControl: 'no-cache' }
            });
        }

        // Handle Downloads Meta Updates
        if (body.type === 'downloads_meta') {
            const data = body.fullData;

            // Cleanse URLs into Keys
            if (data.results) {
                data.results = data.results.map((doc: any) => ({ ...doc, url: cleanseUrl(doc.url) }));
            }
            if (data.general) {
                data.general = data.general.map((doc: any) => ({ ...doc, url: cleanseUrl(doc.url) }));
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
