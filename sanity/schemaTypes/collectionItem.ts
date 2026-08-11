import { defineField, defineType } from 'sanity';

export const collectionItem = defineType({
  name: 'collectionItem',
  title: 'Curated Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'icon',
      title: 'Material Symbol icon name',
      type: 'string',
      description: 'e.g. eyeglasses, lens, face, workspace_premium, visibility',
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ name: 'orderAsc', title: 'Order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', media: 'image' },
  },
});
