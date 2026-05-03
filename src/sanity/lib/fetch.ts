import { client } from "@/sanity/lib/client";

const devFetchOptions = {
  cache: "no-store",
} as const;

const productionFetchOptions = {
  next: {
    revalidate: 3600,
  },
} as const;

const fetchOptions =
  process.env.NODE_ENV === "development"
    ? devFetchOptions
    : productionFetchOptions;

export function sanityFetch<Result>(
  query: string,
  params: Record<string, unknown> = {},
) {
  return client.fetch<Result>(query, params, fetchOptions);
}
