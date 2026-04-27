import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["profile", "onlineLegalAid"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Tresci")
    .items([
      S.listItem()
        .title("Profil kancelarii")
        .id("profile")
        .child(
          S.document()
            .schemaType("profile")
            .documentId("profile")
            .title("Profil kancelarii"),
        ),
      S.listItem()
        .title("Pomoc prawna online")
        .id("onlineLegalAid")
        .child(
          S.document()
            .schemaType("onlineLegalAid")
            .documentId("onlineLegalAid")
            .title("Pomoc prawna online"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? ""),
      ),
    ]);
