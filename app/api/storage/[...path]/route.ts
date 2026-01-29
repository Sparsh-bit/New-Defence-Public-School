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

        const { searchParams } = new URL(request.url);
        const forceDownload = searchParams.get('dl') === '1' || searchParams.get('download') === '1';

        const bucket = getStorageBucket();
        const obj = await bucket.get(fileKey);

        if (!obj) {
            return new Response('File not found', { status: 404 });
        }

        const data = await obj.arrayBuffer();

        // Determine content type
        const ext = fileKey.split('.').pop()?.toLowerCase();
        const mimeMap: Record<string, string> = {
            'pdf': 'application/pdf',
            'webp': 'image/webp',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'json': 'application/json',
            'csv': 'text/csv',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };

        const contentType = mimeMap[ext || ''] || 'application/octet-stream';
        const filename = fileKey.split('/').pop() || 'file';

        return new Response(data, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
                'Vary': 'Origin',
                'Content-Disposition': forceDownload ? `attachment; filename="${filename}"` : 'inline'
            }
        });
    } catch (error) {
        console.error(`[STORAGE PROXY] Error serving file:`, error);
        return new Response('Error serving file', { status: 500 });
    }
}
