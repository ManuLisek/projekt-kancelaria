import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PortableText } from "@/components/portable-text";
import { formatDate } from "@/lib/format-date";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageBuilder } from "@/sanity/lib/image";
import {
  ARTICLES_QUERY,
  PROFILE_QUERY,
  SPECIALIZATIONS_QUERY,
} from "@/sanity/lib/queries";
import type {
  ArticleSummary,
  Profile,
  SpecializationSummary,
} from "@/sanity/types";

export const revalidate = 3600;

async function getHomePageData() {
  const [profile, specializations, articles] = await Promise.all([
    sanityFetch<Profile | null>(PROFILE_QUERY),
    sanityFetch<SpecializationSummary[]>(SPECIALIZATIONS_QUERY),
    sanityFetch<ArticleSummary[]>(ARTICLES_QUERY),
  ]);

  return {
    profile,
    specializations: specializations.slice(0, 6),
    articles: articles.slice(0, 3),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await sanityFetch<Profile | null>(PROFILE_QUERY);

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
      <section
        className="relative isolate flex min-h-[calc(100dvh-5rem)] items-center overflow-hidden bg-zinc-950 bg-cover bg-center bg-no-repeat lg:bg-fixed"
        style={{ backgroundImage: "url('/law.jpg')" }}
      >
        <div className="absolute inset-0 -z-10 bg-zinc-950/70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/20" />
        <div className="mx-auto w-full max-w-6xl px-6 py-24 text-white sm:px-10 lg:py-32">
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
            &quot;Advocatus non accusat - adwokat nie oskarża&quot;
          </h1>
          {profile.heroText ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
              {profile.heroText}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center justify-center bg-amber-500 px-5 text-sm font-medium text-zinc-950 transition hover:bg-amber-400"
              href="/pomoc-prawna-online"
            >
              Umów konsultację
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center border border-white/40 px-5 text-sm font-medium text-white transition hover:border-amber-300 hover:text-amber-200"
              href="/specjalizacje"
            >
              Zobacz specjalizacje
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {portraitUrl ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-amber-500/40 bg-zinc-900">
              <Image
                src={portraitUrl}
                alt={profile.portraitAlt || profile.personName}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            </div>
          ) : null}
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">
              O kancelarii
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Doświadczenie i pomoc prawna
            </h2>
            <div className="mt-8">
              <PortableText tone="dark" value={profile.bio} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">
                Specjalizacje
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Obszary pomocy prawnej
              </h2>
            </div>
            <Link
              className="text-sm font-medium text-amber-300 transition hover:text-amber-200"
              href="/specjalizacje"
            >
              Wszystkie specjalizacje
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specializations.map((specialization) => (
              <Link
                className="min-h-44 border border-white/10 bg-zinc-900 p-6 transition hover:border-amber-500/60"
                href={`/specjalizacje/${specialization.slug}`}
                key={specialization._id}
              >
                <h3 className="text-xl font-semibold">{specialization.title}</h3>
                {specialization.excerpt ? (
                  <p className="mt-4 text-sm leading-6 text-zinc-300">
                    {specialization.excerpt}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">
                Blog prawny
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Najnowsze artykuły</h2>
            </div>
            <Link
              className="text-sm font-medium text-amber-300 transition hover:text-amber-200"
              href="/blog-prawny"
            >
              Wszystkie artykuły
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
                  className="group grid overflow-hidden border border-white/10 bg-zinc-900 transition hover:border-amber-500/60"
                  href={`/blog-prawny/${article.slug}`}
                  key={article._id}
                >
                  {imageUrl ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
                      <Image
                        src={imageUrl}
                        alt={article.mainImageAlt || article.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 31vw, 100vw"
                      />
                    </div>
                  ) : null}
                  <div className="grid grid-rows-[auto_auto_1fr] p-6">
                    <time className="text-sm text-zinc-500">
                      {formatDate(article.publishedAt)}
                    </time>
                    <h3 className="mt-3 text-xl font-semibold">{article.title}</h3>
                    <p className="mt-4 text-sm leading-6 text-zinc-300">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
