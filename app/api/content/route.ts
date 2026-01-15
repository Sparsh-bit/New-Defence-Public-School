import { NextResponse } from 'next/server';
import { secureApiHandler } from '@/lib/security';

export const runtime = 'edge';

// Define minimal R2 types for TS
interface R2ObjectBody {
    json<T>(): Promise<T>;
}

interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(key: string, value: any, options?: any): Promise<any>;
}

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

/**
 * SECURE Public Content Route
 * 
 * Security Measures Applied:
 * - Rate Limiting: Lenient (200 req/min) for public content
 * - No Authentication: Public content accessible to all
 * - CORS: Strict origin validation
 * - Caching headers for performance
 */
async function handleContent() {
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

        // Add cache headers for performance (5 minutes cache)
        return new Response(JSON.stringify(content), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
            }
        });
    } catch (error) {
        console.error('Content fetch failed:', error);
        // Fallback to static
        return NextResponse.json(FALLBACK_CONTENT);
    }
}

// Export with security wrapper - lenient rate limiting for public content
export const GET = secureApiHandler(handleContent, {
    rateLimit: 'public',     // 200 requests/minute (lenient for public content)
    auth: false,             // Public content - no auth
    cors: true,
    securityHeaders: true,
    endpoint: '/api/content'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
