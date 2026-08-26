import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://royalopticals.com';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/studio', '/studio/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
