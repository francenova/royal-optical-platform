import type { Metadata } from 'next';
import { Anton, Source_Sans_3, Space_Mono } from 'next/font/google';
import './globals.css';
import { getBrandingSection, getHeroSection } from '@/lib/siteSettings';
import { urlFor } from '@/lib/sanity/client';
import { FALLBACK_HERO_IMAGE } from '@/components/landing/Hero';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://royalopticals.com';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-source-sans-3',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const [branding, hero] = await Promise.all([getBrandingSection(), getHeroSection()]);
  const clinicName = branding.clinicName || 'Royal Opticals';
  const title = `${clinicName} — Eye Clinic & Optical Studio`;
  const description =
    'Comprehensive eye exams, expert lens fitting, and curated designer frames, contact lenses, and eyewear at Royal Opticals in Villianur, Puducherry. Book your appointment today.';
  const ogImage = hero.heroImage
    ? urlFor(hero.heroImage).width(1200).height(630).fit('crop').quality(80).url()
    : FALLBACK_HERO_IMAGE;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    keywords: [
      'eye clinic',
      'optical shop',
      'optician',
      'eye exam',
      'eyeglasses',
      'designer frames',
      'contact lenses',
      'Puducherry',
      'Villianur',
      'Royal Opticals',
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: clinicName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: hero.heroImageAlt || title }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${sourceSans3.variable} ${spaceMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Material Symbols variable font isn't available via next/font/google */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
