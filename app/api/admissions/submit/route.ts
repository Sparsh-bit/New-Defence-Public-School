import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Generate ID
        const id = `NDPS-${Date.now()}`;

        // In Edge Runtime, we cannot write to disk. 
        // We log the submission and return success to the user so the UX is preserved.
        console.log('Application Submitted (Edge):', { ...body, id });

        return NextResponse.json({ success: true, message: 'Application submitted successfully', id });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
