import { defineField, defineType } from 'sanity';

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact & Booking',
  type: 'document',
  icon: () => '📞',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Main heading text. E.g. "SECURE YOUR"',
      initialValue: 'SECURE YOUR',
    }),
    defineField({
      name: 'headingAccent',
      title: 'Heading Accent Word',
      type: 'string',
      description: 'Accent-colored word in the heading. E.g. "SESSION"',
      initialValue: 'SESSION',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Full phone number with country code. E.g. "+919092919432"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Contact email for inquiries and bookings.',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Digits only, with country code and no "+" prefix. E.g. "919092919432"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      description: 'Full street address displayed on the contact card and footer.',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Google Maps — Embed URL',
      type: 'url',
      description: 'URL used for the embedded map iframe. Get this from Google Maps → Share → Embed.',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'mapDirectionsUrl',
      title: 'Google Maps — Directions URL',
      type: 'url',
      description: 'URL that opens Google Maps with directions to the clinic.',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { title: 'phone' },
    prepare({ title }) {
      return { title: 'Contact & Booking', subtitle: title || 'Contact information' };
    },
  },
});
