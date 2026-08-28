import { FAQClient, FALLBACK_FAQS } from './FAQClient';

/**
 * Split out from the FAQ component so app/page.tsx can fetch this once and
 * reuse it both for rendering and for the FAQPage JSON-LD, instead of
 * querying Sanity twice for the same data.
 */
export async function getFaqs(): Promise<{ q: string; a: string }[]> {
  try {
    const { sanityClient } = await import('@/lib/sanity/client');
    const { FAQS_QUERY } = await import('@/lib/sanity/queries');
    const docs = await sanityClient.fetch(FAQS_QUERY);
    if (docs?.length) {
      return docs.map((d: { question: string; answer: string }) => ({ q: d.question, a: d.answer }));
    }
  } catch {
    // Sanity not reachable yet — fallback data below is used.
  }
  return FALLBACK_FAQS;
}

export function FAQ({ faqs }: { faqs: { q: string; a: string }[] }) {
  return <FAQClient faqs={faqs} />;
}
