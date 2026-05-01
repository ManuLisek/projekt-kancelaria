import type { Metadata } from "next";
import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { SPECIALIZATIONS_QUERY } from "@/sanity/lib/queries";
import type { SpecializationSummary } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Specjalizacje",
  description:
    "Poznaj obszary pomocy prawnej oferowane przez kancelarie adwokacka.",
};

export const revalidate = 3600;

export default async function SpecializationsPage() {
  const specializations =
    await client.fetch<SpecializationSummary[]>(SPECIALIZATIONS_QUERY);

  return (
    <main>
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
            Specjalizacje
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Obszary pomocy prawnej
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            Wybierz zakres sprawy, aby poznac szczegoly wsparcia prawnego.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
        {specializations.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {specializations.map((specialization) => (
              <Link
                className="grid min-h-64 grid-rows-[auto_1fr_auto] border border-zinc-200 bg-white p-6 transition hover:border-amber-700"
                href={`/specjalizacje/${specialization.slug}`}
                key={specialization._id}
              >
                <h2 className="min-h-16 text-2xl font-semibold leading-tight">
                  {specialization.title}
                </h2>
                <p className="mt-5 text-sm leading-6 text-zinc-600">
                  {specialization.excerpt}
                </p>
                <span className="mt-8 inline-flex self-end text-sm font-medium text-amber-800">
                  Czytaj wiecej
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-zinc-200 bg-white p-8 text-zinc-700">
            Specjalizacje pojawia sie wkrotce.
          </div>
        )}
      </section>
    </main>
  );
}
