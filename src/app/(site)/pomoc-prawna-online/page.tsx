import type { Metadata } from "next";
import { Clock, Mail, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { OnlineLegalAidForm } from "@/components/contact/online-legal-aid-form";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PROFILE_QUERY } from "@/sanity/lib/queries";
import type { Profile } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Pomoc prawna online",
  description:
    "Opisz sprawę przez formularz kontaktowy i otrzymaj odpowiedź kancelarii na wskazany adres email.",
};

export const revalidate = 3600;

export default async function OnlineLegalAidPage() {
  const profile = await sanityFetch<Profile | null>(PROFILE_QUERY);

  if (!profile) {
    throw new Error("Missing required Sanity document: profile");
  }

  return (
    <main>
      <section className="border-b border-white/10 bg-zinc-950 text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">
            Pomoc prawna online
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Opisz sprawę i poczekaj na kontakt kancelarii
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            Formularz pozwala szybko przekazać najważniejsze informacje i
            ustalić dalszy sposób kontaktu.
          </p>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-6">
            <div className="border border-white/10 bg-zinc-900 p-6">
              <h2 className="text-2xl font-semibold">Jak to działa?</h2>
              <div className="mt-6 grid gap-5 text-sm leading-6 text-zinc-300">
                <InfoItem
                  icon={<Mail aria-hidden size={20} />}
                  text="Wypełniasz formularz i opisujesz sprawę w kilku zdaniach."
                  title="Wiadomość"
                />
                <InfoItem
                  icon={<ShieldCheck aria-hidden size={20} />}
                  text="Dane trafiają wyłącznie na skrzynkę ustawioną dla kancelarii."
                  title="Bezpieczna wysyłka"
                />
                <InfoItem
                  icon={<Clock aria-hidden size={20} />}
                  text="Kancelaria odpowiada na podany email lub telefon."
                  title="Kontakt zwrotny"
                />
              </div>
            </div>

            <div className="border border-white/10 bg-zinc-900 p-6 text-sm leading-6 text-zinc-300">
              <h2 className="font-semibold text-white">Kontakt bezpośredni</h2>
              {profile.email ? (
                <a
                  className="mt-3 block transition hover:text-amber-200"
                  href={`mailto:${profile.email}`}
                >
                  {profile.email}
                </a>
              ) : null}
              {profile.phone ? (
                <a
                  className="mt-2 block transition hover:text-amber-200"
                  href={`tel:${profile.phone}`}
                >
                  {profile.phone}
                </a>
              ) : null}
            </div>
          </aside>

          <div className="border border-white/10 bg-zinc-900 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Formularz kontaktowy</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Nie przesyłaj dokumentów ani szczególnych danych wrażliwych, jeśli
              nie są potrzebne do wstępnego kontaktu.
            </p>
            <div className="mt-8">
              <OnlineLegalAidForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface InfoItemProps {
  icon: ReactNode;
  text: string;
  title: string;
}

function InfoItem({ icon, text, title }: InfoItemProps) {
  return (
    <div className="flex gap-4">
      <span className="mt-1 flex size-10 shrink-0 items-center justify-center bg-amber-500/10 text-amber-300">
        {icon}
      </span>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1">{text}</p>
      </div>
    </div>
  );
}
