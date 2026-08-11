'use client';

import { useState } from 'react';
import { Carousel } from './Carousel';
import { FALLBACK_FRAMES, LENSES, CONTACT_LENSES } from './catalogData';

const TABS = [
  { id: 'frames', label: 'Frames · 7' },
  { id: 'lenses', label: 'Lenses · 4' },
  { id: 'contacts', label: 'Contacts · 5' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function CatalogClient({ frames, lenses, contacts }: { frames: typeof FALLBACK_FRAMES; lenses: typeof LENSES; contacts: typeof CONTACT_LENSES }) {
  const [activeTab, setActiveTab] = useState<TabId>('frames');

  return (
    <section
      className="bg-surface-container-low py-section-py-mobile md:py-section-py-desktop px-margin-mobile md:px-margin-desktop overflow-hidden"
      id="full-catalog"
    >
      <div className="md:max-w-container-max md:mx-auto">
        <div className="mb-8 md:mb-12" data-animate="fade-up">
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-5 md:mb-0">
            The full catalog, organized
          </h2>
          <div className="flex items-center bg-white/50 backdrop-blur-md border border-outline-variant rounded-full p-1.5 mt-5 md:mt-0 md:inline-flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:flex-none px-3 md:px-6 py-2 rounded-full font-label-mono text-[10px] md:text-xs uppercase tracking-widest transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-on-primary shadow-lg'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-track">
          {/* FRAMES PANEL */}
          <div className={`catalog-panel ${activeTab === 'frames' ? 'catalog-panel-active' : ''}`}>
            <div className="flex flex-col gap-4 mb-4 md:hidden" data-stagger="scale">
              {frames.filter((f) => f.size === "large").map((item) => (
                <FrameLargeCard key={item.code} item={item} mobile />
              ))}
            </div>
            <div className="hidden md:grid grid-cols-12 gap-6 px-2" data-stagger="scale">
              {frames.filter((f) => f.size === "large").map((item) => (
                <FrameLargeCard key={item.code} item={item} mobile={false} />
              ))}
              <div className="col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4" data-stagger="scale">
                {frames.filter((f) => f.size !== "large").map((item) => (
                  <FrameSmallCard key={item.code} item={item} />
                ))}
              </div>
            </div>

            {/* Mobile: small frames as a swipeable row */}
            <div className="md:hidden">
              <Carousel edge className="gap-4">
                {frames.filter((f) => f.size !== "large").map((item) => (
                  <div
                    key={item.code}
                    className="snap-item relative aspect-square rounded-2xl overflow-hidden border border-white/90 shadow-lg w-[42vw] max-w-[190px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={item.alt} className="w-full h-full object-cover" src={item.src} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      <span className="font-label-mono text-[9px] text-white">{item.code}</span>
                      <h4 className="font-body-std text-xs font-bold text-white uppercase tracking-wider">
                        {item.label}
                      </h4>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>

          {/* LENSES PANEL */}
          <div className={`catalog-panel ${activeTab === 'lenses' ? 'catalog-panel-active' : ''}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" data-stagger="scale">
              {lenses.map((lens) => (
                <div
                  key={lens.code}
                  className="glass-card rounded-2xl overflow-hidden group hover:red-glow transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={lens.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={lens.src}
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <span className="font-label-mono text-[9px] md:text-[10px] text-primary uppercase tracking-widest">
                      {lens.code}
                    </span>
                    <h4 className="font-headline-sm text-sm md:text-base text-on-surface mt-1">{lens.label}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACTS PANEL */}
          <div className={`catalog-panel ${activeTab === 'contacts' ? 'catalog-panel-active' : ''}`}>
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-r from-primary to-primary-deep rounded-3xl p-7 md:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
                <div>
                  <h3 className="font-label-mono text-xs md:text-sm uppercase tracking-widest text-primary-fixed mb-2">
                    Fitted by trained specialists
                  </h3>
                  <h2 className="font-display-lg-mobile md:font-display-lg text-2xl md:text-5xl">
                    CONTACTS, COMFORTABLY RIGHT
                  </h2>
                </div>
                <span className="material-symbols-outlined text-4xl md:text-6xl opacity-50">visibility</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-stagger="scale">
                {contacts.map((cl) => (
                  <div
                    key={cl.code}
                    className="bg-white rounded-2xl overflow-hidden border border-outline-variant hover:border-primary transition-colors flex flex-col"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-surface-container-low">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt={cl.alt} className="w-full h-full object-cover" src={cl.src} />
                    </div>
                    <div className="p-5 md:p-6 flex flex-col gap-3 md:gap-4">
                      <div className="flex justify-between items-start">
                        <span className="font-label-mono text-[10px] text-on-surface-variant">{cl.code}</span>
                        <span className="material-symbols-outlined text-primary text-xl md:text-2xl">
                          {cl.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-headline-sm text-base md:text-lg text-on-surface">{cl.label}</h4>
                        <p className="font-body-std text-sm text-on-surface-variant mt-1 md:mt-2">
                          {cl.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <a
                  href="https://wa.me/919092919432"
                  target="_blank"
                  rel="noopener"
                  className="bg-primary rounded-2xl p-6 border border-primary-deep text-white flex flex-col items-center justify-center gap-2 text-center active:scale-95 md:hover:bg-primary-deep transition-all min-h-[200px]"
                >
                  <span className="material-symbols-outlined text-3xl md:text-4xl mb-1 md:mb-2">chat</span>
                  <h4 className="font-headline-sm text-lg md:text-xl">CONTACT SPECIALIST</h4>
                  <span className="font-label-mono text-[10px] opacity-70">CL-05</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FrameLargeCard({
  item,
  mobile,
}: {
  item: (typeof FALLBACK_FRAMES)[number];
  mobile: boolean;
}) {
  return (
    <div
      className={
        mobile
          ? 'relative rounded-[24px] overflow-hidden h-64'
          : 'col-span-6 relative rounded-[32px] overflow-hidden h-[400px] group'
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={item.alt}
        className={`w-full h-full object-cover ${mobile ? '' : 'transition-transform duration-700 group-hover:scale-105'}`}
        src={item.src}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className={mobile ? 'absolute top-4 left-4' : 'absolute top-6 left-6'}>
        <span className="bg-white/20 backdrop-blur-md text-white font-label-mono text-[10px] px-3 py-1 rounded-full border border-white/10">
          {item.code}
        </span>
      </div>
      <div
        className={
          mobile
            ? 'absolute bottom-5 left-5 right-5 flex justify-between items-end'
            : 'absolute bottom-8 left-8 right-8 flex justify-between items-end'
        }
      >
        <h3 className={mobile ? 'font-headline-sm text-2xl text-white uppercase' : 'font-headline-sm text-3xl text-white uppercase'}>
          {item.label}
        </h3>
        <div
          className={
            mobile
              ? 'w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20'
              : 'w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20'
          }
        >
          <span className={`material-symbols-outlined ${mobile ? 'text-lg' : ''}`}>north_east</span>
        </div>
      </div>
    </div>
  );
}

function FrameSmallCard({ item }: { item: (typeof FALLBACK_FRAMES)[number] }) {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden group border border-white/90 shadow-lg hover:red-glow transition-all">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={item.alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        src={item.src}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <span className="font-label-mono text-[10px] text-white">{item.code}</span>
        <h4 className="font-body-std font-bold text-white uppercase tracking-wider">{item.label}</h4>
      </div>
    </div>
  );
}
