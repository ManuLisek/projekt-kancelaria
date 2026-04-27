import imageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

export const imageBuilder = imageUrlBuilder({
  projectId,
  dataset,
});
