import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactMap } from "@/components/contact/contact-map";
import { client } from "@/sanity/lib/client";
import { PROFILE_QUERY } from "@/sanity/lib/queries";
import type { Profile } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj sie z kancelaria adwokacka. Sprawdz dane adresowe, telefon, email i mape dojazdu.",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const profile = await client.fetch<Profile | null>(PROFILE_QUERY);

  if (!profile) {
    throw new Error("Missing required Sanity document: profile");
  }

  return (
    <main>
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
            Kontakt
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Skontaktuj sie z kancelaria
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            Wybierz najwygodniejsza forme kontaktu lub sprawdz lokalizacje na
            mapie.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="order-2 lg:order-1">
          <ContactMap
            address={profile.address}
            lat={profile.location?.lat}
            lng={profile.location?.lng}
          />
        </div>

        <div className="order-1 border border-zinc-200 bg-white p-6 sm:p-8 lg:order-2">
          <h2 className="text-2xl font-semibold">{profile.officeName}</h2>

          <div className="mt-8 grid gap-6 text-zinc-700">
            {profile.address ? (
              <div className="flex gap-4">
                <MapPin
                  aria-hidden
                  className="mt-1 shrink-0 text-amber-700"
                  size={22}
                />
                <div>
                  <h3 className="font-semibold text-zinc-950">Adres</h3>
                  <p className="mt-2 whitespace-pre-line leading-7">
                    {profile.address}
                  </p>
                </div>
              </div>
            ) : null}

            {profile.phone ? (
              <div className="flex gap-4">
                <Phone
                  aria-hidden
                  className="mt-1 shrink-0 text-amber-700"
                  size={22}
                />
                <div>
                  <h3 className="font-semibold text-zinc-950">Telefon</h3>
                  <a
                    className="mt-2 inline-flex leading-7 transition hover:text-amber-800"
                    href={`tel:${profile.phone}`}
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
            ) : null}

            {profile.email ? (
              <div className="flex gap-4">
                <Mail
                  aria-hidden
                  className="mt-1 shrink-0 text-amber-700"
                  size={22}
                />
                <div>
                  <h3 className="font-semibold text-zinc-950">Email</h3>
                  <a
                    className="mt-2 inline-flex leading-7 transition hover:text-amber-800"
                    href={`mailto:${profile.email}`}
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
