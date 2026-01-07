import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Create data directory if it doesn't exist
        const dataDir = path.join(process.cwd(), 'data');
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
        }

        // File path for storing applications
        const filePath = path.join(dataDir, 'applications.json');

        // Read existing applications or create new array
        let applications = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            applications = JSON.parse(fileContent);
        } catch {
            // File doesn't exist yet, start with empty array
            applications = [];
        }

        // Add new application with unique ID and timestamp
        const newApplication = {
            id: Date.now().toString(),
            ...data,
            submittedAt: new Date().toISOString(),
        };

        applications.push(newApplication);

        // Save updated applications
        await fs.writeFile(filePath, JSON.stringify(applications, null, 2), 'utf-8');

        return NextResponse.json(
            { success: true, message: 'Application submitted successfully', id: newApplication.id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error saving application:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to submit application' },
            { status: 500 }
        );
    }
}
