'use client';

import { Carousel } from './Carousel';

export const FALLBACK_TESTIMONIALS = [
  {
    name: 'Briana Patton',
    role: 'Creative Director',
    quote:
      "The level of clinical detail here is unmatched. I've never had an eye exam that felt this thorough, and the frames I picked are a total conversation starter.",
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpZn_KQktoKrqT39mGidjH9ZXQWk8ANwTjcCsckVvkfR_EQ-i5Zsz3dXJ3d_wUdMpUYQxQWI5_MQ-TQGsl4qvsucSZmguoMijEp3QF2bPJnINf5Sh4wrewD3SbysuOE9tWvldgMknaDDM-sQRpqeN64-oA-57iIxSpB9xClPT4yfS65NGhXGuGsvpvvtWlze5vtraz_1vIFKz-xPITo52Vpb3qL7QyAvGWtwM6gd8Mg5YJHekbsXP7lrXCtCVhDTxxzabdcTeZfBE',
  },
  {
    name: 'Bilal Ahmed',
    role: 'Software Engineer',
    quote:
      'Finding glasses that actually suit my face has always been a struggle until I came to Royal Opticals. Their curators have a real eye for style.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeXFKPIdBThlwGu2Yev3xvBiPN5Jwaba81hb_J_60GwlBw20bh1D1DkTVDEelhBWmQv_0hnNihmMjqNP5e0v0LVnL2l7bzP6p4jb_wiPaJFNhrvamBXdlktiW-hsltoEWLnJOUIjADxHAphStD2_Hqi1vIBBQCj7BwEbhTxOOxLaIn2Og-zttaXQrhgDlCbW-N5-gZLYgOTwJBIIo0nbglFDhZNHHFcuH6Sr33QDYJ9vpOhe6b7WP-QXuqiBn1S20TtxQk26W_ER8',
  },
  {
    name: 'Saman Malik',
    role: 'Teacher',
    quote:
      "Excellent service for my son's first screening. The optometrists were patient and kind. Highly recommended for family eye care.",
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYe_f0NkFnz3XFGwU-f-tanUMe0-tyZOR_g0wzRXKYQKivNvWOlP4VMnF0guw9ubZJa5auBAlQzRGFVX01cOseIm93ZA2_VozZxhHGi7Hpwv0ZejzOvArrCpu798uhT9nTfdLnQbP-X5RBv5HtUn7KfQ4_RtR1JiAnzqBbho2YTHOPW0LEqH5tc3gLN7lVxz2-5ZcEsvp6eCV-q2pMAxUcHfP4brQ3lDNWtAj34wHI-TQEg9RN6fvNKx0Bs7NVPl12-V9dLdT1qeQ',
  },
  {
    name: 'Omar Raza',
    role: 'Data Analyst',
    quote:
      'The digital strain therapy has completely changed how I work. My headaches are gone, and the new lenses are incredibly comfortable for long screen hours.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzu4wbcWfWcwna4PwZZ2EmnEBLeqkWnFHY_dFDkhATF6POnbgYxSJUxkKpOTGxjEX6X8xxKnLdH4Pl09wFdZeRyI4X0zUppgwwDAyLm3-1rRFYwh-oyemBKvXKVk6dJboZEW-2zFs1kp_3VRDGjsQj_4YRwxW228O0bwkg_zvMgCW1jzfp_0BAf5oHW5rYDavVDu9n31rvGYMn9WdRQh7inptDnLrlF6j2v25QMLoWKha9tCTJp07giu6sVdSdlb0xUuC2OVXrDXc',
  },
  {
    name: 'Zainab Hussain',
    role: 'Architect',
    quote:
      "A beautifully designed space with equipment I've never seen before. The entire process felt like a premium experience rather than a regular check-up.",
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4ktPYp1ymVW5Z0RN5FIc62y3wdiOWc2HLJ7YLS_afBZPFTTfIyAeCpAmyu5709f-u6iG1lUNYo_19d34Xtyn2swY-2oi9uX2yzmBEYxj0z2gvmIT9i6Mws4H3JQn4ZI1nhOaVcWyYK9On6jFgixlcWF58CwHKen950O3Px1iYmmnPe_kMfZzvuYztGbElzieKVM2zJLjljKzKmwn0haZTnJjRfKrXoPZGyNCS3zHTgCfpuVsX--39Rd60m6KcTyYem9j1UKIRRj0',
  },
  {
    name: 'Aliza Khan',
    role: 'Medical Student',
    quote:
      'Their contact lens fitting was so precise. I used to struggle with dry eyes, but the new material they recommended has been an absolute game changer.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRsQ4ixJ0DPba3GCuq4j2AkpeEy11hqpTK5vIyp1ISPpdekMo9W0jFYdmvkHnDN3txhLz14DlHdZGW4f5XWuKxFozcZzks-ub5Wzh6VRTscFH3Y7Lw5IT2ZtozwOy2tqZnLOyECZyaaC73ujAJ9Bq3NjZKJ22Ze_3YwLbbWqnTwaekjBQP6byIRGdrJ6lfm5hChDrVdtQe3dE8gRNmHnw8BaQhzZ9-Z2BTLILtPEGMogjvSHAxGWB_Bp4eMIU_3-vTfc3_VmOESrk',
  },
  {
    name: 'Farhan Siddiqui',
    role: 'Marketing Director',
    quote:
      'From the moment you walk in, the service is impeccable. They helped me find the perfect designer frames that I absolutely adore.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_vDGOesYYssRu5rbtV5_1W4D_ZCyAoUOXw3k76TGzeUCVNvFl6vdEzRw-5VXPUsuv2O70Ss37MoDMxuRDKs0xfsE2s909xoDY8iLhM4UGEqEgvZcLzY8eeGc--uaMAAIy-kU-lhmp4NewIAYuSr8dv_H1z12YB7qE9_naJ3F_YMeUl0RMiprvAjU6l__2Gpj80CiOXRmU2VEspuyrSGYgngQT17Fvf9cXUqPe8kusIuBi1wvUzWlC7ve5J3BuMk0MkLMWZwhvHZo',
  },
  {
    name: 'Sana Sheikh',
    role: 'Finance Consultant',
    quote:
      'Highly professional and deeply knowledgeable staff. They caught a minor retinal issue early on during my standard check-up.',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYXch-ZSbSqjcLhZZZ95XEzXvVaiPWMhf7FGtE_cuU8eQm4NsIxBMMEw1kMMwsH7Wf63i8rZN9oo7POxiRlx7r14rPfz-fNuXouys5z8R0VIu0RLC4a_RyIPDwoBYzr2FXABvZwL5vkNIx_NEIYxLeSykNPycVevyVt5XVHl6OrM8KztfWGyKHuRJqqKI2v0p2CaOu8XhtSXiunWWlRgvXb0NkU8q6rc6S88OuGVLsrxyr1dZ5Nmd6duYPOlZGSXC47NAStX6iaO8',
  },
  {
    name: 'Hassan Ali',
    role: 'Business Owner',
    quote:
      "The blend of medical luxury and top-tier clinical care makes this my go-to clinic. I won't trust my eyes with anyone else.",
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY06PHqA78LTLxad0rD1VKdV8Q0gQ4a_-QmZC6Ky3892B3MQM3hy6jt7D-T0k1jeNCrUkwSjrOs11Moszuy0T2kVvb1hLHRBJI1ubrR5xxjJ9j7DI1SXJWtxt7yEvn3v-ffT1MJjwdphARmIyH-llzbb4_GST1fI5Jlc6atWPnVl597F23oYzvPfGqBCHhVqwgcuUjHUbCDaw_HOEFcYOkb252e7cZFIHL158FD65hXomTdN-uFCgHDg0PqtuD1mmTlP_xPS1VKW0',
  },
];

