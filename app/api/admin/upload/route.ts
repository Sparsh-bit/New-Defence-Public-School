import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
    // File upload requires persistent storage (S3/R2) which is not configured.
    // Return a mock success with a placeholder image for demonstration.
    return NextResponse.json({
        success: true,
        url: '/images/slider/ndps.jpg' // Fallback image
    });
}
