import { NextResponse } from 'next/server';

export const runtime = 'edge';

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
        const body = await request.json();

        // SAFETY 1: Max JSON Payload Size (200KB)
        // This ensures the database files (news.json, gallery.json) never grow large enough to cause issues.
        const payloadSize = JSON.stringify(body).length;
        if (payloadSize > 200 * 1024) {
            return NextResponse.json({
                success: false,
                message: 'Database Safety Limit: Payload too large (Max 200KB)'
            }, { status: 413 });
        }

        // Use R2 Bucket as a JSON Database
        const bucket = process.env.NDPS_BUCKET as unknown as R2Bucket;

        if (!bucket) {
            return NextResponse.json({ success: false, message: 'Bucket not bound' }, { status: 500 });
        }

        // Handle News Updates
        if (body.type === 'news') {
            const fullList = body.fullList;

            // SAFETY 2: Max Item Count check (50 items)
            if (Array.isArray(fullList) && fullList.length > 50) {
                return NextResponse.json({
                    success: false,
                    message: 'Database Safety Limit: Max 50 News Items allowed.'
                }, { status: 400 });
            }

            await bucket.put('news.json', JSON.stringify(fullList), {
                httpMetadata: { contentType: 'application/json', cacheControl: 'no-cache' }
            });
        }

        // Handle Gallery Text Updates
        if (body.type === 'gallery_meta') {
            const data = body.fullData;

            // SAFETY 3: Hard Limit 10 Images per Category
            // This is the CRITICAL "Forever Free" enforcement.
            // Even if client-side validation is bypassed, this blocks the database update.
            if (data.events && data.events.length > 10) {
                return NextResponse.json({
                    success: false,
                    message: 'Database Safety Limit: Max 10 Event Images allowed.'
                }, { status: 400 });
            }
            if (data.infrastructure && data.infrastructure.length > 10) {
                return NextResponse.json({
                    success: false,
                    message: 'Database Safety Limit: Max 10 Infrastructure Images allowed.'
                }, { status: 400 });
            }

            await bucket.put('gallery.json', JSON.stringify(data), {
                httpMetadata: { contentType: 'application/json', cacheControl: 'no-cache' }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update failed:', error);
        return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
    }
}
