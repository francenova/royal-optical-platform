import { PageEffects } from '@/components/landing/PageEffects';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Founder } from '@/components/landing/Founder';
import { StudioGallery } from '@/components/landing/StudioGallery';
import { Services, getServicesData } from '@/components/landing/Services';
import { Catalog } from '@/components/landing/Catalog';
import { CuratedCollections } from '@/components/landing/CuratedCollections';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ, getFaqs } from '@/components/landing/FAQ';
import { ContactBooking } from '@/components/landing/ContactBooking';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { WhatsAppButton } from '@/components/landing/WhatsAppButton';
import {
  getHeroSection,
  getBrandingSection,
  getFounderSection,
  getGallerySection,
  getContactSection,
  getFooterSection,
} from '@/lib/siteSettings';
import { urlFor } from '@/lib/sanity/client';
import { FALLBACK_HERO_IMAGE } from '@/components/landing/Hero';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://royalopticals.com';

/**
 * Best-effort split of a free-text address into schema.org PostalAddress
 * parts. Assumes the "..., locality, region postalCode" convention our
 * fallback/seed address uses — there's no structured address field in
 * Sanity yet, so this degrades gracefully rather than failing on formats
 * it doesn't recognize.
 */
function parseAddress(address: string) {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1] || '';
  const postalMatch = last.match(/(\d{4,7})\s*$/);
  const postalCode = postalMatch?.[1] || '';
  const addressRegion = postalMatch ? last.slice(0, postalMatch.index).trim() : last;
  const addressLocality = parts.length >= 2 ? parts[parts.length - 2] : '';
  const streetAddress = parts.slice(0, Math.max(parts.length - 2, 0)).join(', ');
  return { streetAddress, addressLocality, addressRegion, postalCode };
}

// Page-specific metadata (title/description/OG/etc.) comes from the root
// layout's generateMetadata() — it already fetches branding + hero data and
// would otherwise be silently overridden by a static export here.

// Without this, the page is fully static — Sanity content is baked in at
// build time and never updates until the next deploy. ISR re-checks Sanity
// at most every 60s; `/api/revalidate` (triggered by a Sanity webhook on
// publish) forces an immediate refresh instead of waiting for this window.
export const revalidate = 60;

export default async function LandingPage() {
  const [hero, branding, founder, gallery, contact, footer, services, faqs] = await Promise.all([
    getHeroSection(),
    getBrandingSection(),
    getFounderSection(),
    getGallerySection(),
    getContactSection(),
    getFooterSection(),
    getServicesData(),
    getFaqs(),
  ]);

  const { streetAddress, addressLocality, addressRegion, postalCode } = parseAddress(contact.address);
  const businessJsonLd = {
    '@type': 'Optician',
    '@id': `${SITE_URL}/#business`,
    name: branding.clinicName,
    image: hero.heroImage ? urlFor(hero.heroImage).width(1200).height(630).fit('crop').url() : FALLBACK_HERO_IMAGE,
    telephone: contact.phone,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry: 'IN',
    },
    url: SITE_URL,
    priceRange: '$$',
    // Lists the clinic's services as an Offer catalog — lets Google associate
    // this business with each named service (eye exams, lens fitting, etc.)
    // rather than just a generic name + address.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Eye Care Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.label },
      })),
    },
  };

  // FAQPage schema is what makes Google eligible to show the Q&A as an
  // expandable accordion directly in search results ("rich results").
  const faqJsonLd = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [businessJsonLd, faqJsonLd],
  };

  return (
    <div className="bg-background text-on-surface font-body-std selection:bg-primary selection:text-on-primary">
      <PageEffects />
      <Header branding={branding} />
      <main className="pt-16 md:pt-20">
        <Hero hero={hero} contact={contact} />
        <Founder founder={founder} />
        <StudioGallery gallery={gallery} />
        <Services services={services} />
        <Catalog />
        <CuratedCollections />
        <Testimonials />
        <FAQ faqs={faqs} />
        <ContactBooking contact={contact} />
        <CTA />
      </main>
      <Footer branding={branding} contact={contact} footer={footer} />
      <WhatsAppButton contact={contact} />
      {/* Escaping `<` prevents a CMS field containing "</script>" from
          breaking out of this tag — JSON.stringify alone doesn't escape it. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </div>
  );
}
