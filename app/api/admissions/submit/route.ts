import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Note: Filesystem usage is not possible in Cloudflare Pages (Edge Runtime).
        // This is a mock implementation to allow build success.
        // For production, integrate with Cloudflare D1, KV, or external DB.
        console.log("Mock submission received:", data);

        const newApplication = {
            id: Date.now().toString(),
            ...data,
            submittedAt: new Date().toISOString(),
        };

        return NextResponse.json(
            { success: true, message: 'Application submitted successfully (Simulation)', id: newApplication.id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in mock submission:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to submit application' },
            { status: 500 }
        );
    }
}
