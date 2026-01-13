import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, action, data } = body;

        // Read current content
        const fileContent = fs.readFileSync(contentFilePath, 'utf8');
        const db = JSON.parse(fileContent);

        if (action === 'update_news') {
            // Add new item to the beginning
            db.news = [data, ...db.news];
        }
        else if (action === 'delete_news') {
            db.news = db.news.filter((item: any) => item.id !== data.id);
        }
        else if (action === 'add_image') {
            // data should look like { category: 'events', url: '...' }
            const { category, url } = data;
            if (db.gallery[category]) {
                db.gallery[category].push(url);
            }
        }
        else if (action === 'delete_image') {
            const { category, url } = data;
            if (db.gallery[category]) {
                db.gallery[category] = db.gallery[category].filter((img: string) => img !== url);
            }
        }

        // Save back to file
        fs.writeFileSync(contentFilePath, JSON.stringify(db, null, 4));

        return NextResponse.json({ success: true, message: 'Update processed' });

    } catch (error) {
        console.error('Admin update error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
