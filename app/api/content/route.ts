import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Mock content for Edge Runtime
const FALLBACK_CONTENT = {
    news: [
        {
            title: "Republic Day Celebration 2026",
            description: "Celebrating the spirit of India with a grand parade and cultural program on January 26th.",
            date: "2026-01-26",
            type: "event",
            highlight: true
        }
    ],
    gallery: {
        events: [
            "/images/slider/ndps.jpg",
            "/images/slider/02.jpg",
            "/images/slider/04.jpg",
            "/images/slider/05.jpg",
            "/images/slider/06.jpg",
            "/images/slider/07.jpg"
        ],
        infrastructure: [
            "/images/infrastructure/01.jpg",
            "/images/infrastructure/12.jpg",
            "/images/infrastructure/fl1.jpg",
            "/images/infrastructure/fl10.jpg"
        ]
    }
};

export async function GET() {
    try {
        const bucket = process.env.NDPS_BUCKET as unknown as R2Bucket;
        let content = { ...FALLBACK_CONTENT };

        if (bucket) {
            // 1. Fetch News
            const newsObj = await bucket.get('news.json');
            if (newsObj) {
                const newsData = await newsObj.json();
                if (Array.isArray(newsData)) {
                    content.news = newsData; // Override with live DB data
                }
            }

            // 2. Fetch Gallery
            const galleryObj = await bucket.get('gallery.json');
            if (galleryObj) {
                const galleryData = await galleryObj.json() as any;
                if (galleryData) {
                    // Merge or Override. Let's Override to ensure Admin has full control.
                    if (galleryData.events) content.gallery.events = galleryData.events;
                    if (galleryData.infrastructure) content.gallery.infrastructure = galleryData.infrastructure;
                }
            }
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Content fetch failed:', error);
        // Fallback to static
        return NextResponse.json(FALLBACK_CONTENT);
    }
}
