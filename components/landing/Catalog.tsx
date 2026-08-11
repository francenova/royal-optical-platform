import { CatalogClient } from './CatalogClient';
import { FALLBACK_FRAMES, LENSES as FALLBACK_LENSES, CONTACT_LENSES as FALLBACK_CONTACTS } from './catalogData';

export async function Catalog() {
  let frames = FALLBACK_FRAMES;
  let lenses = FALLBACK_LENSES;
  let contacts: (typeof FALLBACK_CONTACTS[number] & { icon: string })[] = FALLBACK_CONTACTS;

  try {
    const { sanityClient, urlFor } = await import('@/lib/sanity/client');
    const { FRAMES_QUERY, LENSES_QUERY, CONTACT_LENS_QUERY } = await import('@/lib/sanity/queries');

    const [frameDocs, lensDocs, contactDocs] = await Promise.all([
      sanityClient.fetch(FRAMES_QUERY),
      sanityClient.fetch(LENSES_QUERY),
      sanityClient.fetch(CONTACT_LENS_QUERY),
    ]);

    if (frameDocs?.length) {
      frames = frameDocs.map((f: any) => ({
        code: f.code || '',
        label: f.label,
        alt: f.label,
        size: f.size === 'large' ? ('large' as const) : ('small' as const),
        src: urlFor(f.image).width(800).height(800).url(),
      }));
    }
    if (lensDocs?.length) {
      lenses = lensDocs.map((l: any) => ({
        code: l.code || '',
        label: l.label,
        alt: l.label,
        src: urlFor(l.image).width(600).height(600).url(),
      }));
    }
    if (contactDocs?.length) {
      contacts = contactDocs.map((c: any) => ({
        code: c.code || '',
        label: c.label,
        alt: c.label,
        description: c.description || '',
        icon: c.icon || 'visibility',
        src: urlFor(c.image).width(600).height(400).url(),
      }));
    }
  } catch {
    // Sanity not reachable yet — fallback data above is used.
  }

  return <CatalogClient frames={frames} lenses={lenses} contacts={contacts} />;
}
