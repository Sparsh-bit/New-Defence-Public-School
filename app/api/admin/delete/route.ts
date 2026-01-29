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
        const filename = (inputFilename || cleanseUrl(url) || '').trim();

        // PROFESSIONAL RESILIENCE:
        // If filename is empty, we're likely cleaning up a broken DB entry.
        // Return success so the frontend can finish removing the entry from the JSON metadata.
        if (!filename) {
            console.log(`[DELETE SKIP] User: ${request.user?.username || 'unknown'} | Reason: Empty Key (Cleanup)`);
            return NextResponse.json({ success: true, message: 'Cleaned up empty entry' });
        }

        // SECURITY: Prevent directory traversal but allow subfolders
        if (!/^[a-zA-Z0-9._\-/ ]+$/.test(filename)) {
            return NextResponse.json({ success: false, message: 'Invalid filename format' }, { status: 400 });
        }

        // SKIP LOCAL ASSETS: If it starts with 'images/', it's local public storage, not R2.
        if (filename.startsWith('images/')) {
            console.log(`[DELETE SKIP] User: ${request.user?.username || 'unknown'} | Reason: Local Static Asset | Key: ${filename}`);
            return NextResponse.json({ success: true, message: 'Skipped local asset' });
        }

        const bucket = getStorageBucket();

        // 1. Delete from R2
        console.log(`[DELETE ACTION] User: ${request.user?.username || 'unknown'} | Key: ${filename}`);
        await bucket.delete(filename);

        return NextResponse.json({
            success: true,
            message: `File ${filename} deleted successfully`
        });

    } catch (error) {
        console.error('R2 Delete Error:', error);
        return NextResponse.json({ success: false, message: 'Internal delete error' }, { status: 500 });
    }
}

export const POST = secureApiHandler(handleDelete, {
    rateLimit: 'admin',
    auth: { required: true, permissions: ['gallery:write'] },
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admin/delete'
});
