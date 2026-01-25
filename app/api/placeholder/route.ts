import { getStorageBucket } from '@/lib/storage';

export const runtime = process.env.NODE_ENV === 'production' ? 'edge' : 'nodejs';

/**
 * Development-only File Server
 * Industry Level: Proxies requests to local disk-based storage during development.
 */
export async function GET(request: Request) {
    if (process.env.NODE_ENV !== 'development') {
        return new Response('Not Found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('file');

    if (!fileKey) return new Response('Missing file key', { status: 400 });

    try {
        const bucket = getStorageBucket();
        const obj = await bucket.get(fileKey);

        if (!obj) {
            console.error(`[DEV SERVER] File not found: ${fileKey}`);
            return new Response('File not found in dev storage', { status: 404 });
        }

        const data = await obj.arrayBuffer();

        // Detect content type
        let contentType = 'application/octet-stream';
        if (fileKey.endsWith('.pdf')) contentType = 'application/pdf';
        else if (fileKey.endsWith('.webp')) contentType = 'image/webp';
        else if (fileKey.endsWith('.png')) contentType = 'image/png';
        else if (fileKey.endsWith('.jpg') || fileKey.endsWith('.jpeg')) contentType = 'image/jpeg';
        else if (fileKey.endsWith('.json')) contentType = 'application/json';

        return new Response(data, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache',
                'Content-Disposition': fileKey.endsWith('.pdf') ? 'inline' : 'attachment'
            }
        });
    } catch (error) {
        console.error(`[DEV SERVER] Error serving ${fileKey}:`, error);
        return new Response('Error serving file', { status: 500 });
    }
}
