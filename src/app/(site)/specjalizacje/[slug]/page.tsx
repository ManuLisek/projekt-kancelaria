import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/portable-text";
import { client } from "@/sanity/lib/client";
import {
  SPECIALIZATION_BY_SLUG_QUERY,
  SPECIALIZATION_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { SlugParam, SpecializationDetails } from "@/sanity/types";

interface SpecializationPageProps {
  params: Promise<SlugParam>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await client.fetch<SlugParam[]>(SPECIALIZATION_SLUGS_QUERY);

  return slugs;
}

export async function generateMetadata({
  params,
}: SpecializationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const specialization = await getSpecialization(slug);

  if (!specialization) {
    return {};
  }

  return {
    title: specialization.seo?.title || specialization.title,
    description: specialization.seo?.description || specialization.excerpt,
  };
}

export default async function SpecializationPage({
  params,
}: SpecializationPageProps) {
  const { slug } = await params;
  const specialization = await getSpecialization(slug);

  if (!specialization) {
    notFound();
  }

  return (
    <main>
      <article>
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-10">
            <Link className="text-sm font-medium text-amber-800" href="/specjalizacje">
              Wszystkie specjalizacje
            </Link>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              {specialization.title}
            </h1>
            {specialization.excerpt ? (
              <p className="mt-6 text-lg leading-8 text-zinc-700">
                {specialization.excerpt}
              </p>
            ) : null}
          </div>
        </header>

        <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-10">
          <PortableText value={specialization.content} />
        </div>
      </article>
    </main>
  );
}

async function getSpecialization(slug: string) {
  return client.fetch<SpecializationDetails | null>(
    SPECIALIZATION_BY_SLUG_QUERY,
    { slug },
  );
}
