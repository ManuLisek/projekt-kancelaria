import { defineField, defineType } from "sanity";

export const specialization = defineType({
  name: "specialization",
  title: "Specjalizacja",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nazwa",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Krotki opis",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "content",
      title: "Pelna tresc",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Kolejnosc",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      title: "Kolejnosc",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
  },
});
