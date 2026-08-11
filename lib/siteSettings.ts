import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// ── Section-specific types for component props ──

export interface HeroSectionData {
  badgeText: string;
  heading: string;
  headingAccent: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  heroImage: SanityImageSource;
  heroImageAlt: string;
  orbitText: string;
}

export interface BrandingSectionData {
  clinicName: string;
  tagline: string;
  logo: SanityImageSource;
  footerDescription: string;
}

export interface FounderSectionData {
  sectionLabel: string;
  headingLine1: string;
  headingLine2: string;
  paragraph1: string;
  paragraph2: string;
  founderPortrait: SanityImageSource;
  backgroundImage: SanityImageSource;
  yearsOfExcellence: number;
  statLabel: string;
  secondStatValue: string;
  secondStatLabel: string;
}

export interface GallerySectionData {
  heading: string;
  examRoomImage: SanityImageSource;
  frameWallImage: SanityImageSource;
  styleBarImage: SanityImageSource;
  fittingStudioImage: SanityImageSource;
}

export interface ContactSectionData {
  heading: string;
  headingAccent: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  address: string;
  mapEmbedUrl: string;
  mapDirectionsUrl: string;
}

export interface FooterSectionData {
  copyrightText: string;
  designPhilosophy: string;
  builtWith: string;
  newsletterHeading: string;
  newsletterDescription: string;
}

// ── Backward-compatible SiteSettings (aggregated from sections) ──

export interface SiteSettings {
  clinicName: string;
  yearsOfExcellence: number;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
  mapDirectionsUrl: string;
}

// ── Fallback defaults ──

export const FALLBACK_HERO: HeroSectionData = {
  badgeText: 'Medical Excellence — Curated Style',
  heading: 'ROYAL OPTICALS',
  headingAccent: 'DEDICATED TO YOUR EYE HEALTH.',
  description:
    'For over 12 years, Royal Opticals has paired clinical precision with high-end editorial sophistication. Experience the luxury of seeing clearly.',
  primaryButtonText: 'Explore Services',
  primaryButtonLink: '#services',
  secondaryButtonText: 'View Catalog',
  secondaryButtonLink: '#full-catalog',
  heroImage: null as unknown as SanityImageSource,
  heroImageAlt: 'Optometrist holding luxury gold-rimmed glasses in a minimalist clinical setting',
  orbitText: 'BOOK VIA WHATSAPP • CLINICAL EXCELLENCE •',
};

export const FALLBACK_BRANDING: BrandingSectionData = {
  clinicName: 'Royal Opticals',
  tagline: '',
  logo: null as unknown as SanityImageSource,
  footerDescription:
    'Pairing clinical precision with everyday style — comprehensive eye exams, expert lens fitting, and frames chosen for how you actually see the world.',
};

export const FALLBACK_FOUNDER: FounderSectionData = {
  sectionLabel: 'Philosophy',
  headingLine1: 'THE FOUNDER',
  headingLine2: 'THE STANDARD',
  paragraph1:
    'Royal Opticals was forged from a singular vision: to create an uncompromising environment for high-performance individuals. We strip away the noise and focus entirely on the pure, unfiltered pursuit of visual clarity.',
  paragraph2:
    'Here, state-of-the-art biomechanics meet raw clinical expertise. Every square foot of our studio is meticulously designed to optimize your visual output.',
  founderPortrait: null as unknown as SanityImageSource,
  backgroundImage: null as unknown as SanityImageSource,
  yearsOfExcellence: 12,
  statLabel: 'Years of Excellence',
  secondStatValue: 'Elite',
  secondStatLabel: 'Clinical Equipment',
};

export const FALLBACK_GALLERY: GallerySectionData = {
  heading: 'Welcome to the studio',
  examRoomImage: null as unknown as SanityImageSource,
  frameWallImage: null as unknown as SanityImageSource,
  styleBarImage: null as unknown as SanityImageSource,
  fittingStudioImage: null as unknown as SanityImageSource,
};

export const FALLBACK_CONTACT: ContactSectionData = {
  heading: 'SECURE YOUR',
  headingAccent: 'SESSION',
  phone: '+919092919432',
  email: 'rizupapa123@gmail.com',
  whatsappNumber: '919092919432',
  address: 'WQ63+5QP, Villupuram Main Rd, Kottaimedu, Villianur, Puducherry 605110',
  mapEmbedUrl:
    'https://www.google.com/maps?q=WQ63%2B5QP%2C+Villupuram+Main+Rd%2C+Kottaimedu%2C+Villianur%2C+Puducherry+605110&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=WQ63%2B5QP%2C+Villupuram+Main+Rd%2C+Kottaimedu%2C+Villianur%2C+Puducherry+605110',
};

