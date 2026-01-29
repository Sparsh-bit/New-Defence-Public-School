import { getStorageBucket } from '@/lib/storage';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * PRODUCTION-READY Storage Proxy
 * 
 * This route serves files directly from the R2 bucket.
 * It provides a reliable fallback for when a public R2 domain is not configured or accessible.
 * 
 * Path: /api/storage/[...path]
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        // Next.js 15: params must be awaited
        const resolvedParams = await params;
        const pathSegments = resolvedParams.path;

        // Correctly handle the catch-all parameters
        // The file key in R2 is the path joined back together
        const fileKey = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;

        if (!fileKey) {
            return new Response('Missing file key', { status: 400 });
        }

        const bucket = getStorageBucket();
        const obj = await bucket.get(fileKey);

        if (!obj) {
            return new Response('File not found', { status: 404 });
        }

        const data = await obj.arrayBuffer();

        // Determine content type
        let contentType = 'application/octet-stream';
        if (fileKey.endsWith('.pdf')) contentType = 'application/pdf';
        else if (fileKey.endsWith('.webp')) contentType = 'image/webp';
        else if (fileKey.endsWith('.png')) contentType = 'image/png';
        else if (fileKey.endsWith('.jpg') || fileKey.endsWith('.jpeg')) contentType = 'image/jpeg';
        else if (fileKey.endsWith('.json')) contentType = 'application/json';
        else if (fileKey.endsWith('.csv')) contentType = 'text/csv';

        return new Response(data, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable', // Long-term cache for storage
                'Access-Control-Allow-Origin': '*', // Allow CORS for these assets
                'Content-Disposition': fileKey.endsWith('.pdf') ? 'inline' : 'inline' // Show images/pdfs in browser
            }
        });
    } catch (error) {
        console.error(`[STORAGE PROXY] Error serving file:`, error);
        return new Response('Error serving file', { status: 500 });
    }
}
