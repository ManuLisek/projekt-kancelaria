import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PROFILE_QUERY, SPECIALIZATIONS_QUERY } from "@/sanity/lib/queries";
import type { Profile, SpecializationSummary } from "@/sanity/types";

export const revalidate = 3600;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, specializations] = await Promise.all([
    sanityFetch<Profile | null>(PROFILE_QUERY),
    sanityFetch<SpecializationSummary[]>(SPECIALIZATIONS_QUERY),
  ]);

  if (!profile) {
    throw new Error("Missing required Sanity document: profile");
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-white">
      <SiteHeader officeName={profile.officeName} />
      {children}
      <SiteFooter profile={profile} specializations={specializations} />
    </div>
  );
}
