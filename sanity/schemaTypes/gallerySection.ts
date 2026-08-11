import { defineField, defineType } from 'sanity';

export const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Studio Gallery',
  type: 'document',
  icon: () => '📸',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Main heading text. E.g. "Welcome to the studio"',
      initialValue: 'Welcome to the studio',
    }),
    defineField({
      name: 'examRoomImage',
      title: 'Exam Room Image',
      type: 'image',
      description: 'Large photo for the Exam Room (aspect ratio 4:3 or taller).',
      options: { hotspot: true },
    }),
    defineField({
      name: 'frameWallImage',
      title: 'Frame Wall Image',
      type: 'image',
      description: 'Square photo for the Frame Wall.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'styleBarImage',
      title: 'Style Bar Image',
      type: 'image',
      description: 'Square photo for the Style Bar.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'fittingStudioImage',
      title: 'Fitting Studio Image',
      type: 'image',
      description: 'Wide photo for the Fitting Studio.',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Studio Gallery', subtitle: 'Welcome & clinic images' };
    },
  },
});
