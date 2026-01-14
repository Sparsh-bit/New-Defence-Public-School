import { NextResponse } from 'next/server';

// Define R2 Types locally
interface R2ObjectBody {
    json<T>(): Promise<T>;
}
interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(key: string, value: any, options?: any): Promise<any>;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string; // 'events' | 'infrastructure'

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        // Access the bound R2 Bucket from the environment
        const bucket = process.env.NDPS_BUCKET as unknown as R2Bucket;

        if (!bucket) {
            console.error("R2 Bucket binding 'NDPS_BUCKET' not found.");
            return NextResponse.json({ success: false, message: 'Server Configuration Error: Bucket not bound' }, { status: 500 });
        }

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
