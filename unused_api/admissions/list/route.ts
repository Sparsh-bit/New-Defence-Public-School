import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        // Edge runtime cannot read local FS. Return empty list.
        return NextResponse.json(
            { success: true, applications: [] },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch applications' },
            { status: 500 }
        );
    }
}
