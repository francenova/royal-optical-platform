import { TestimonialsClient, FALLBACK_TESTIMONIALS } from './TestimonialsClient';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface TestimonialDoc {
  name: string;
  role?: string;
  quote: string;
  photo: SanityImageSource;
}

export async function Testimonials() {
  let testimonials = FALLBACK_TESTIMONIALS;

  try {
    const { sanityClient, urlFor } = await import('@/lib/sanity/client');
    const { TESTIMONIALS_QUERY } = await import('@/lib/sanity/queries');
    const docs = await sanityClient.fetch(TESTIMONIALS_QUERY);
    if (docs?.length) {
      testimonials = docs.map((d: TestimonialDoc) => ({
        name: d.name,
        role: d.role || '',
        quote: d.quote,
        src: urlFor(d.photo).width(200).height(200).url(),
      }));
    }
  } catch {
    // Sanity not reachable yet — fallback data above is used.
  }

  return <TestimonialsClient testimonials={testimonials} />;
}