export const FALLBACK_FOOTER: FooterSectionData = {
  copyrightText: '© 2024 Royal Opticals. Medical Excellence & Curated Style.',
  designPhilosophy: 'Design Philosophy: Medical Luxury',
  builtWith: 'Built with Precision',
  newsletterHeading: 'Newsletter',
  newsletterDescription: 'Receive curated style updates and eye care tips directly to your inbox.',
};

const FALLBACK_SITE_SETTINGS: SiteSettings = {
  clinicName: FALLBACK_BRANDING.clinicName,
  yearsOfExcellence: FALLBACK_FOUNDER.yearsOfExcellence,
  phone: FALLBACK_CONTACT.phone,
  whatsappNumber: FALLBACK_CONTACT.whatsappNumber,
  email: FALLBACK_CONTACT.email,
  address: FALLBACK_CONTACT.address,
  mapEmbedUrl: FALLBACK_CONTACT.mapEmbedUrl,
  mapDirectionsUrl: FALLBACK_CONTACT.mapDirectionsUrl,
};

// ── Fetchers ──

async function fetchSection<T>(query: string, fallback: T): Promise<T> {
  try {
    const { sanityClient } = await import('@/lib/sanity/client');
    const doc = await sanityClient.fetch(query);
    if (!doc) return fallback;
    // Merge doc over fallback so missing fields still have defaults
    return { ...fallback, ...doc };
  } catch {
    return fallback;
  }
}

export async function getHeroSection(): Promise<HeroSectionData> {
  const { HERO_SECTION_QUERY } = await import('@/lib/sanity/queries');
  return fetchSection(HERO_SECTION_QUERY, FALLBACK_HERO);
}

export async function getBrandingSection(): Promise<BrandingSectionData> {
  const { BRANDING_SECTION_QUERY } = await import('@/lib/sanity/queries');
  return fetchSection(BRANDING_SECTION_QUERY, FALLBACK_BRANDING);
}

export async function getFounderSection(): Promise<FounderSectionData> {
  const { FOUNDER_SECTION_QUERY } = await import('@/lib/sanity/queries');
  return fetchSection(FOUNDER_SECTION_QUERY, FALLBACK_FOUNDER);
}

export async function getGallerySection(): Promise<GallerySectionData> {
  const { GALLERY_SECTION_QUERY } = await import('@/lib/sanity/queries');
  return fetchSection(GALLERY_SECTION_QUERY, FALLBACK_GALLERY);
}

export async function getContactSection(): Promise<ContactSectionData> {
  const { CONTACT_SECTION_QUERY } = await import('@/lib/sanity/queries');
  return fetchSection(CONTACT_SECTION_QUERY, FALLBACK_CONTACT);
}

export async function getFooterSection(): Promise<FooterSectionData> {
  const { FOOTER_SECTION_QUERY } = await import('@/lib/sanity/queries');
  return fetchSection(FOOTER_SECTION_QUERY, FALLBACK_FOOTER);
}

/** Backward-compatible aggregate — used by components that still accept SiteSettings */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const [branding, founder, contact] = await Promise.all([
      getBrandingSection(),
      getFounderSection(),
      getContactSection(),
    ]);
    return {
      clinicName: branding.clinicName || FALLBACK_SITE_SETTINGS.clinicName,
      yearsOfExcellence: founder.yearsOfExcellence ?? FALLBACK_SITE_SETTINGS.yearsOfExcellence,
      phone: contact.phone || FALLBACK_SITE_SETTINGS.phone,
      whatsappNumber: contact.whatsappNumber || FALLBACK_SITE_SETTINGS.whatsappNumber,
      email: contact.email || FALLBACK_SITE_SETTINGS.email,
      address: contact.address || FALLBACK_SITE_SETTINGS.address,
      mapEmbedUrl: contact.mapEmbedUrl || FALLBACK_SITE_SETTINGS.mapEmbedUrl,
      mapDirectionsUrl: contact.mapDirectionsUrl || FALLBACK_SITE_SETTINGS.mapDirectionsUrl,
    };
  } catch {
    return FALLBACK_SITE_SETTINGS;
  }
}
