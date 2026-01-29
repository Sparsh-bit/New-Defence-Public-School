import { NextResponse } from 'next/server';
import { secureApiHandler } from '@/lib/security';

import { getStorageBucket, getPublicUrl } from '@/lib/storage';

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
    },
    downloads: {
        general: [],
        results: []
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
async function handleContent(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isFresh = searchParams.get('fresh') === '1';

        const bucket = getStorageBucket();
        let content = { ...FALLBACK_CONTENT } as any;

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
                    // Normalize URLs: ensure every URL is correctly formatted through getPublicUrl
                    if (galleryData.events) {
                        content.gallery.events = galleryData.events.map((url: string) => getPublicUrl(url));
                    }
                    if (galleryData.infrastructure) {
                        content.gallery.infrastructure = galleryData.infrastructure.map((url: string) => getPublicUrl(url));
                    }
                }
            }

            // 3. Fetch Downloads
            const downloadsObj = await bucket.get('downloads.json');
            if (downloadsObj) {
                const downloadsData = await downloadsObj.json() as any;
                if (downloadsData) {
                    // Normalize Download URLs
                    if (downloadsData.results) {
                        downloadsData.results = downloadsData.results.map((doc: any) => ({
                            ...doc,
                            url: getPublicUrl(doc.url)
                        }));
                    }
                    if (downloadsData.general) {
                        downloadsData.general = downloadsData.general.map((doc: any) => ({
                            ...doc,
                            url: getPublicUrl(doc.url)
                        }));
                    }
                    content.downloads = downloadsData;
                }
            }
        }

        // PROFESIONAL CACHE STRATEGY:
        // - Development: Never cache
        // - Admin/Fresh Request: Never cache
        // - Production Public: Cache but revalidate every time (ensures instant updates)
        const cacheControl = (process.env.NODE_ENV === 'development' || isFresh)
            ? 'no-store, max-age=0, must-revalidate'
            : 'public, max-age=0, must-revalidate, stale-while-revalidate=30';

        return new Response(JSON.stringify(content), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': cacheControl,
                'X-Content-Source': isFresh ? 'Direct-R2' : 'Edge-Cache'
            }
        });
    } catch (error) {
        console.error('Content fetch failed:', error);
        // Fallback to static with no-cache to be safe
        return new Response(JSON.stringify(FALLBACK_CONTENT), {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    }
}

// Export with security wrapper - lenient rate limiting for public content
export const GET = secureApiHandler(handleContent, {
    rateLimit: 'public',     // 30 requests/minute (strict enough for public content)
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
