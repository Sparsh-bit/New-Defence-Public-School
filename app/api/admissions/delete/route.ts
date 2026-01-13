import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'applications.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
        }

        if (fs.existsSync(dataFilePath)) {
            const fileContent = fs.readFileSync(dataFilePath, 'utf8');
            let applications = JSON.parse(fileContent);
            applications = applications.filter((app: any) => app.id !== id);
            fs.writeFileSync(dataFilePath, JSON.stringify(applications, null, 4));
        }

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
