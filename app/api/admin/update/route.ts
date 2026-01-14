import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Use R2 Bucket as a JSON Database
        const bucket = process.env.NDPS_BUCKET as unknown as R2Bucket;

        if (!bucket) {
            return NextResponse.json({ success: false, message: 'Bucket not bound' }, { status: 500 });
        }

        // Handle News Updates
        if (body.type === 'news') {
            // We expect the client to send the FULL updated list of news
            // This is a simple "File DB" approach.
            // body.data should be the array or the item to add.
            // For robustness, let's assume body.data is the *full list* if action is 'save_all', 
            // OR we handle read-modify-write here (risky without strong consistency).
            // Let's stick to: Client sends action 'update_full_list' with data: [Array]

            // Simpler for this context: The Admin page sends the single new item, 
            // BUT since this is a "JSON File DB", we really need to Read -> Modify -> Write, 
            // or trust the client to send the whole state.

            // Let's rely on the client sending the *entire* new state to overwrite the file.
            // It's the safest simple implementation for a single admin.

            const fullList = body.fullList; // Expects array of news
            await bucket.put('news.json', JSON.stringify(fullList), {
                httpMetadata: { contentType: 'application/json', cacheControl: 'no-cache' }
            });
        }

        // Handle Gallery Text Updates (if we wanted to store gallery metadata later)
        if (body.type === 'gallery_meta') {
            await bucket.put('gallery.json', JSON.stringify(body.fullData), {
                httpMetadata: { contentType: 'application/json', cacheControl: 'no-cache' }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update failed:', error);
        return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
    }
}
