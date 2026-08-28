import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const FALLBACK_SERVICES = [
  { label: 'Comprehensive Eye Examination', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRRxKqi_COhmdvKti4Bg7HSPSGmfZEPGFGG7XolKmiWlsWBxga1lYBwYWlf5hPAdjyQweDvs1FWuAJrZDQH6VRyZ7Y1_LtGnbG8moQJsqNzZWSX2bSat0eQOcmpFObabXy90BeOITvyROY3wNweGdMh74Lci684D8Mlju71IOTm4kgpNp7sfAxVdrJPdnsF6qK9iQ3wRUHyWyEkLHxJk9YyVz0YJSf2ftSBbdVsyJ25AVzp6J0WxA-cTkWMliSyJX0pmN91HGe2xw4pQ' },
  { label: 'Vision Testing & Eye Check-up', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDge5v39DaOp1R9OAkSE7aYqiIcAU6lw4IBqcBf6R8VhBVcIb5W7zt81SfZgl-4rr64NLEbtGxwSRKSGfPz7jbs444J97J8oGbdfEsurbD01y8u7TdalUJAqlXGeSQBMuJhlbvMqxPecbqgXgsRRtvZ81wRCqcJlTpZ_X-xrrKFkWvf5w3cYsovsoejD3CuGCJCshed5wUq7WfGMqI0MtqowrKT3oZYyRnPTkLKW2QdbOU9TskQlBotSASDwy4xjPtYr5hZj-D9ULA' },
  { label: 'Computer Vision Syndrome Assessment', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm60LrpmhBcifw8Ng70RULzlC70YZJXLL9n2amNmA5sm4gFAbK-lKs2CkOBq7Juk-f3mCzxrijEEMEILFhU9oqDfqQe04YJw0t61afSdrs1MY-nAkWq5ZzVENTndUSfXIacy9puRchZO5FksCjyFh_NSLGbshCj95-EX7edJdeIrksCa9VcVRahf-GqOS_Celd8OJMaXdHBGEbjh7yGL6XeKNW6qjrWh-jUL1zrKOAr5_75cEJLnordcJeh-ZLnsrzyF6jS3GoPBcbOw' },
  { label: 'Contact Lens Consultation & Fitting', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1_p-SS2s8Yp3ekSPLyEjQK_XKdwWBfYNAUGWRAJPlUfZrDX8ogqc_RyqAlt1KMuaMpv_yPnKoAgacVl830yzk_r0dMGOBZ91eQPHP7Wljrd9cbydk3g4vE_PMnVEC9nE8bIc58V19T8EN7A9aiT88GxrFFLneO3z68zj0KpW0DvbAppfxbPRUReG2blcI-n1V5YTPRXi9Mlbe3IDLN8oTIrIKxwnbrAsN8c0sOOKFT6bY5TV2pbOF2mjc_6M9gNU6WZI3j66_E6M' },
  { label: 'Children\'s Eye Examination', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9ea6NA9az1cns7OevU5FFJhDUwZHQVm9GumGkC-WC1Ub1Qf_eNFjn-8sIhQo_xoTSOxk7FyjFA4-E6I6Pvimv0vbozqCTjLqvg_9zAPNE-bcuxKkSYbhpkwYcMPNEH09wPUopI_KEgQDPTrxKXP5MGurSf5tA08167EmZcpdU9w80uRJJsmA6vHoIyRfOjMVNBUNgFB8lKm2iSk2LfUE4BrLgPY8Lo2mX2OxWApLmz33jKwJETlz9MR_DNqaHNSDIuuvToVfTsgHy6g' },
  { label: 'Prescription Glasses & Spectacles', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6CAyJ2a7SHcPzQg9oNWjb-Dd3noeN8kPg1NENlrkOxyIJMtQCSdYbiuLf7IjN1iFVHEwNA_f-CDa-ncb06gnFQ7m0PDYA2hkVQQ27y9UkpEa9zRypX4n56vBE9_OP4uGlGHscdvn3dgd0X637MDW18-u-6BgPD2Ok1tp9JXvVMfXGdWK7eVVicZN723EEykd6asPEMjtHl7iBeX_lUqRvkqGbhVD2R4afn_YtWJRh43YuljQRtY3Vf1Y1_dvSdzRvg7u45X56IxvFsQ' },
  { label: 'Eye Pressure Screening', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUhu8GtpD7M8eY9FenlqOmzM_p3wtHMZhIHKWt-2-X6gUIdVwjaKs0bdjvpWwEHCDoOaoKVl7wJTnd7Ctm2ULR1odl_seKw1GTpGHXreIXoYjDAXCEHPqYY6Y3d6apAD66u_Htsi_1u49VycjUJsk6iEBYqKhGHepfi76GQQ5Kd_zQ6cxeZWthr5Bu7EPVJtVMxwg_NI2vhBInShSQbUzOJfQVLg6R1Sv5z_iANTSEASq1XkSruqGWyWXMZGWg31axdxz3NHx4sS4' },
  { label: 'Diabetic Eye Screening', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW9byBUV3l5-BoQ38tS8QdtSJ7gJ8e-Dgq1CtjxVT-36gi54cZsXTlSzzQaeQFw48mXiOfHjY96QzvnuMYec8mRbtTBvxAFB9wTh45mvhttD-H8t2R7uNkzAorKoYVkeKeRSUwe0YHdUeJsjnULOWdJeg15jwJnKp0vBZ7mnYgcpeIRYKlipJazcLwFRH5gCgd92trtwMUTSFEeetoYfD8lX6WX6PzdKXowXydoX5iazsQFqs9PFjSThTFI5kI4fPb0tMNOnSVr88' },
  { label: 'Dry Eye Evaluation & Treatment', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9fJze9weiIkJxiDrXshXzPrWeZn0MBqqb3S96pVCHosfTqA9w8M9PCrC3ikBxijQ7FMgb4PyZ5a9fbG6dOAv0rpqrVysC2F6EioqEM3NqSQDjXikrWUHg50Uu8l0W6od3HIM2spdSJWjWpz_78PAjppIymVE3iaFnbODSSGSc_aZRnoNy-A482VYxqp66d3ycf0YBlshkrJKLAJB2xjBldsvGrUVklcCAKb6sYmWvr5p7rtmJ74vQ7ksGaFGuJVZ0ZEZWI0u5bOo' },
  { label: 'Cataract Screening', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHSRVaGupoygMvmr6ZfNFN28WptmOEDiJusQxBfCEaHsZNOJ4WKXKclAo1Dokwj931UjvN0x2RTBYgztkvyHr2LddVW8n_HaW5wXysVLbwnUU5hnL0aGMRIN9fH3DiLKkjF3gJuO-t_1PbftpskQfCvBs7yUUJJPpZjXftdwYBjzvX3eweVJCcz2BFLSQc6ylD65WK6KqjqNdx77A3dLE4dhZjwo015rvEjUhmolIoxcmecAnm14WcHyPm48Rdt7PUBfd3LmhYZI4' },
  { label: 'Retinal Examination', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpR9UfHVG5Y6eJ_2R8ork4Ei7ef_4TstmkJGkisb57reC4TJBbAMGZQ9-zjjeOJPe-9mMtb_YMBY-oMhVUWy8Mtz4nlbjertvPuGArNEJZuVN0-TknRFEMYDew6UVLGubWnpGGrQsvKZIqMboAghj35oFAZevljgHf21TNNmuM4_Vey0kP-AI_4jVzr1cr_c0kZhrkrvlvBbe5a2Ey6BcLekX9xysTfK_5ayBTVvF7xFtVhAtrtvArn8QHTGEVdNDAk5PPCsijmfidWg' },
  { label: 'Color Vision Testing', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjYhr6_M-T0gxXV0-8uc8PLothenH7qMKILhQhri8jb45sMoGPKK3SSToSa91nYlUCyvNTUcYuSiYjJJP72nc7G2QV875D_wgG3yd3TgyyeZYSRk7hc5ZTO_PnUfzew1cj0vS2tsrw-bxjfOBBd6TT7AMPL8Ixw_pxaJVf9Lgq5FQJIEZc2Kzsi36K48fNxdPKQAbRbnYK3jreYplO0WF5bWcKSo4KEd6eqCC4AUoWlxRawGVyK2zd8GwBFOyYgaZjwN5MaB3xCKg' },
  { label: 'Refraction Test for Prescription', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkTLgiV0LaWaIMNqUr3o-isbI3kHbh5aWX6ALERTFXl0h8fKONHk23suiE47tHqRO5y4ntTcSYBMiehT8HTb6OA-iJWu31KdL91bA52uKFReIiqVOrO_oS5bDQbD2HCeuk0fkMymCfaBdIbmdpi1S2bYKOARofZAByLWTOeJoxh5PhEOAc3m2Kek1QT9RFaOxwVCAQQQt4b6G2qoAarHc0kOBjM59O45dUnxJydXfTX6VT5JVYD6QgQBvgidobJX2tLftDCY0QqdM' },
  { label: 'Eye Care Tips', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCglk769uGqm3dtzYgo_9zKrlItFtGgHvFyZLsG9MoVqUardPUrX2TZJEaoO8BWzP6sE6HDpSyGiexbo0r9GHwR-_jiCSj9HIjZ8XJnvVez8iP8RKS8H3zv7HARRpyJkJ_10rTMs3E6zdKbKFvy141k1KvQ4hL1SXnYPnEYzi1OFYqLOfUyXQEo17m3YGkNv70Dv1ZUHJqqItmivMgTkqY4cRBwwLwkCir1Nw1yZIHAvxcMriBHqM8ec085SiMZ3_0Dse0yM7ofgFYPXg' },
  { label: 'Vision Care Advice', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMXEtJ-N1g-SqZz8j2kCMTFw6R6OzTU2cmHjXdzPOE1tQSYZSNGBMdg7lsJaMVUnJJOXtCsySCOv5opaoDMRUsJdR3yub0IE35Ig3mgapzTKTH0mDrfr9bXDLqIYBaahytXHQQT0wMLCWihv2k--DQx28bGu21pY8NxfugpnV6Bs9PNRLVe9rBEI_ZKQcJfjaY19oqqN8-ajwOhSeHY9_s2ejpEwm3ev129RGC0ltxnCwdvswzslIE-MZgdzRic9h1wYkZN1NrjqE' },
];

export interface ServiceItem {
  key: string;
  alt: string;
  label: string;
  src: string;
}

/**
 * Split out so app/page.tsx can fetch this once and reuse it both for
 * rendering and for the Service/OfferCatalog JSON-LD, instead of querying
 * Sanity twice for the same data.
 */
export async function getServicesData(): Promise<ServiceItem[]> {
  try {
    const { sanityClient, urlFor } = await import('@/lib/sanity/client');
    const { SERVICES_QUERY } = await import('@/lib/sanity/queries');
    const items = await sanityClient.fetch(SERVICES_QUERY);
    if (items?.length) {
      return items.map((item: { _id: string; title: string; image: SanityImageSource }) => ({
        key: item._id,
        alt: `${item.title} — eye care service at Royal Opticals`,
        label: item.title,
        src: urlFor(item.image).width(600).height(600).url(),
      }));
    }
  } catch {
    // Sanity not reachable yet (no project connected, or empty dataset) — fallback data below is used.
  }
  return FALLBACK_SERVICES.map((s) => ({
    key: s.label,
    alt: `${s.label} — eye care service at Royal Opticals`,
    label: s.label,
    src: s.src,
  }));
}

export function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section
      className="bg-surface-container py-12 md:py-20 px-margin-mobile md:px-margin-desktop"
      id="services"
    >
      <div className="md:max-w-container-max md:mx-auto">
        <div className="text-center mb-10 md:mb-12" data-animate="fade-up">
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-3 md:mb-4 uppercase">
            Clinical Services
          </h2>
          <p className="font-body-std text-body-std text-on-surface-variant md:max-w-2xl md:mx-auto">
            From foundational check-ups to advanced medical screenings, our clinic provides comprehensive
            care with clinical precision.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6" data-stagger>
          {services.map((service) => (
            <div
              key={service.key}
              className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow group"
            >
              <div className="aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={service.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={service.src}
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-headline-sm text-xs md:text-sm text-on-surface leading-tight">
                  {service.label}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
