import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { BrandedLoader } from "@/components/motion/BrandedLoader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyWhatsApp } from "@/components/layout/StickyWhatsApp";
import { PageTransition } from "@/components/motion/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";
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
  title: "MarvelRise Decor | Architectural Finishes & Bespoke Ceilings",
  description:
    "East Africa's premier interior architectural craftsmanship studio. Acoustic gypsum ceilings, fluted wall panelling, ambient architectural illumination and bespoke spatial joinery in Nairobi.",
  keywords: [
    "MarvelRise Decor",
    "Gypsum ceiling Nairobi",
    "Architectural finishes Kenya",
    "Acoustic wall panels",
    "Luxury interior design East Africa",
    "Bespoke joinery Nairobi",
  ],
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
    <html lang={locale} className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="bg-brand-black text-brand-sand-50 antialiased selection:bg-brand-orange selection:text-brand-black">
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

            {/* Showroom Footer */}
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

