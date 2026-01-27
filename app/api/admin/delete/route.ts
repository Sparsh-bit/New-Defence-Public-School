import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';
import { getStorageBucket } from '@/lib/storage';

export const runtime = 'edge';

/**
 * SECURE File Delete Route
 * 
 * Logic:
 * 1. Authenticate Request
 * 2. Parse filename from URL or body
 * 3. Delete from R2
 * 4. (Optional) Purge Cache if Cloudflare API keys exist
 */
async function handleDelete(request: SecureRequest) {
    try {
        const body = await request.json();
        const { url, filename: inputFilename } = body;

        let filename = inputFilename;

        // If URL is provided, extract filename
        if (url && !filename) {
            try {
                const urlObj = new URL(url);
                filename = urlObj.pathname.split('/').pop();
            } catch (e) {
                console.error('Invalid URL provided for deletion:', url);
            }
        }

        if (!filename) {
            return NextResponse.json({ success: false, message: 'Filename or URL is required' }, { status: 400 });
        }

        // Security: Prevent directory traversal - only allow alphanumeric, dots, dashes, underscores
        if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
            return NextResponse.json({ success: false, message: 'Invalid filename' }, { status: 400 });
        }

        const bucket = getStorageBucket();

        // 1. Delete from R2
        console.log(`[DELETE ACTION] User: ${request.user?.username || 'unknown'} | File: ${filename}`);
        await bucket.delete(filename);

        // 2. Cache Invalidation
        // Note: Full CDN purge requires Cloudflare API Token and Zone ID which aren't in env yet.
        // However, by deleting the object and using 'must-revalidate', the CDN will
        // catch the 404 on the next check.

        return NextResponse.json({
            success: true,
            message: `File ${filename} deleted successfully`
        });

    } catch (error) {
        console.error('R2 Delete Error:', error);
        return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 500 });
    }
}

export const POST = secureApiHandler(handleDelete, {
    rateLimit: 'admin',
    auth: { required: true, permissions: ['gallery:write'] },
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admin/delete'
});
