import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { siteNavigation } from "@/config/navigation";
import type { Profile, SpecializationSummary } from "@/sanity/types";

interface SiteFooterProps {
  profile: Profile;
  specializations: SpecializationSummary[];
}

export function SiteFooter({ profile, specializations }: SiteFooterProps) {
  const [officeNameFirstLine, officeNameSecondLine] = splitOfficeName(
    profile.officeName,
  );

  return (
    <footer className="border-t border-white/10 bg-zinc-950 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[1.2fr_0.8fr_1fr]">
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
              <a className="flex gap-3 transition hover:text-white" href={`tel:${profile.phone}`}>
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
                className="flex gap-3 transition hover:text-white"
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
        </div>

        <nav aria-label="Stopka" className="grid content-start gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Nawigacja
          </h2>
          {siteNavigation.map((item) => (
            <Link
              className="text-sm text-zinc-300 transition hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Specjalizacje
          </h2>
          <div className="mt-3 grid gap-3">
            {specializations.slice(0, 6).map((specialization) => (
              <Link
                className="text-sm text-zinc-300 transition hover:text-white"
                href={`/specjalizacje/${specialization.slug}`}
                key={specialization._id}
              >
                {specialization.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-10">
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
