import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { BrandedLoader } from "@/components/motion/BrandedLoader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyWhatsApp } from "@/components/layout/StickyWhatsApp";
import { PageTransition } from "@/components/motion/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";
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
  // Suppress footer and smooth-scroll on the planner route — it's a full-viewport app
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-next-intl-pathname") ?? "";
  const isPlanner = pathname.includes("/planner");

  return (
    <html lang={locale} className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="bg-brand-navy text-brand-ivory antialiased selection:bg-brand-gold selection:text-brand-navy">
        <LocalBusinessJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScrollProvider>
            {/* Custom Interactive Desktop Cursor */}
            <CustomCursor />

            {/* Branded Loader with MRD Animated Mark */}
            <BrandedLoader />

            {/* Navigation Header */}
            <Header />

            {/* Page Route Transitions */}
            <main className="min-h-screen">
              <PageTransition>{children}</PageTransition>
            </main>

            {/* Sticky Showroom WhatsApp Concierge */}
            <StickyWhatsApp />

            {/* Showroom Footer — hidden on planner (full-viewport app page) */}
            {!isPlanner && <Footer />}
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

