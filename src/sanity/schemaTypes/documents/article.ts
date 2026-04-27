import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Artykul",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tytul",
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
      title: "Zajawka",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "mainImage",
      title: "Zdjecie glowne",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Tekst alternatywny",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Data publikacji",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Tresc",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "specializations",
      title: "Powiazane specjalizacje",
      type: "array",
      of: [{ type: "reference", to: [{ type: "specialization" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      title: "Najnowsze",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "mainImage",
    },
  },
});