function TestimonialCard({ t }: { t: (typeof FALLBACK_TESTIMONIALS)[number] }) {
  return (
    <div className="glass-card p-8 rounded-3xl flex flex-col gap-4">
      <p className="font-body-std italic text-on-surface-variant leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center gap-4 mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={t.role ? `${t.name}, ${t.role} — Royal Opticals patient` : `${t.name} — Royal Opticals patient`}
          className="w-12 h-12 rounded-full object-cover"
          src={t.src}
        />
        <div>
          <p className="font-body-lead font-bold text-on-surface">{t.name}</p>
          <p className="font-label-mono text-xs uppercase text-on-surface-variant opacity-70">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsClient({ testimonials }: { testimonials: typeof FALLBACK_TESTIMONIALS }) {
  const third = Math.ceil(testimonials.length / 3);
  const columns = [
    { items: testimonials.slice(0, third), duration: '15s', visibility: '' },
    { items: testimonials.slice(third, third * 2), duration: '19s', visibility: 'hidden md:flex' },
    { items: testimonials.slice(third * 2), duration: '17s', visibility: 'hidden lg:flex' },
  ].filter((c) => c.items.length > 0);

  return (
    <section
      className="bg-surface-container py-section-py-mobile md:py-section-py-desktop px-margin-mobile md:px-margin-desktop overflow-hidden"
      id="testimonials"
    >
      <div className="md:max-w-container-max md:mx-auto">
        <div className="text-center mb-8 md:mb-12" data-animate="fade-up">
          <span className="font-label-mono text-label-mono text-primary uppercase mb-3 md:mb-4 block">
            Testimonials
          </span>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-3 md:mb-4">
            What our users say
          </h2>
          <p className="font-body-std text-body-std text-on-surface-variant md:max-w-2xl md:mx-auto">
            See what our customers have to say about us.
          </p>
        </div>

        {/* Mobile: swipeable carousel */}
        <div className="md:hidden">
          <Carousel edge className="gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="snap-item w-[82vw] max-w-[340px]">
                <TestimonialCard t={t} />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Desktop: 3-column vertical marquee */}
        <div className="hidden md:block relative h-[600px] overflow-hidden mask-vertical-gradient">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 h-full">
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                className={`${colIdx === 0 ? 'flex' : col.visibility} flex-col gap-8 animate-scroll-y`}
                style={{ animationDuration: col.duration }}
              >
                {/* Item set duplicated once for a seamless loop */}
                {[...col.items, ...col.items].map((t, i) => (
                  <TestimonialCard key={`${t.name}-${i}`} t={t} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
