import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PortableText } from "@/components/portable-text";
import { imageBuilder } from "@/sanity/lib/image";
import {
  ARTICLES_QUERY,
  PROFILE_QUERY,
  SPECIALIZATIONS_QUERY,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import type {
  ArticleSummary,
  Profile,
  SpecializationSummary,
} from "@/sanity/types";

export const revalidate = 3600;

async function getHomePageData() {
  const [profile, specializations, articles] = await Promise.all([
    client.fetch<Profile | null>(PROFILE_QUERY),
    client.fetch<SpecializationSummary[]>(SPECIALIZATIONS_QUERY),
    client.fetch<ArticleSummary[]>(ARTICLES_QUERY),
  ]);

  return {
    profile,
    specializations: specializations.slice(0, 6),
    articles: articles.slice(0, 3),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await client.fetch<Profile | null>(PROFILE_QUERY);

  return {
    title: profile?.seo?.title || profile?.officeName || "Kancelaria Adwokacka",
    description:
      profile?.seo?.description ||
      "Strona wizytowka kancelarii adwokackiej z blogiem i specjalizacjami.",
  };
}

export default async function HomePage() {
  const { profile, specializations, articles } = await getHomePageData();

  if (!profile) {
    throw new Error("Missing required Sanity document: profile");
  }

  const portraitUrl = profile.portrait
    ? imageBuilder.image(profile.portrait).width(720).height(900).fit("crop").url()
    : null;

  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100dvh-5rem)] w-full max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
            {profile.officeName}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            {profile.personName}
          </h1>
          {profile.heroText ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
              {profile.heroText}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center justify-center bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
              href="/kontakt"
            >
              Umow konsultacje
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center border border-zinc-300 px-5 text-sm font-medium text-zinc-950 transition hover:border-zinc-950"
              href="/specjalizacje"
            >
              Zobacz specjalizacje
            </Link>
          </div>
        </div>

        {portraitUrl ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-200">
            <Image
              src={portraitUrl}
              alt={profile.portraitAlt || profile.personName}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        ) : null}
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
            O kancelarii
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Doswiadczenie i pomoc prawna
          </h2>
        </div>
        <PortableText value={profile.bio} />
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
                Specjalizacje
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Obszary pomocy prawnej
              </h2>
            </div>
            <Link className="text-sm font-medium text-amber-800" href="/specjalizacje">
              Wszystkie specjalizacje
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specializations.map((specialization) => (
              <Link
                className="min-h-44 border border-zinc-200 p-6 transition hover:border-amber-700"
                href={`/specjalizacje/${specialization.slug}`}
                key={specialization._id}
              >
                <h3 className="text-xl font-semibold">{specialization.title}</h3>
                {specialization.excerpt ? (
                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {specialization.excerpt}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
              Blog prawny
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Najnowsze artykuly</h2>
          </div>
          <Link className="text-sm font-medium text-amber-800" href="/blog-prawny">
            Wszystkie artykuly
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
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
                className="group bg-white"
                href={`/blog-prawny/${article.slug}`}
                key={article._id}
              >
                {imageUrl ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200">
                    <Image
                      src={imageUrl}
                      alt={article.mainImageAlt || article.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 31vw, 100vw"
                    />
                  </div>
                ) : null}
                <div className="border border-t-0 border-zinc-200 p-6">
                  <time className="text-sm text-zinc-500">
                    {new Intl.DateTimeFormat("pl-PL", {
                      dateStyle: "long",
                    }).format(new Date(article.publishedAt))}
                  </time>
                  <h3 className="mt-3 text-xl font-semibold">{article.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
