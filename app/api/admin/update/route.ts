import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
    // Mock update for Edge
    return NextResponse.json({ success: true, message: 'Content updated successfully (Mock)' });
}
