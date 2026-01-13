import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'applications.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Generate new ID
        const id = `NDPS-${Date.now()}`;
        const newApplication = {
            id,
            ...body
        };

        let applications = [];
        if (fs.existsSync(dataFilePath)) {
            const fileContent = fs.readFileSync(dataFilePath, 'utf8');
            applications = JSON.parse(fileContent);
        }

        // Add new application to beginning
        applications = [newApplication, ...applications];

        // Save
        fs.writeFileSync(dataFilePath, JSON.stringify(applications, null, 4));

        return NextResponse.json({ success: true, message: 'Application submitted successfully', id });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
