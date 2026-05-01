import { createImageUrlBuilder } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

export const imageBuilder = createImageUrlBuilder({
  projectId,
  dataset,
});
