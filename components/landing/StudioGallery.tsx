import { Carousel } from './Carousel';
import type { GallerySectionData } from '@/lib/siteSettings';
import { urlFor } from '@/lib/sanity/client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// NOTE: the frameWall/styleBar/fittingStudio images (both these fallbacks and
// the current Sanity `gallerySection` documents seeded from them) are
// mismatched AI-prototyping stock photos — a home picture-frame wall, a hair
// salon, and a golf club fitting studio, none of which show anything related
// to eyewear. Their alt text below is deliberately left minimal rather than
// written as a confident description of content that isn't actually there.
// Replace the images in Sanity Studio with real (or at least on-topic) photos,
// then write proper descriptive alt text for them.
const FALLBACK_IMAGES = {
  examRoom:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDy_f6n3tnXMXCGG1Zu3ZQ8XiAKa91wXzy0ZewduN_0C-E6VdSQMsP0UvhtT0JmnjVC2BkKCxjRZTmxxuXLboFIGd874qVrEXlpbIfTHNOixdb3Hoa4NogN60ueNk37LWGKDzVYVp50gSiee2ZnFnxBIabJecPf__oH6pR5f-q4O3TcHfmkaRwmqm38kpTC7BJx-C-yblovGcFr_ink5aJAZoamdhxUD87mbvAVhoPT1WOB8KIDsmGqp-R-oTwxS7FMuRuuLvhxE4s',
  frameWall:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCB7svLVrX9JHxmWyourdlvZayeZ1vCsOPiGtGMLQPHzSlOJLCzi4LOXy4U4kj0mbgZKm7Wz9O_7GhxS8TEyQtyLNT0oWHX-RJRRv7tmUwfy3f-LrB4IjIT2r1GFV_8l64dtcnB6lKTh-jfxgtHJgc9NVMWLF5MmTIrjfxc8D3ffrVcLE5G1jmGIYztXTHwDHPiyiCdtWTtlq4fw2IRKSGxydeg6mu6XLGl7tBq-hOGCInyUCoAJpp99X4ogEBUIPxhRkq3r0L-44o',
  styleBar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBOjGBpnng1d155j8OV_jpMTMMk0nQjeTTZwrhtYHUwcNTjU2_r0cnFQX5REzCmnzzgQR6_HJ0IigjZJ-owKs7SZBFlQe2BQfnMdaC1kuEfsWSvuGcWtLpu5ucPVvHC7qk-O1laZxpfSUs07yV9Jozghz2G7sS_uLq1gaJM1BGLT6NX_4M-q6uxzLISC1vGVXj0qiGqophBQhX04d0H2tV2B0tpYFPFWweWB-ReJU_15P3NW_ipSa1uwSzfu5SwMeUhYxxWPxS7cJE',
  fittingStudio:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCDGQJVfFkNm130h_1lIt7IRcso_3_bSQKalmdRGtpmhKlzgoysv-G05scaRjKxwaHwm6aYOyUMFcvuE3EsBEezJ3MR6OdwfxWKhbkhCp-3PKOhIBsy6hyLzx5HKxkSU3k1Xj4fikpYwqcfcIdDNt7_a01AT9pNvfl39skToj_XK83NV42RFydPgZbJnxgIIsIWSktO0qh3bzC08NrEeZeOM1mnLrBN1DSwL0D-1gC5vZXdwLBqX4GnWNguXL2bEaw2NLjBcCkXBt0',
};

export function StudioGallery({ gallery }: { gallery: GallerySectionData }) {
  const getImageUrl = (source: SanityImageSource | undefined | null, fallback: string) => {
    if (source) {
      return urlFor(source).width(900).quality(80).url();
    }
    return fallback;
  };

  const examRoom = getImageUrl(gallery.examRoomImage, FALLBACK_IMAGES.examRoom);
  const frameWall = getImageUrl(gallery.frameWallImage, FALLBACK_IMAGES.frameWall);
  const styleBar = getImageUrl(gallery.styleBarImage, FALLBACK_IMAGES.styleBar);
  const fittingStudio = getImageUrl(gallery.fittingStudioImage, FALLBACK_IMAGES.fittingStudio);

  return (
    <section className="bg-background py-section-py-mobile md:py-section-py-desktop px-margin-mobile md:px-margin-desktop">
      <div className="md:max-w-container-max md:mx-auto">
        <div className="mb-8 md:mb-12" data-animate="fade-up">
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface uppercase">
            {gallery.heading || 'Welcome to the studio'}
          </h2>
        </div>

        {/* Mobile: large exam-room photo + swipeable row */}
        <div className="md:hidden">
          <div className="mb-4" data-animate="fade-up">
            <div className="relative rounded-2xl overflow-hidden glass-card aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Eye examination room at Royal Opticals with clinical diagnostic equipment"
                className="w-full h-full object-cover"
                src={examRoom}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline-sm text-white font-bold uppercase tracking-wider">Exam Room</h3>
              </div>
            </div>
          </div>
          <Carousel edge dotsOnDark={false} className="gap-4">
            {[
              { alt: 'Frame Wall', src: frameWall, label: 'Frame Wall', overlayTop: true },
              { alt: 'Style Bar', src: styleBar, label: 'Style Bar', overlayTop: true },
              { alt: 'Fitting Studio', src: fittingStudio, label: 'Fitting Studio', overlayTop: false },
            ].map((item) => (
              <div
                key={item.alt}
                className="snap-item relative rounded-2xl overflow-hidden glass-card aspect-square w-[68vw] max-w-[280px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={item.alt} className="w-full h-full object-cover" src={item.src} />
                {item.overlayTop ? (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary font-label-mono text-[10px] px-3 py-1 rounded-full border border-primary/10 uppercase">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h4 className="font-headline-sm text-white font-bold uppercase tracking-wider text-sm">
                        {item.label}
                      </h4>
                    </div>
                  </>
                )}
              </div>
            ))}
          </Carousel>
        </div>

        {/* Desktop: bento grid */}
        <div className="hidden md:grid grid-cols-12 gap-6" data-stagger="scale">
          <div className="col-span-6 relative rounded-2xl overflow-hidden glass-card h-[600px] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Eye examination room at Royal Opticals with clinical diagnostic equipment"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={examRoom}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-headline-sm text-white font-bold uppercase tracking-wider">Exam Room</h3>
            </div>
          </div>

          <div className="col-span-6 grid grid-cols-2 gap-6">
            <div className="col-span-1 relative rounded-2xl overflow-hidden glass-card aspect-square group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Frame Wall"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={frameWall}
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-primary font-label-mono text-[10px] px-3 py-1 rounded-full border border-primary/10 uppercase">
                  Frame Wall
                </span>
              </div>
            </div>
            <div className="col-span-1 relative rounded-2xl overflow-hidden glass-card aspect-square group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Style Bar"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={styleBar}
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-primary font-label-mono text-[10px] px-3 py-1 rounded-full border border-primary/10 uppercase">
                  Style Bar
                </span>
              </div>
            </div>
            <div className="col-span-2 relative rounded-2xl overflow-hidden glass-card h-[280px] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Fitting Studio"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={fittingStudio}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline-sm text-white font-bold uppercase tracking-wider">Fitting Studio</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
