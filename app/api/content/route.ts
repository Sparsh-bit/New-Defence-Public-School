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
    // In Edge Runtime, we cannot read local JSON files.
    // Serving fallback content to ensure site functionality.
    return NextResponse.json(FALLBACK_CONTENT);
}
