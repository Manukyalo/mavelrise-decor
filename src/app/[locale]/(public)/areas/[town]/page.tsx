import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TOWNS_DATA } from "@/lib/seo/towns";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { PlannerQrCode } from "@/components/seo/PlannerQrCode";
import {
  MapPin,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

export async function generateStaticParams() {
  const towns = ["ruiru", "thika", "juja", "kiambu", "nairobi"];
  const locales = ["en", "sw"];

  const params: { locale: string; town: string }[] = [];
  locales.forEach((locale) => {
    towns.forEach((town) => {
      params.push({ locale, town });
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; town: string };
}): Promise<Metadata> {
  const town = TOWNS_DATA[params.town.toLowerCase()];
  if (!town) return { title: "Location Not Found" };

  const isSw = params.locale === "sw";
  const title = isSw
    ? `Sakafu ya SPC & Paneli za Ukuta ${town.name} | MarvelRise Decor`
    : `${town.headline} | MarvelRise Decor Kenya`;

  const description = isSw
    ? `Nunua sakafu ya SPC ya 5.5mm & 6mm inayostahimili maji na paneli za WPC huko ${town.name}. Bei za KSh moja kwa moja, ufungaji wa kitaalamu na usafirishaji wa haraka.`
    : `Premium 100% waterproof SPC flooring (5.5mm & 6mm) and fluted WPC wall panels in ${town.name}, ${town.county}. Instant KSh room quotes and certified installation.`;

  return {
    title,
    description,
    keywords: [
      `SPC Flooring ${town.name}`,
      `Wall panels ${town.name}`,
      `MarvelRise Decor ${town.name}`,
      `Wooden flooring Kenya ${town.name}`,
      `Waterproof floor tiles ${town.county}`,
    ],
    alternates: {
      canonical: `https://mavelrise-decor.vercel.app/${params.locale}/areas/${town.slug}`,
      languages: {
        en: `https://mavelrise-decor.vercel.app/en/areas/${town.slug}`,
        sw: `https://mavelrise-decor.vercel.app/sw/areas/${town.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://mavelrise-decor.vercel.app/${params.locale}/areas/${town.slug}`,
      siteName: "MarvelRise Decor",
      type: "website",
    },
  };
}

export default function TownLandingPage({
  params,
}: {
  params: { locale: string; town: string };
}) {
  const town = TOWNS_DATA[params.town.toLowerCase()];
  if (!town) {
    notFound();
  }

  const isSw = params.locale === "sw";
  const shopPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
  const waMessage = `Hello MarvelRise Decor, I live in ${town.name} (${town.county}) and I would like advice on SPC flooring and wall panels for my project.`;
  const whatsappUrl = `https://wa.me/${shopPhone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-brand-navy bg-noise text-brand-ivory">
      <LocalBusinessJsonLd />

      {/* Hero Section with Localized Headline */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-ivory/50">
          <Link href={`/${params.locale}`} className="hover:text-brand-gold transition-colors">
            {isSw ? "Nyumbani" : "Home"}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{isSw ? "Maeneo" : "Locations"}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-gold">{town.name}</span>
        </nav>

        {/* Hero Banner */}
        <div className="p-8 sm:p-12 rounded-sm bg-brand-navy-card border border-brand-gold/30 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[11px] font-mono uppercase tracking-widest text-brand-gold font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {town.name} • {town.county}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl text-brand-ivory font-light uppercase tracking-wide leading-tight max-w-3xl">
            {isSw ? `Sakafu ya SPC & Mapambo ya Ndani ya Kisasa ${town.name}` : town.headline}
          </h1>

          <p className="font-sans text-sm sm:text-base text-brand-ivory/80 leading-relaxed max-w-2xl">
            {town.heroSnippet}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-gold/15 text-xs font-mono">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-gold shrink-0" />
              <div>
                <span className="text-brand-ivory/50 block text-[10px] uppercase">
                  {isSw ? "Muda wa Kufika" : "Delivery Window"}
                </span>
                <span className="text-brand-ivory font-semibold">{town.deliveryNotes}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-brand-gold shrink-0" />
              <div>
                <span className="text-brand-ivory/50 block text-[10px] uppercase">
                  {isSw ? "Umbali wa Showroom" : "Showroom Proximity"}
                </span>
                <span className="text-brand-ivory font-semibold">{town.showroomDistance}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-brand-ivory/50 block text-[10px] uppercase">
                  {isSw ? "Dhamana" : "Warranty Standard"}
                </span>
                <span className="text-brand-ivory font-semibold">
                  {isSw ? "Miaka 25 ya Makazi" : "25-Yr Residential Warranty"}
                </span>
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={`/${params.locale}/planner`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs font-mono uppercase tracking-widest shadow-xl shadow-brand-gold/20 transition-all"
            >
              <span>{isSw ? "Fungua Chumba cha 3D" : "Calculate Room Quote in 3D"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-brand-gold/40 hover:border-brand-gold text-brand-gold text-xs font-mono uppercase tracking-widest hover:bg-brand-gold/10 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isSw ? "Wasiliana nasi WhatsApp" : `WhatsApp ${town.name} Concierge`}</span>
            </a>
          </div>
        </div>

        {/* Local Architectural Context Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-4">
              <h2 className="font-display text-2xl uppercase tracking-wider text-brand-ivory font-medium">
                {isSw ? `Kwa Nini Wakaazi wa ${town.name} Wanachagua MarvelRise Decor` : `Craftsmanship Tailored for Homes in ${town.name}`}
              </h2>
              <p className="text-sm font-sans text-brand-ivory/80 leading-relaxed">
                {town.introParagraph}
              </p>
            </div>

            {/* Neighborhoods Served */}
            <div className="p-8 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-4">
              <h3 className="font-display text-xl uppercase tracking-wider text-brand-ivory">
                {isSw ? `Vitongoji na Maeneo ya Makazi Tunayohudumia ${town.name}` : `Key Estates & Neighbourhoods Served in ${town.name}`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {town.neighborhoods.map((nb, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-sm bg-brand-navy border border-brand-gold/25 text-xs font-mono text-brand-gold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold/70" />
                    <span>{nb}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Products for this area */}
            <div className="p-8 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-6">
              <h3 className="font-display text-xl uppercase tracking-wider text-brand-ivory">
                {isSw ? "Nyenzo Zilizopendekezwa kwa Miradi ya Eneo Hili" : `Recommended Architectural Specifications for ${town.name}`}
              </h3>
              <div className="space-y-4">
                {town.recommendedProducts.map((prod, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-sm bg-brand-navy border border-brand-gold/15 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-brand-gold font-bold">
                        {prod.category}
                      </span>
                      <span className="text-[11px] font-mono text-brand-ivory/50">
                        {prod.productTitle}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-brand-ivory/70 leading-relaxed">
                      {prod.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: QR Code + Showroom Visit Info */}
          <div className="space-y-6">
            <PlannerQrCode
              url={`https://mavelrise-decor.vercel.app/${params.locale}/planner?area=${town.slug}`}
              label={`Scan with phone to design a ${town.name} room in 3D`}
            />

            <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-4 text-xs font-mono">
              <h4 className="font-display text-lg uppercase tracking-wider text-brand-ivory">
                {isSw ? "Tembelea Showroom Yetu" : "Showroom Directions"}
              </h4>
              <p className="text-brand-ivory/70 font-sans leading-relaxed">
                Eastern Bypass, First U-turn from Bypass to OJ, opposite NattyGym, Ruiru Membley.
              </p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=-1.1492,36.9624"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-sm border border-brand-gold/40 hover:border-brand-gold text-brand-gold text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isSw ? "Fungua Ramani ya Google" : "Get Google Maps Directions"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

