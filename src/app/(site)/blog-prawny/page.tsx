import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageBuilder } from "@/sanity/lib/image";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import type { ArticleSummary } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Blog prawny",
  description:
    "Artykuły i praktyczne omówienia tematów prawnych przygotowane przez kancelarię.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const articles = await sanityFetch<ArticleSummary[]>(ARTICLES_QUERY);

  return (
    <main>
      <section className="border-b border-white/10 bg-zinc-950 text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">
            Blog prawny
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Artykuły i aktualności
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            Praktyczne omówienia wybranych zagadnień prawnych i najważniejszych
            tematów z pracy kancelarii.
          </p>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
        {articles.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {articles.map((article) => {
              const imageUrl = article.mainImage
                ? imageBuilder
                    .image(article.mainImage)
                    .width(720)
                    .height(460)
                    .fit("crop")
                    .url()
                : null;

              return (
                <Link
                  className="group grid grid-rows-[auto_1fr] overflow-hidden border border-white/10 bg-zinc-900 transition hover:border-amber-500/60"
                  href={`/blog-prawny/${article.slug}`}
                  key={article._id}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={article.mainImageAlt || article.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 31vw, 100vw"
                      />
                    ) : null}
                  </div>
                  <div className="grid min-h-72 grid-rows-[auto_auto_1fr_auto] p-6">
                    <time className="text-sm text-zinc-500">
                      {formatDate(article.publishedAt)}
                    </time>
                    <h2 className="mt-3 text-xl font-semibold leading-tight">
                      {article.title}
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-zinc-300">
                      {article.excerpt}
                    </p>
                    <span className="mt-8 text-sm font-medium text-amber-300">
                      Czytaj więcej
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="border border-white/10 bg-zinc-900 p-8 text-zinc-300">
            Artykuły pojawią się wkrótce.
          </div>
        )}
        </div>
      </section>
    </main>
  );
}
