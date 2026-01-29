import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newdefencepublicschool.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admissions/admin/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
