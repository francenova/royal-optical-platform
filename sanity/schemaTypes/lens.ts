import { defineField, defineType } from 'sanity';

export const lens = defineType({
  name: 'lens',
  title: 'Catalog: Lens',
  type: 'document',
  fields: [
    defineField({ name: 'code', title: 'Code (e.g. LN-01)', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ name: 'orderAsc', title: 'Order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'label', subtitle: 'code', media: 'image' },
  },
});
