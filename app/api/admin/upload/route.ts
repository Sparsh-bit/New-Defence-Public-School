import { NextResponse } from 'next/server';

export const runtime = 'edge';

// NOTE: This route relies on Cloudflare Pages/Workers Bindings.
// The R2 Bucket MUST be bound with the variable name: "NDPS_BUCKET"
// The R2 Public Domain must be set in Environment Variables as "R2_PUBLIC_URL"

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        // Access the bound R2 Bucket from the environment
        // In Next.js on Cloudflare Pages, bindings are exposed on process.env
        const bucket = process.env.NDPS_BUCKET as unknown as R2Bucket;

        if (!bucket) {
            console.error("R2 Bucket binding 'NDPS_BUCKET' not found.");
            return NextResponse.json({ success: false, message: 'Server Configuration Error: Bucket not bound' }, { status: 500 });
        }

        // Generate unique filename with WebP extension for optimization
        const bytes = await file.arrayBuffer();
        const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s/g, '_');
        const filename = `${Date.now()}-${originalName}.webp`;

        // Upload directly using Cloudflare R2 Binding API with Caching
        // OPTIMIZATION: Cache-Control header creates "Forever Free" usage pattern
        // by telling browsers to never fetch this image again after the first time.
        // This saves millions of 'Class B' operations.
        await bucket.put(filename, bytes, {
            httpMetadata: {
                contentType: 'image/webp', // Ensure header matches actual content
                cacheControl: 'public, max-age=31536000, immutable', // Cache for 1 year
            },
        });

        // Return Public URL
        // R2_PUBLIC_URL should be your R2 public domain (e.g., https://pub-xxx.r2.dev) set in env vars
        const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl
        });

    } catch (error) {
        console.error('R2 Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
    }
}
