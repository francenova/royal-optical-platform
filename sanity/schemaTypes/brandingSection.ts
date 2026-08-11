import { defineField, defineType } from 'sanity';

export const brandingSection = defineType({
  name: 'brandingSection',
  title: 'Branding & Logo',
  type: 'document',
  icon: () => '🎨',
  fields: [
    defineField({
      name: 'clinicName',
      title: 'Clinic / Business Name',
      type: 'string',
      description: 'Displayed in the header, footer, and anywhere the brand name appears.',
      initialValue: 'Royal Opticals',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short brand tagline used for SEO and social media.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Main logo image displayed in the header navigation bar. Transparent PNG recommended.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer Brand Description',
      type: 'text',
      description: 'Short brand paragraph shown in the footer beneath the logo/name.',
      initialValue:
        'Pairing clinical precision with everyday style — comprehensive eye exams, expert lens fitting, and frames chosen for how you actually see the world.',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'clinicName', media: 'logo' },
    prepare({ title, media }) {
      return { title: title || 'Branding & Logo', subtitle: 'Brand identity & logo', media };
    },
  },
});
