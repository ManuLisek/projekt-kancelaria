import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Profile, SpecializationSummary } from "@/sanity/types";

interface SiteFooterProps {
  profile: Profile;
  specializations: SpecializationSummary[];
}

export function SiteFooter({ profile, specializations }: SiteFooterProps) {
  const [officeNameFirstLine, officeNameSecondLine] = splitOfficeName(
    profile.officeName,
  );
  const facebookUrl =
    profile.facebookUrl ||
    "https://www.facebook.com/p/Kancelaria-Adwokacka-Adwokat-Wiktoria-Sendzik-100086098846467/";

  return (
    <footer className="border-t border-white/10 bg-zinc-950 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[0.95fr_1.35fr]">
        <div>
          <Link className="flex max-w-sm items-center gap-4" href="/">
            <Image
              src="/logo.png"
              alt=""
              width={52}
              height={52}
              className="size-13 shrink-0"
            />
            <span className="text-lg font-semibold leading-tight">
              <span className="block">{officeNameFirstLine}</span>
              {officeNameSecondLine ? (
                <span className="block">{officeNameSecondLine}</span>
              ) : null}
            </span>
          </Link>

          <div className="mt-6 space-y-3 text-sm text-zinc-300">
            {profile.address ? (
              <p className="flex gap-3">
                <MapPin
                  aria-hidden
                  className="mt-0.5 shrink-0 text-amber-300"
                  size={18}
                />
                <span className="whitespace-pre-line">{profile.address}</span>
              </p>
            ) : null}

            {profile.phone ? (
              <a className="flex gap-3 transition-colors hover:text-white" href={`tel:${profile.phone}`}>
                <Phone
                  aria-hidden
                  className="mt-0.5 shrink-0 text-amber-300"
                  size={18}
                />
                <span>{profile.phone}</span>
              </a>
            ) : null}

            {profile.email ? (
              <a
                className="flex gap-3 transition-colors hover:text-white"
                href={`mailto:${profile.email}`}
              >
                <Mail
                  aria-hidden
                  className="mt-0.5 shrink-0 text-amber-300"
                  size={18}
                />
                <span>{profile.email}</span>
              </a>
            ) : null}
          </div>

          <Link
            aria-label="Facebook kancelarii"
            className="mt-6 inline-flex size-10 items-center justify-center border border-amber-300/40 text-amber-300 transition-colors hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
            href={facebookUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FacebookIcon />
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Specjalizacje
          </h2>
          <div className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {specializations.map((specialization) => (
              <Link
                className="text-sm text-zinc-300 transition-colors hover:text-white"
                href={`/specjalizacje/${specialization.slug}`}
                key={specialization._id}
                prefetch={false}
              >
                {specialization.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>
            © {new Date().getFullYear()} {profile.officeName}. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}

function splitOfficeName(officeName: string) {
  const splitToken = " Adwokat ";

  if (!officeName.includes(splitToken)) {
    return [officeName, null] as const;
  }

  const [firstLine, secondLine] = officeName.split(splitToken);

  return [firstLine, `Adwokat ${secondLine}`] as const;
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M14.5 8.25V6.7c0-.75.5-.92.86-.92h2.18V2.12L14.52 2.1c-3.36 0-4.13 2.52-4.13 4.13v2.02H7.75v3.77h2.64V22h4.03v-9.98h3.02l.39-3.77H14.5Z" />
    </svg>
  );
}
