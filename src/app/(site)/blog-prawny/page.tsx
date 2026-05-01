import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import { imageBuilder } from "@/sanity/lib/image";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import type { ArticleSummary } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Blog prawny",
  description:
    "Artykuly i praktyczne omowienia tematow prawnych przygotowane przez kancelarie.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const articles = await client.fetch<ArticleSummary[]>(ARTICLES_QUERY);

  return (
    <main>
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
            Blog prawny
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Artykuly i aktualnosci
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            Praktyczne omowienia wybranych zagadnien prawnych i najwazniejszych
            tematow z pracy kancelarii.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
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
                  className="group grid grid-rows-[auto_1fr] bg-white"
                  href={`/blog-prawny/${article.slug}`}
                  key={article._id}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200">
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
                  <div className="grid min-h-72 grid-rows-[auto_auto_1fr_auto] border border-t-0 border-zinc-200 p-6">
                    <time className="text-sm text-zinc-500">
                      {formatDate(article.publishedAt)}
                    </time>
                    <h2 className="mt-3 text-xl font-semibold leading-tight">
                      {article.title}
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-zinc-600">
                      {article.excerpt}
                    </p>
                    <span className="mt-8 text-sm font-medium text-amber-800">
                      Czytaj wiecej
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="border border-zinc-200 bg-white p-8 text-zinc-700">
            Artykuly pojawia sie wkrotce.
          </div>
        )}
      </section>
    </main>
  );
}
