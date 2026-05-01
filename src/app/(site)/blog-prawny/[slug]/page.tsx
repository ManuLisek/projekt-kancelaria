import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/portable-text";
import { formatDate } from "@/lib/format-date";
import { imageBuilder } from "@/sanity/lib/image";
import {
  ARTICLE_BY_SLUG_QUERY,
  ARTICLE_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import type { ArticleDetails, SlugParam } from "@/sanity/types";

interface ArticlePageProps {
  params: Promise<SlugParam>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await client.fetch<SlugParam[]>(ARTICLE_SLUGS_QUERY);

  return slugs;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const imageUrl = article.mainImage
    ? imageBuilder.image(article.mainImage).width(1200).height(720).fit("crop").url()
    : null;

  return (
    <main>
      <article>
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-10">
            <Link className="text-sm font-medium text-amber-800" href="/blog-prawny">
              Wszystkie artykuly
            </Link>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-700">
              {article.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <time>{formatDate(article.publishedAt)}</time>
              {article.specializations?.map((specialization) => (
                <Link
                  className="border border-zinc-200 px-3 py-1 text-zinc-700 transition hover:border-amber-700"
                  href={`/specjalizacje/${specialization.slug}`}
                  key={specialization._id}
                >
                  {specialization.title}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {imageUrl ? (
          <div className="mx-auto w-full max-w-5xl px-6 pt-12 sm:px-10">
            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-200">
              <Image
                src={imageUrl}
                alt={article.mainImageAlt || article.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 960px, 100vw"
              />
            </div>
          </div>
        ) : null}

        <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-10">
          <PortableText value={article.content} />
        </div>
      </article>
    </main>
  );
}

async function getArticle(slug: string) {
  return client.fetch<ArticleDetails | null>(ARTICLE_BY_SLUG_QUERY, { slug });
}
