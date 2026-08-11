import { defineField, defineType } from 'sanity';

export const footerSection = defineType({
  name: 'footerSection',
  title: 'Footer',
  type: 'document',
  icon: () => '📋',
  fields: [
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Copyright line displayed at the bottom of the page.',
      initialValue: '© 2024 Royal Opticals. Medical Excellence & Curated Style.',
    }),
    defineField({
      name: 'designPhilosophy',
      title: 'Design Philosophy Text',
      type: 'string',
      description: 'Short philosophy tagline in the footer bottom bar.',
      initialValue: 'Design Philosophy: Medical Luxury',
    }),
    defineField({
      name: 'builtWith',
      title: 'Built With Text',
      type: 'string',
      description: 'Secondary tagline in the footer bottom bar.',
      initialValue: 'Built with Precision',
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter — Heading',
      type: 'string',
      description: 'Title above the newsletter signup form.',
      initialValue: 'Newsletter',
    }),
    defineField({
      name: 'newsletterDescription',
      title: 'Newsletter — Description',
      type: 'text',
      description: 'Short blurb text above the email input.',
      initialValue: 'Receive curated style updates and eye care tips directly to your inbox.',
      rows: 2,
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer', subtitle: 'Footer text & newsletter' };
    },
  },
});
