import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

// Initialize S3 Client for Cloudflare R2
const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

        // Upload to R2
        await R2.send(new PutObjectCommand({
            Bucket: 'new-defence-public-school',
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        }));

        // Return Public URL
        // User needs to set R2_PUBLIC_URL in .env (e.g., https://pub-xxx.r2.dev)
        // If not set, we can't show it, but for now we assume it will be set.
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
