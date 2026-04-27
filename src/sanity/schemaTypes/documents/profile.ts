import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profil kancelarii",
  type: "document",
  fields: [
    defineField({
      name: "officeName",
      title: "Nazwa kancelarii",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "personName",
      title: "Imie i nazwisko",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroText",
      title: "Tekst w hero",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "bio",
      title: "Opis osoby",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Zdjecie profilowe",
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
      name: "address",
      title: "Adres",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook",
      type: "url",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "officeName",
      subtitle: "personName",
      media: "portrait",
    },
  },
});
