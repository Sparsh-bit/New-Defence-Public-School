import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), 'data', 'applications.json');

        // Read applications file
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const applications = JSON.parse(fileContent);

            return NextResponse.json(
                { success: true, applications },
                { status: 200 }
            );
        } catch {
            // File doesn't exist yet, return empty array
            return NextResponse.json(
                { success: true, applications: [] },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch applications' },
            { status: 500 }
        );
    }
}
