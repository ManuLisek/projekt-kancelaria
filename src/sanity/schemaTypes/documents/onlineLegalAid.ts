import { defineField, defineType } from "sanity";

export const onlineLegalAid = defineType({
  name: "onlineLegalAid",
  title: "Pomoc prawna online",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tytul",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Krotki opis",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "content",
      title: "Tresc",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Etykieta CTA",
      type: "string",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
