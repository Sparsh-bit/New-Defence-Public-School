import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newdefencepublicschool.com'

    const routes = [
        '',
        '/about',
        '/about/school',
        '/about/management',
        '/about/vision',
        '/about/infrastructure',
        '/about/curriculum',
        '/admissions/process',
        '/admissions/apply',
        '/admissions/fees',
        '/academics/examination',
        '/academics/uniform',
        '/gallery/photos',
        '/gallery/videos',
        '/gallery/events',
        '/achievements',
        '/contact',
        '/downloads',
        '/rules/conduct',
        '/rules/parents',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))
}
