import type { StructureResolver } from 'sanity/structure';

// Singleton document IDs — must match the documentId() calls below
const SINGLETON_TYPES = new Set([
  'heroSection',
  'brandingSection',
  'founderSection',
  'gallerySection',
  'contactSection',
  'footerSection',
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Homepage Sections ──
      S.listItem()
        .title('Homepage')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Homepage Sections')
            .items([
              S.listItem()
                .title('Hero Section')
                .icon(() => '🏠')
                .child(
                  S.document()
                    .schemaType('heroSection')
                    .documentId('heroSection'),
                ),
              S.listItem()
                .title('Branding & Logo')
                .icon(() => '🎨')
                .child(
                  S.document()
                    .schemaType('brandingSection')
                    .documentId('brandingSection'),
                ),
              S.listItem()
                .title('Founder Section')
                .icon(() => '👤')
                .child(
                  S.document()
                    .schemaType('founderSection')
                    .documentId('founderSection'),
                ),
              S.listItem()
                .title('Studio Gallery')
                .icon(() => '📸')
                .child(
                  S.document()
                    .schemaType('gallerySection')
                    .documentId('gallerySection'),
                ),
              S.listItem()
                .title('Contact & Booking')
                .icon(() => '📞')
                .child(
                  S.document()
                    .schemaType('contactSection')
                    .documentId('contactSection'),
                ),
              S.listItem()
                .title('Footer')
                .icon(() => '📋')
                .child(
                  S.document()
                    .schemaType('footerSection')
                    .documentId('footerSection'),
                ),
            ]),
        ),

      S.divider(),

      // ── Services ──
      S.documentTypeListItem('service').title('Services').icon(() => '🩺'),

      // ── Catalog (grouped) ──
      S.listItem()
        .title('Catalog')
        .icon(() => '👓')
        .child(
          S.list()
            .title('Catalog')
            .items([
              S.documentTypeListItem('frame').title('Frames'),
              S.documentTypeListItem('lens').title('Lenses'),
              S.documentTypeListItem('contactLensProduct').title('Contact Lenses'),
            ]),
        ),

      // ── Collections ──
      S.documentTypeListItem('collectionItem').title('Curated Collections').icon(() => '✨'),

      S.divider(),

      // ── Testimonials ──
      S.documentTypeListItem('testimonial').title('Testimonials').icon(() => '💬'),

      // ── FAQ ──
      S.documentTypeListItem('faqItem').title('FAQ').icon(() => '❓'),
    ]);

export { SINGLETON_TYPES };
