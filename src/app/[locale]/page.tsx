import React from "react";
import { getTranslations } from "next-intl/server";
import { HeroRoomTransformation } from "@/components/home/HeroRoomTransformation";
import { ProductLinesShowcase } from "@/components/home/ProductLinesShowcase";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ClosingCta } from "@/components/home/ClosingCta";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { Reveal } from "@/components/motion/Reveal";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="relative w-full overflow-hidden bg-brand-navy text-brand-ivory">
      {/* =========================================================================
          HERO: CINEMATIC ROOM TRANSFORMATION TIED TO SCROLL & INTERACTIVE STAGES
          (French Oak planks click into place, wall panels slide in, lampshade lights up)
      ========================================================================= */}
      <HeroRoomTransformation
        headlineLine1="TRANSFORM ORDINARY SPACES"
        headlineLine2="INTO ARCHITECTURAL SANCTUARIES"
        ctaText="Design your room"
        subText="Witness raw spatial concrete transformed in real time: acoustic French oak floor planks snap into place, fluted timber walls lock in, and warm champagne illumination bathes the room."
      />

      {/* Thin Champagne Gold Rule */}
      <div className="gold-rule w-full" />

      {/* =========================================================================
          METRICS & TRUST BENCHMARK COUNTERS (Luxury Navy & Gold Cards)
      ========================================================================= */}
      <section className="py-14 border-b border-brand-gold/15 bg-brand-navy-deep">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal direction="up" delay={0.05} className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 hover:border-brand-gold/50 transition-all duration-300 shadow-xl">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-ivory mb-1">
                <AnimatedCounter value={380} suffix="+" duration={2.2} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                {t("stats.stat1Label")}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.15} className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 hover:border-brand-gold/50 transition-all duration-300 shadow-xl">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-ivory mb-1">
                <AnimatedCounter value={14} suffix=" YRS" duration={2.0} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                {t("stats.stat2Label")}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.25} className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 hover:border-brand-gold/50 transition-all duration-300 shadow-xl">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-ivory mb-1">
                <AnimatedCounter value={99.4} decimals={1} suffix="%" duration={2.4} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                {t("stats.stat3Label")}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.35} className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 hover:border-brand-gold/50 transition-all duration-300 shadow-xl">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-ivory mb-1">
                <AnimatedCounter value={48} suffix=" HRS" duration={1.8} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                {t("stats.stat4Label")}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE FIVE PRODUCT LINES (BESPOKE ANIMATED REVEALS & SPECIFICATIONS)
          (Includes interactive 5-layer SPC anatomy in Discipline 01)
      ========================================================================= */}
      <ProductLinesShowcase />

      {/* Thin Champagne Gold Rule */}
      <div className="gold-rule w-full" />

      {/* =========================================================================
          WHY CHOOSE US: SIX POINTS FROM THE MARVELRISE BROCHURE
      ========================================================================= */}
      <WhyChooseUs />

      {/* Thin Champagne Gold Rule */}
      <div className="gold-rule w-full" />

      {/* =========================================================================
          HOW IT WORKS IN 3 STEPS: MEASURE, PICK, GET YOUR QUOTE
      ========================================================================= */}
      <HowItWorks />

      {/* Thin Champagne Gold Rule */}
      <div className="gold-rule w-full" />

      {/* =========================================================================
          CLOSING INTERACTIVE ROOM PLANNER & DIRECT WHATSAPP CONCIERGE
      ========================================================================= */}
      <ClosingCta />
    </div>
  );
}
