import { defineField, defineType } from 'sanity';

export const founderSection = defineType({
  name: 'founderSection',
  title: 'Founder Section',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'sectionLabel',
      title: 'Section Badge Label',
      type: 'string',
      description: 'Small uppercase badge text above the heading. E.g. "Philosophy"',
      initialValue: 'Philosophy',
    }),
    defineField({
      name: 'headingLine1',
      title: 'Heading — Line 1',
      type: 'string',
      description: 'First line of the section heading. E.g. "THE FOUNDER"',
      initialValue: 'THE FOUNDER',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'headingLine2',
      title: 'Heading — Line 2 (Accent Color)',
      type: 'string',
      description: 'Second line displayed in the accent/primary color. E.g. "THE STANDARD"',
      initialValue: 'THE STANDARD',
    }),
    defineField({
      name: 'paragraph1',
      title: 'Paragraph 1',
      type: 'text',
      description: 'First paragraph of the founder story.',
      initialValue:
        'Royal Opticals was forged from a singular vision: to create an uncompromising environment for high-performance individuals. We strip away the noise and focus entirely on the pure, unfiltered pursuit of visual clarity.',
      rows: 4,
    }),
    defineField({
      name: 'paragraph2',
      title: 'Paragraph 2',
      type: 'text',
      description: 'Second paragraph of the founder story.',
      initialValue:
        'Here, state-of-the-art biomechanics meet raw clinical expertise. Every square foot of our studio is meticulously designed to optimize your visual output.',
      rows: 4,
    }),
    defineField({
      name: 'founderPortrait',
      title: 'Founder Portrait',
      type: 'image',
      description: 'Main portrait photo of the founder. Displayed prominently in the section.',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Secondary background photo shown behind the portrait at an angle.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'yearsOfExcellence',
      title: 'Years of Excellence',
      type: 'number',
      description: 'Number displayed in the animated counter stat.',
      initialValue: 12,
    }),
    defineField({
      name: 'statLabel',
      title: 'Stat 1 — Label',
      type: 'string',
      description: 'Label text beneath the years counter.',
      initialValue: 'Years of Excellence',
    }),
    defineField({
      name: 'secondStatValue',
      title: 'Stat 2 — Value',
      type: 'string',
      description: 'Second stat display value. E.g. "Elite"',
      initialValue: 'Elite',
    }),
    defineField({
      name: 'secondStatLabel',
      title: 'Stat 2 — Label',
      type: 'string',
      description: 'Label beneath the second stat.',
      initialValue: 'Clinical Equipment',
    }),
  ],
  preview: {
    select: { media: 'founderPortrait' },
    prepare({ media }) {
      return { title: 'Founder Section', subtitle: 'Founder story & stats', media };
    },
  },
});
