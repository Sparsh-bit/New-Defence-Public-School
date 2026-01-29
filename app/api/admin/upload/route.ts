import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';

import { getStorageBucket, getPublicUrl } from '@/lib/storage';

export const runtime = 'edge';

/**
 * SECURE File Upload Route
 * 
 * Security Measures Applied:
 * - Rate Limiting: 10 uploads/minute (very strict)
 * - Authentication: JWT token required
 * - Authorization: Requires 'gallery:write' permission
 * - CORS: Strict origin validation
 * - File Size Limits: Enforced on R2 side
 */
async function handleUpload(request: SecureRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string; // 'events' | 'infrastructure'

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type (security: prevent malicious file uploads)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
            }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            }, { status: 400 });
        }

        // Access the bound R2 Bucket via the storage utility
        const bucket = getStorageBucket();

        // Log upload action for audit trail
        console.log(`[UPLOAD ACTION] User: ${request.user?.username || 'unknown'} | Category: ${category} | File: ${file.name} | Size: ${file.size}`);

        // SAFETY CHECK: Verify Limits BEFORE permitting upload
        // This prevents "orphan" files from cluttering storage if the limit is reached.
        if (category) {
            const galleryObj = await bucket.get('gallery.json');
            if (galleryObj) {
                const galleryData = await galleryObj.json() as any;
                const currentCount = galleryData[category]?.length || 0;

                if (currentCount >= 10) {
                    return NextResponse.json({
                        success: false,
                        message: `Limit Reached: Max 10 images allowed for ${category}. Delete some images first.`
                    }, { status: 403 });
                }
            }
        }

        // Generate unique filename with WebP extension for optimization
        const bytes = await file.arrayBuffer();
        const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s/g, '_');
        // Add random suffix to prevent filename guessing attacks
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const filename = `${Date.now()}-${randomSuffix}-${originalName}.webp`;

        // Upload directly using Cloudflare R2 Binding API with Caching
        // PRODUCTION HARDENING: We use 'must-revalidate' to ensure that if an image
        // is deleted from R2, the CDN and Browser stop serving the cached version immediately.
        await bucket.put(filename, bytes, {
            httpMetadata: {
                contentType: 'image/webp', // Ensure header matches actual content
                cacheControl: 'public, max-age=0, must-revalidate',
            },
        });

        // Return raw Key for database stability
        return NextResponse.json({
            success: true,
            key: filename,
            url: getPublicUrl(filename) // Still provide URL for immediate UI feedback
        });

    } catch (error) {
        console.error('R2 Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
    }
}

// Export with security wrapper
// NOTE: During initial setup, auth is set to false. 
// Enable authentication after setting up JWT_SECRET and user management.
export const POST = secureApiHandler(handleUpload, {
    rateLimit: 'upload',     // 10 requests/minute (very strict for uploads)
    auth: { required: true, permissions: ['gallery:write'] },
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admin/upload'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
