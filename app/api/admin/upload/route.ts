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

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

        // Upload directly using Cloudflare R2 Binding API
        await bucket.put(filename, bytes, {
            httpMetadata: {
                contentType: file.type,
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
