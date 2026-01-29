import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';
import { getStorageBucket, cleanseUrl } from '@/lib/storage';

export const runtime = 'edge';

/**
 * SECURE File Delete Route
 */
async function handleDelete(request: SecureRequest) {
    try {
        const body = await request.json();
        const { url, filename: inputFilename } = body;

        // Use CLEANSE logic to get the raw R2 key (handles folders and proxies)
        const filename = inputFilename || cleanseUrl(url);

        if (!filename) {
            return NextResponse.json({ success: false, message: 'Filename or URL is required' }, { status: 400 });
        }

        // Security: Prevent directory traversal but allow slashes for subfolders
        if (!/^[a-zA-Z0-9._\-/]+$/.test(filename)) {
            return NextResponse.json({ success: false, message: 'Invalid filename' }, { status: 400 });
        }

        const bucket = getStorageBucket();

        // 1. Delete from R2
        console.log(`[DELETE ACTION] User: ${request.user?.username || 'unknown'} | Key: ${filename}`);
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
