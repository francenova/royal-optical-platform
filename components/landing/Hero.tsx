import type { HeroSectionData } from '@/lib/siteSettings';
import type { ContactSectionData } from '@/lib/siteSettings';
import { urlFor } from '@/lib/sanity/client';
import { safeHref } from '@/lib/safeHref';

export const FALLBACK_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3_5-hJobPa2qrQJgAHuhIWG3f4_-8BHexA67QGWDm69m_GbQFTjrLYBQs2ObbWJzc0jpJ5cykFvvtLB1TAdwkaqIA19yPUCYh5KK899YbwRYNssDkMae8eKwgB0irLb7qEBO5Q_lYpNqC_GW5dOIQN3xcHdAI_6803FlqNwo3eE6Z2RlYzjTmOnPtizblwV8TVJ8WiLtDOgy3beOJkRrJr-AurUnhFYZpT-r09p9l25SmEPrGafdm7BSsskjfaFN5BtcBrGhjiNw5A';

export function Hero({
  hero,
  contact,
}: {
  hero: HeroSectionData;
  contact: ContactSectionData;
}) {
  const heroImageUrl = hero.heroImage
    ? urlFor(hero.heroImage as import('sanity').Image).width(900).quality(80).url()
    : FALLBACK_HERO_IMAGE;

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-surface-container-low px-margin-mobile md:px-margin-desktop pt-10 pb-14 md:min-h-[700px] md:flex md:items-center md:pt-32 md:py-20"
    >
      <div className="md:max-w-container-max md:mx-auto md:grid md:grid-cols-2 md:gap-gutter-desktop md:items-center relative z-10">
        <div data-animate="fade-up" className="md:-mt-20">
          <span className="font-label-mono text-label-mono text-primary uppercase mb-3 md:mb-4 block">
            {hero.badgeText}
          </span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-5 md:mb-6 leading-tight">
            {hero.heading}
            <br />
            <span className="text-primary">{hero.headingAccent}</span>
          </h1>
          <p className="font-body-lead text-body-lead text-on-surface-variant mb-8 md:mb-10 md:max-w-md">
            {hero.description}
          </p>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4">
            <a
              href={safeHref(hero.primaryButtonLink, '#services')}
              className="btn-magnetic bg-primary text-on-primary px-8 md:px-10 py-4 rounded-full font-body-std uppercase tracking-widest hover:bg-primary-container transition-all shadow-lg red-glow text-center active:scale-95"
            >
              {hero.primaryButtonText}
            </a>
            <a
              href={safeHref(hero.secondaryButtonLink, '#full-catalog')}
              className="btn-magnetic bg-white md:bg-glass-white border border-primary/20 text-primary px-8 md:px-10 py-4 rounded-full font-body-std uppercase tracking-widest transition-all backdrop-blur-md text-center active:scale-95"
            >
              {hero.secondaryButtonText}
            </a>
          </div>
        </div>

        <div
          className="relative flex justify-center md:justify-end mt-12 md:mt-0"
          data-animate="scale-in"
          data-parallax="0.15"
        >
          <div className="relative w-full max-w-sm md:max-w-lg aspect-[4/5] rounded-[28px] md:rounded-[32px] overflow-hidden red-glow border-4 border-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover"
              alt={hero.heroImageAlt}
              src={heroImageUrl}
            />
          </div>

          {/* Orbit badge: rotating text + WhatsApp CTA */}
          <div className="absolute -bottom-6 left-2 md:-bottom-10 md:-left-10 lg:left-0 z-20">
            <div className="relative w-28 h-28 md:w-40 md:h-40 flex items-center justify-center">
              <svg className="orbit-spin w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <path
                    id="orbitPath"
                    d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                  />
                </defs>
                <text className="font-micro-mono text-[6px] fill-primary uppercase tracking-[4px]">
                  <textPath xlinkHref="#orbitPath">
                    {hero.orbitText}{' '}
                  </textPath>
                </text>
              </svg>
              <a
                className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white active:scale-95 md:hover:scale-110 transition-transform shadow-xl"
                href={`https://wa.me/${contact.whatsappNumber}`}
                style={{ backgroundColor: 'rgb(37, 211, 102)' }}
                aria-label="Book via WhatsApp"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  className="md:w-8 md:h-8"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
