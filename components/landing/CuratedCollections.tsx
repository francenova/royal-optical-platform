import { CuratedCollectionsClient, FALLBACK_COLLECTIONS } from './CuratedCollectionsClient';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface CollectionDoc {
  icon?: string;
  title: string;
  description?: string;
  image: SanityImageSource;
}

export async function CuratedCollections() {
  let collections = FALLBACK_COLLECTIONS;

  try {
    const { sanityClient, urlFor } = await import('@/lib/sanity/client');
    const { COLLECTIONS_QUERY } = await import('@/lib/sanity/queries');
    const docs = await sanityClient.fetch(COLLECTIONS_QUERY);
    if (docs?.length) {
      collections = docs.map((d: CollectionDoc) => ({
        icon: d.icon || 'visibility',
        title: d.title,
        description: d.description || '',
        alt: d.description ? `${d.title} — ${d.description}` : `${d.title} — curated collection at Royal Opticals`,
        src: urlFor(d.image).width(700).height(700).url(),
      }));
    }
  } catch {
    // Sanity not reachable yet — fallback data above is used.
  }

  return <CuratedCollectionsClient collections={collections} />;
}
