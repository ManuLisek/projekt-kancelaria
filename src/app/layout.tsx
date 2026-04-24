import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kancelaria.example.com"),
  title: {
    default: "Kancelaria Adwokacka",
    template: "%s | Kancelaria Adwokacka",
  },
  description:
    "Strona wizytowka kancelarii adwokackiej z blogiem prawnym, specjalizacjami i danymi kontaktowymi zarzadzanymi w CMS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
