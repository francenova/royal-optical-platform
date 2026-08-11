import { defineField, defineType } from 'sanity';

export const contactLensProduct = defineType({
  name: 'contactLensProduct',
  title: 'Catalog: Contact Lens',
  type: 'document',
  fields: [
    defineField({ name: 'code', title: 'Code (e.g. CL-01)', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'icon',
      title: 'Material Symbol icon name',
      type: 'string',
      description: 'e.g. calendar_today, sync, adjust, layers',
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ name: 'orderAsc', title: 'Order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'label', subtitle: 'code', media: 'image' },
  },
});
