'use client';

import { useState } from 'react';
import { Carousel } from './Carousel';

export const FALLBACK_COLLECTIONS = [
  {
    icon: 'eyeglasses',
    title: 'Luxury Frames',
    description: 'High-end acetate and titanium frames crafted for everyday elegance and durability.',
    alt: 'Luxury acetate frames on a marble surface',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCd8XRblEjcX3szwCwF98jc1aPh_09obmIovnGNn-JtGOFYvbpzvwFGvCFPd0UO7-9MvHuFPgkXSWVvPGQwwJNXTzo-CEEelV51JcrQgyDJTwMCIbq6kXCLDUxgUbaltv44EWkIJVGb4AciT-_esSBETAB1dWRUPFa0NvlAyOuZptwlh6YFEG1c2CeICYFhL2Wg6yYCU30s7quxDpuz2cXCcSrJLVEtnsC6l3Vec4-D7mOI5aYEdB311cVS2IeL4x6aGT8_mrvZKA',
  },
  {
    icon: 'lens',
    title: 'Precision Lenses',
    description: 'Advanced optical technology for ultimate clarity, including progressive and digital strain options.',
    alt: 'Close up of optical lenses with reflections',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyx-KdNuLa_V2nflbqgat5OZsY3CJwPAe0IKMJQR9XZa4cPEJ1v5XL0Vwlqpq5v4qUD1FkHVdmKfvKGeU5ZZtxqmbYmGSV_duqlLvkLKNbUTiIkfnUOM0YVH1flJ7NrZHZrLzW_hIBl2Ml54ZSXm0xxF0cJo0pmafAOIPmYVLQrELzjBEzoIrt04KpMUlLf9cH3AOdMx03HjyNjAc4gZom3faeaVkLFRpOkAoEY4sPOq6U7DAV6b7QqOh5loJHxIHYfKkLAjICdjIFrw',
  },
  {
    icon: 'face',
    title: 'Studio Fitting',
    description: 'Expert personalized service ensuring your frames fit perfectly and comfortably for daily wear.',
    alt: 'Optometrist adjusting glasses on a patient',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHgpTjNKuJWmyjck6RS_OTHD-VN_o4ilzpc3WwGm8jXij2zN4sYKSDR9bLtIaP1dz1UmbM-PNOK4RjdATEffjntwaCE55GSfRID018WluM2DCrogYCoJ-f5-DwDLcLxQAXfaxdKJ3SiRNL2D0JaUniain0iEzsi0K9WF-Di7bjdSTLt_ueBjdHH1camn4ZlfGk9NDXj1rwPzNTl4PH9E_asex9cr5th791h6oPttVKIr04_UBR5r2ao6pHTSLR8cDBG0FEVXvrMa0',
  },
  {
    icon: 'workspace_premium',
    title: 'Designer Labels',
    description: 'Curated international brands offering the latest trends in eyewear fashion.',
    alt: 'Display of designer glasses in a boutique',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfA1OD-7IRDqYAXzlqz0h2wCZAm3abyTG6lkXxwfh42Ng4vd-JwOx0bhLPJLNt7vuHFQQFDfHI3KugtGSYBWtdk_Yhm3XhxVArv6BU9oPq4-MI0zBEXaSiygjVDH0DUkwICF1I8IYitAJvuckd1FoF-6e_Okq7j91cNw9tNkaCvEMiJx310HiriP_G-geGYNu_s9Z4pVsru4EWMYHADIbuKk-5GIM89fLTPi7Gf_teAMLSJ2grWazlmvir0SW8kiswnp0N41J83tM',
  },
  {
    icon: 'visibility',
    title: 'Contact Care',
    description: 'Specialized lens fitting and care solutions for a seamless alternative to frames.',
    alt: 'Close up of contact lens on fingertip',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSbBv529DKhjPJ8pmmsgMjlrtZyryiMyk0LVl1Pm9hNyosLZYkokxjV96rKx9K4TBQIWlhRSVL-ncurTTl1FBPdB6EG16JrHSjhOKYcEbVeqiB65j7Hjjz7CamZkTKZqW-fKQ6ev3cwYBEd4e23FAjtYx4jpxytge5j6DYyO5eLxmGQj8SzgLc8OOwWaMf8aSNsVr_gglYyX64W4Bckj5IaR9XS5UwJHGXUNowTog09H8fLBIAHlfsjkSRerkZIoI3GhGNTdZ7shk',
  },
];

export function CuratedCollectionsClient({ collections }: { collections: typeof FALLBACK_COLLECTIONS }) {
  const [activeIndex, setActiveIndex] = useState(1); // "Precision Lenses" starts active, matching source

  return (
    <section className="bg-surface py-section-py-mobile md:py-section-py-desktop px-margin-mobile md:px-margin-desktop" id="catalog">
      <div className="md:max-w-container-max md:mx-auto">
        <div className="text-center mb-8 md:mb-12" data-animate="fade-up">
          <span className="font-label-mono text-label-mono text-primary uppercase mb-3 md:mb-4 block">
            Our Collections
          </span>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-3 md:mb-4">
            CURATED COLLECTIONS
          </h2>
          <p className="font-body-std text-body-std text-on-surface-variant md:max-w-2xl md:mx-auto">
            Explore our range of premium eyewear, precision lenses, and expert services tailored to your
            unique vision needs.
          </p>
        </div>

        {/* Mobile: swipeable carousel */}
        <div className="md:hidden bg-nightbg rounded-[32px] p-4" data-animate="fade-up">
          <Carousel dotsOnDark className="gap-4">
            {collections.map((c) => (
              <div
                key={c.title}
                className="snap-item relative rounded-2xl overflow-hidden bg-surface-container-high w-[78vw] max-w-[320px] h-[380px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={c.alt} className="absolute inset-0 w-full h-full object-cover" src={c.src} />
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 45%,rgba(0,0,0,0.85) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 text-white">
                  <span className="material-symbols-outlined text-primary bg-white/20 p-2 rounded-full backdrop-blur-sm mb-3 inline-block">
                    {c.icon}
                  </span>
                  <h3 className="font-headline-sm text-xl font-semibold mb-2">{c.title}</h3>
                  <p className="font-body-std text-white/80 text-sm">{c.description}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Desktop: click-to-expand interactive selector */}
        <div
          className="hidden md:flex bg-nightbg rounded-[40px] p-8 w-full h-[600px] gap-4 overflow-hidden"
          data-animate="fade-up"
        >
          {collections.map((c, i) => (
            <div
              key={c.title}
              onClick={() => setActiveIndex(i)}
              className={`interactive-card rounded-3xl bg-surface-container-high group ${i === activeIndex ? 'active' : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={c.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={c.src}
              />
              <div className="card-overlay absolute inset-0 z-10" />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 text-white flex flex-col justify-end h-full">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    {c.icon}
                  </span>
                  <h3 className="font-headline-sm text-xl md:text-2xl font-semibold m-0 leading-none">
                    {c.title}
                  </h3>
                </div>
                <div className="card-content">
                  <p className="font-body-std text-white/80 mb-4 line-clamp-2">{c.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
