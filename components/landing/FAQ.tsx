import { FAQClient, FALLBACK_FAQS } from './FAQClient';

export async function FAQ() {
  let faqs: { q: string; a: string }[] = FALLBACK_FAQS;

  try {
    const { sanityClient } = await import('@/lib/sanity/client');
    const { FAQS_QUERY } = await import('@/lib/sanity/queries');
    const docs = await sanityClient.fetch(FAQS_QUERY);
    if (docs?.length) {
      faqs = docs.map((d: any) => ({ q: d.question, a: d.answer }));
    }
  } catch {
    // Sanity not reachable yet — fallback data above is used.
  }

  return <FAQClient faqs={faqs} />;
}
