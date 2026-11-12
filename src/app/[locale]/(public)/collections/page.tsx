import { getCategories, getProducts } from "@/lib/supabase/products";
import { CatalogueView } from "@/components/catalogue/CatalogueView";
import { Sparkles, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architectural Collections | MarvelRise Decor Nairobi",
  description:
    "Explore our five signature architectural finishes: SPC flooring, WPC fluted wall panels, UV marble slabs, bespoke polyester lampshades, and artisanal decor.",
};

// Revalidate cache every 60 seconds
export const revalidate = 60;

interface CollectionsPageProps {
  params: {
    locale: string;
  };
}

export default async function CollectionsPage({ params }: CollectionsPageProps) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen bg-[#03060b] text-white pt-28 pb-32">
      {/* Showroom Hero Header */}
      <section className="relative border-b border-amber-500/20 bg-gradient-to-b from-[#060c16] via-[#040810] to-[#03060b] py-16 sm:py-24 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C49A6C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xs border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Showroom Catalogue · 5 Architectural Product Lines</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-medium tracking-tight">
                Architectural Finishes
              </h1>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
                Every surface tells a story. Discover engineered SPC click-lock timber, acoustic WPC fluted panels, monolithic UV marble sheets, and artisanal luminaires tailored for Kenya&apos;s luxury spaces.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-white/50 bg-black/40 border border-white/10 px-4 py-3 rounded-xs shrink-0">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Ruiru Membley Showroom · Open Mon–Sat</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalogue Grid & Filter Shell */}
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <CatalogueView
          initialProducts={products}
          categories={categories}
          locale={params.locale}
        />
      </main>
    </div>
  );
}

