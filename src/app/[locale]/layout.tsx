import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mavelrise-decor.vercel.app"),
  title: "MarvelRise Decor | Architectural Finishes, SPC Flooring & Wall Panels",
  description:
    "East Africa's premier interior architectural craftsmanship studio based in Ruiru Membley. 100% waterproof SPC flooring (5.5mm & 6mm), acoustic fluted WPC wall panels, UV marble sheets and bespoke ambient illumination in Nairobi & Kiambu.",
  keywords: [
    "MarvelRise Decor",
    "SPC flooring Kenya",
    "SPC flooring Ruiru",
    "Waterproof flooring Nairobi",
    "WPC wall panels Kenya",
    "UV marble sheets Nairobi",
    "Gypsum ceiling Nairobi",
    "Architectural finishes Kiambu",
    "Acoustic wall panels",
    "Luxury interior design East Africa",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      sw: "/sw",
    },
  },
  openGraph: {
    title: "MarvelRise Decor | Architectural Finishes & 3D Room Visualizer",
    description:
      "Explore 100% waterproof SPC rigid-core flooring and fluted wall panelling in our interactive 3D room planner. Instant KSh quotes and showroom in Ruiru Membley.",
    url: "https://mavelrise-decor.vercel.app",
    siteName: "MarvelRise Decor",
    locale: "en_KE",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-brand-navy text-brand-ivory antialiased selection:bg-brand-gold selection:text-brand-navy min-h-screen">
        <LocalBusinessJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
