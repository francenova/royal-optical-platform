import { PageEffects } from '@/components/landing/PageEffects';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Founder } from '@/components/landing/Founder';
import { StudioGallery } from '@/components/landing/StudioGallery';
import { Services } from '@/components/landing/Services';
import { Catalog } from '@/components/landing/Catalog';
import { CuratedCollections } from '@/components/landing/CuratedCollections';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
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

export const metadata = {
  title: 'Royal Opticals — Premium Eye Clinic & Optical Studio',
  description:
    'Where clinical excellence meets curated style. Royal Opticals offers comprehensive eye exams and luxury eyewear.',
};

export default async function LandingPage() {
  const [hero, branding, founder, gallery, contact, footer] = await Promise.all([
    getHeroSection(),
    getBrandingSection(),
    getFounderSection(),
    getGallerySection(),
    getContactSection(),
    getFooterSection(),
  ]);

  return (
    <div className="bg-background text-on-surface font-body-std selection:bg-primary selection:text-on-primary">
      <PageEffects />
      <Header />
      <main className="pt-16 md:pt-20">
        <Hero hero={hero} contact={contact} />
        <Founder founder={founder} />
        <StudioGallery gallery={gallery} />
        <Services />
        <Catalog />
        <CuratedCollections />
        <Testimonials />
        <FAQ />
        <ContactBooking contact={contact} />
        <CTA />
      </main>
      <Footer branding={branding} contact={contact} footer={footer} />
      <WhatsAppButton contact={contact} />
    </div>
  );
}
