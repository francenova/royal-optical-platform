import { defineField, defineType } from 'sanity';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  icon: () => '🏠',
  fields: [
    defineField({
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      description: 'Small uppercase label above the heading. E.g. "Medical Excellence — Curated Style"',
      initialValue: 'Medical Excellence — Curated Style',
    }),
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      description: 'Large display heading. E.g. "ROYAL OPTICALS"',
      initialValue: 'ROYAL OPTICALS',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'headingAccent',
      title: 'Heading Accent Line',
      type: 'string',
      description: 'Colored accent text below the main heading. E.g. "DEDICATED TO YOUR EYE HEALTH."',
      initialValue: 'DEDICATED TO YOUR EYE HEALTH.',
    }),
    defineField({
      name: 'description',
      title: 'Description Paragraph',
      type: 'text',
      description: 'Body text paragraph displayed beneath the heading. Keep it to 2–3 sentences.',
      initialValue:
        'For over 12 years, Royal Opticals has paired clinical precision with high-end editorial sophistication. Experience the luxury of seeing clearly.',
      rows: 3,
    }),
    defineField({
      name: 'primaryButtonText',
      title: 'Primary Button — Label',
      type: 'string',
      description: 'Text on the main CTA button.',
      initialValue: 'Explore Services',
    }),
    defineField({
      name: 'primaryButtonLink',
      title: 'Primary Button — Link',
      type: 'string',
      description: 'Anchor link or URL for the primary button. E.g. "#services"',
      initialValue: '#services',
      validation: (r) =>
        r.custom((value) => {
          if (!value) return true;
          if (/^(#|\/(?!\/)|https?:)/i.test(value)) return true;
          return 'Must be an anchor (#id), relative path (/page), or http(s) URL';
        }),
    }),
    defineField({
      name: 'secondaryButtonText',
      title: 'Secondary Button — Label',
      type: 'string',
      description: 'Text on the secondary (outline) button.',
      initialValue: 'View Catalog',
    }),
    defineField({
      name: 'secondaryButtonLink',
      title: 'Secondary Button — Link',
      type: 'string',
      description: 'Anchor link or URL for the secondary button. E.g. "#full-catalog"',
      initialValue: '#full-catalog',
      validation: (r) =>
        r.custom((value) => {
          if (!value) return true;
          if (/^(#|\/(?!\/)|https?:)/i.test(value)) return true;
          return 'Must be an anchor (#id), relative path (/page), or http(s) URL';
        }),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Main hero photograph displayed beside the text. Recommended aspect ratio 4:5.',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero Image — Alt Text',
      type: 'string',
      description: 'Accessible description of the hero image for screen readers and SEO.',
      initialValue: 'Optometrist holding luxury gold-rimmed glasses in a minimalist clinical setting',
    }),
    defineField({
      name: 'orbitText',
      title: 'Orbit Badge Text',
      type: 'string',
      description: 'Rotating circular text around the WhatsApp badge. Keep it short.',
      initialValue: 'BOOK VIA WHATSAPP • CLINICAL EXCELLENCE •',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Hero Section', subtitle: 'Homepage hero banner' };
    },
  },
});
