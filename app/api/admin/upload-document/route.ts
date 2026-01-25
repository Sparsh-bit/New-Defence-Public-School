import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';
import { getStorageBucket, getPublicUrl } from '@/lib/storage';

// INDUSTRY LEVEL: Use dynamic runtime
// Locally we use 'nodejs' for filesystem access, in production we use 'edge' for speed.
export const runtime = 'edge';

/**
 * SECURE Document Upload Route
 */
async function handleUpload(request: SecureRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ success: false, message: 'Invalid file type. Only PDF allowed.' }, { status: 400 });
        }

        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, message: 'File too large (Max 20MB)' }, { status: 400 });
        }

        const bucket = getStorageBucket();

        // Check limits for results
        if (category === 'results') {
            const downloadsObj = await bucket.get('downloads.json');
            if (downloadsObj) {
                const downloadsData = await downloadsObj.json() as any;
                if ((downloadsData.results?.length || 0) >= 3) {
                    return NextResponse.json({
                        success: false,
                        message: 'Limit Reached: Max 3 result PDFs allowed.'
                    }, { status: 403 });
                }
            }
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '_');
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const filename = `docs/${category}/${Date.now()}-${randomSuffix}-${originalName}.pdf`;

        // Upload to Storage (R2 in Prod, Disk in Dev)
        await bucket.put(filename, buffer as any, {
            httpMetadata: {
                contentType: 'application/pdf',
                contentDisposition: `attachment; filename="${file.name}"`,
                cacheControl: 'public, max-age=31536000, immutable',
            },
        });

        const publicUrl = getPublicUrl(filename);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: file.name
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export const POST = secureApiHandler(handleUpload, {
    rateLimit: 'upload',
    auth: { required: true, permissions: ['gallery:write'] },
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admin/upload-document'
});

export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
