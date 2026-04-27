import { defineArrayMember, defineType } from "sanity";

export const portableText = defineType({
  name: "portableText",
  title: "Tresc",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Akapit", value: "normal" },
        { title: "Naglowek 2", value: "h2" },
        { title: "Naglowek 3", value: "h3" },
        { title: "Cytat", value: "blockquote" },
      ],
      lists: [
        { title: "Lista punktowana", value: "bullet" },
        { title: "Lista numerowana", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Pogrubienie", value: "strong" },
          { title: "Kursywa", value: "em" },
        ],
      },
    }),
  ],
});
