import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Mock content for Edge Runtime
const FALLBACK_CONTENT = {
    news: [
        {
            title: "Republic Day Celebration 2026",
            description: "Celebrating the spirit of India with a grand parade and cultural program on January 26th.",
            date: "26-01-2026",
            type: "event",
            highlight: true
        }
    ],
    gallery: {
        events: [
            "/images/slider/ndps.jpg",
            "/images/slider/02.jpg",
            "/images/slider/03.jpg"
        ],
        infrastructure: [
            "/images/infrastructure/01.jpg",
            "/images/infrastructure/12.jpg"
        ]
    }
};

export async function GET() {
    // In Edge Runtime, we cannot read local JSON files.
    // Serving fallback content to ensure site functionality.
    return NextResponse.json(FALLBACK_CONTENT);
}
