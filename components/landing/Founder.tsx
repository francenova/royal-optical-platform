import type { FounderSectionData } from '@/lib/siteSettings';
import { urlFor } from '@/lib/sanity/client';

const FALLBACK_PORTRAIT =
  'https://images.unsplash.com/photo-1743254467058-517c4d321452?auto=format&fit=crop&w=900&q=80';
const FALLBACK_BG =
  'https://images.unsplash.com/photo-1780672823738-2a8d15d79aaf?auto=format&fit=crop&w=700&q=80';

export function Founder({ founder }: { founder: FounderSectionData }) {
  const portraitUrl = founder.founderPortrait
    ? urlFor(founder.founderPortrait as import('sanity').Image).width(900).quality(80).url()
    : FALLBACK_PORTRAIT;

  const bgUrl = founder.backgroundImage
    ? urlFor(founder.backgroundImage as import('sanity').Image).width(700).quality(80).url()
    : FALLBACK_BG;

  return (
    <section
      id="clinic"
      className="bg-background py-section-py-mobile md:py-section-py-desktop px-margin-mobile md:px-margin-desktop overflow-hidden"
    >
      <div className="md:max-w-container-max md:mx-auto md:grid md:grid-cols-2 md:gap-gutter-desktop md:items-center">
        {/* Overlapping photos */}
        <div className="relative flex justify-center items-center h-[340px] md:h-[440px] lg:h-[600px] mb-10 md:mb-0">
          <div
            className="absolute w-36 h-32 md:w-48 md:h-40 lg:w-64 lg:h-56 rounded-2xl overflow-hidden border border-outline-variant shadow-xl -translate-x-[70px] -translate-y-[70px] md:-translate-x-[85px] md:-translate-y-[110px] lg:-translate-x-28 lg:-translate-y-32 -rotate-6 z-0"
            data-animate="fade-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Cozy home library backdrop"
              className="w-full h-full object-cover"
              src={bgUrl}
            />
          </div>
          <div
            className="relative w-52 h-64 md:w-64 md:h-72 lg:w-[380px] lg:h-[440px] rounded-2xl overflow-hidden border-4 border-white shadow-2xl z-10 translate-x-3 translate-y-4 md:translate-x-4 md:translate-y-6 lg:translate-y-10"
            data-animate="fade-right"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Founder Portrait"
              className="w-full h-full object-cover"
              src={portraitUrl}
            />
          </div>
          <div
            className="absolute bottom-4 right-6 md:bottom-6 md:right-8 lg:right-16 z-20 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-primary rounded-full shadow-lg flex items-center justify-center"
            data-animate="scale-in"
          >
            <span
              className="material-symbols-outlined text-white text-xl md:text-2xl lg:text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-start" data-animate="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant bg-white mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
              {founder.sectionLabel}
            </span>
          </div>

          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg leading-none mb-6 md:mb-8">
            <span className="block text-on-surface">{founder.headingLine1}</span>
            <span className="block text-primary">{founder.headingLine2}</span>
          </h2>

          <div className="space-y-5 md:space-y-6 md:max-w-lg">
            <p className="font-body-std text-body-lead text-on-surface-variant leading-relaxed">
              {founder.paragraph1}
            </p>
            <p className="font-body-std text-body-lead text-on-surface-variant leading-relaxed">
              {founder.paragraph2}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10 md:mt-12 w-full" data-stagger="scale">
            <div className="bg-surface-container-low p-5 md:p-6 rounded-2xl border border-outline-variant">
              <div
                className="font-display-lg-mobile md:font-display-lg text-3xl md:text-4xl text-primary mb-1"
                data-counter={founder.yearsOfExcellence}
                data-counter-suffix="+"
              >
                0+
              </div>
              <div className="font-label-mono text-xs text-on-surface-variant uppercase">{founder.statLabel}</div>
            </div>
            <div className="bg-surface-container-low p-5 md:p-6 rounded-2xl border border-outline-variant">
              <div className="font-display-lg-mobile md:font-display-lg text-3xl md:text-4xl text-primary mb-1">
                {founder.secondStatValue}
              </div>
              <div className="font-label-mono text-xs text-on-surface-variant uppercase">{founder.secondStatLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
