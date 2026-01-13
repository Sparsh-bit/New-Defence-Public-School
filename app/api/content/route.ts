import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

export async function GET() {
    try {
        const content = fs.readFileSync(contentFilePath, 'utf8');
        return NextResponse.json(JSON.parse(content));
    } catch (error) {
        console.error('Error reading content file:', error);
        return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
    }
}
