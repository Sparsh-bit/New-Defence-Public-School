import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
    // Mock delete for Edge
    return NextResponse.json({ success: true, message: 'Deleted successfully (Mock)' });
}
