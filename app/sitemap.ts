import type { MetadataRoute } from 'next';
import { getHeroSection, getBrandingSection, getGallerySection } from '@/lib/siteSettings';
import { urlFor } from '@/lib/sanity/client';
import { FALLBACK_HERO_IMAGE } from '@/components/landing/Hero';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://royalopticals.com';
  const [hero, branding, gallery] = await Promise.all([
    getHeroSection(),
    getBrandingSection(),
    getGallerySection(),
  ]);

  // Surfacing the key brand/clinic photos here (rather than just the page
  // URL) gives Google Image Search something to index against this page.
  const images = [
    hero.heroImage ? urlFor(hero.heroImage).width(1200).url() : FALLBACK_HERO_IMAGE,
    branding.logo ? urlFor(branding.logo).width(512).url() : undefined,
    gallery.examRoomImage ? urlFor(gallery.examRoomImage).width(1200).url() : undefined,
  ].filter((url): url is string => Boolean(url));

  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1, images }];
}
