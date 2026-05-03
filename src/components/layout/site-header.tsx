"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { siteNavigation } from "@/config/navigation";

interface SiteHeaderProps {
  officeName: string;
}

export function SiteHeader({ officeName }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [officeNameFirstLine, officeNameSecondLine] = splitOfficeName(officeName);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/95 text-white backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link
          className="flex min-w-0 max-w-[18rem] items-center gap-3 sm:max-w-none"
          href="/"
          onClick={closeMenu}
        >
          <Image
            src="/logo.png"
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0"
            priority
          />
          <span className="min-w-0 text-sm font-semibold uppercase leading-tight tracking-[0.12em] text-white sm:tracking-[0.16em]">
            <span className="block">{officeNameFirstLine}</span>
            {officeNameSecondLine ? (
              <span className="block">{officeNameSecondLine}</span>
            ) : null}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Glowne">
          {siteNavigation.map((item) => (
            <Link
              className={getNavLinkClass(pathname, item.href)}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "Zamknij menu" : "Otworz menu"}
          className="inline-flex size-11 items-center justify-center border border-white/20 text-white transition hover:border-amber-300 hover:text-amber-200 lg:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          {isMenuOpen ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
        </button>
      </div>

      {isMenuOpen ? (
        <nav
          aria-label="Glowne menu mobilne"
          className="border-t border-white/10 bg-zinc-950 lg:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-1 px-6 py-4 sm:px-10">
            {siteNavigation.map((item) => (
              <Link
                className={getMobileNavLinkClass(pathname, item.href)}
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function splitOfficeName(officeName: string) {
  const splitToken = " Adwokat ";

  if (!officeName.includes(splitToken)) {
    return [officeName, null] as const;
  }

  const [firstLine, secondLine] = officeName.split(splitToken);

  return [firstLine, `Adwokat ${secondLine}`] as const;
}

function getNavLinkClass(pathname: string, href: string) {
  const base =
    "px-3 py-2 text-sm font-medium transition hover:text-amber-300";
  const active = isActivePath(pathname, href)
    ? "text-amber-300"
    : "text-zinc-300";

  return `${base} ${active}`;
}

function getMobileNavLinkClass(pathname: string, href: string) {
  const base = "border-l px-4 py-3 text-base font-medium transition";
  const active = isActivePath(pathname, href)
    ? "border-amber-400 bg-white/5 text-amber-300"
    : "border-white/10 text-zinc-300";

  return `${base} ${active}`;
}
