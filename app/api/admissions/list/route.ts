import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'applications.json');

export async function GET() {
    try {
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({ success: true, applications: [] });
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        const applications = JSON.parse(fileContent);

        return NextResponse.json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
