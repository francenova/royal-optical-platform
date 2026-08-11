import { defineField, defineType } from 'sanity';

export const frame = defineType({
  name: 'frame',
  title: 'Catalog: Frame',
  type: 'document',
  fields: [
    defineField({ name: 'code', title: 'Code (e.g. FR-01)', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'size',
      title: 'Card Size',
      type: 'string',
      options: { list: ['large', 'small'] },
      initialValue: 'small',
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ name: 'orderAsc', title: 'Order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'label', subtitle: 'code', media: 'image' },
  },
});
