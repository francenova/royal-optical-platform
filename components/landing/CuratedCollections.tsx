import { CuratedCollectionsClient, FALLBACK_COLLECTIONS } from './CuratedCollectionsClient';

export async function CuratedCollections() {
  let collections = FALLBACK_COLLECTIONS;

  try {
    const { sanityClient, urlFor } = await import('@/lib/sanity/client');
    const { COLLECTIONS_QUERY } = await import('@/lib/sanity/queries');
    const docs = await sanityClient.fetch(COLLECTIONS_QUERY);
    if (docs?.length) {
      collections = docs.map((d: any) => ({
        icon: d.icon || 'visibility',
        title: d.title,
        description: d.description || '',
        alt: d.title,
        src: urlFor(d.image).width(700).height(700).url(),
      }));
    }
  } catch {
    // Sanity not reachable yet — fallback data above is used.
  }

  return <CuratedCollectionsClient collections={collections} />;
}
