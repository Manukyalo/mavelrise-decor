import React from "react";
import { getTranslations } from "next-intl/server";
import { HeroRoomTransformation } from "@/components/home/HeroRoomTransformation";
import { ProductLinesShowcase } from "@/components/home/ProductLinesShowcase";
import { SpcExplodedView } from "@/components/home/SpcExplodedView";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ClosingCta } from "@/components/home/ClosingCta";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { Reveal } from "@/components/motion/Reveal";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="relative w-full overflow-hidden bg-brand-black text-brand-sand-50">
      {/* =========================================================================
          HERO: CINEMATIC ROOM TRANSFORMATION TIED TO SCROLL
          (Planks click into place, wall panels slide in, lampshade lights up)
      ========================================================================= */}
      <HeroRoomTransformation
        headlineLine1="TRANSFORM ORDINARY SPACES"
        headlineLine2="INTO ARCHITECTURAL SANCTUARIES"
        ctaText="Design your room"
        subText="Scroll to witness raw space transformed in real time: acoustic floor planks snap into place, fluted timber walls lock in, and warm ambient illumination bathes the room."
      />

      {/* =========================================================================
          METRICS & TRUST BENCHMARK COUNTERS
      ========================================================================= */}
      <section className="py-14 border-b border-white/10 bg-brand-black-elevated/70">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal direction="up" delay={0.05} className="p-6 rounded-sm bg-brand-black border border-white/10 hover:border-brand-orange/40 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-white mb-1">
                <AnimatedCounter value={380} suffix="+" duration={2.2} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-sand-400">
                {t("stats.stat1Label")}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.15} className="p-6 rounded-sm bg-brand-black border border-white/10 hover:border-brand-green/40 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-white mb-1">
                <AnimatedCounter value={14} suffix=" YRS" duration={2.0} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-sand-400">
                {t("stats.stat2Label")}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.25} className="p-6 rounded-sm bg-brand-black border border-white/10 hover:border-brand-orange/40 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-white mb-1">
                <AnimatedCounter value={99.4} decimals={1} suffix="%" duration={2.4} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-sand-400">
                {t("stats.stat3Label")}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.35} className="p-6 rounded-sm bg-brand-black border border-white/10 hover:border-brand-green/40 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-white mb-1">
                <AnimatedCounter value={48} suffix=" HRS" duration={1.8} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-sand-400">
                {t("stats.stat4Label")}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE FIVE PRODUCT LINES (BESPOKE ANIMATED REVEALS & SPECIFICATIONS)
      ========================================================================= */}
      <ProductLinesShowcase />

      {/* =========================================================================
          PIN-AND-SCRUB SPC FLOORING EXPLODED ANATOMICAL SCENE
      ========================================================================= */}
      <SpcExplodedView />

      {/* =========================================================================
          WHY CHOOSE US: SIX POINTS FROM THE MARVELRISE BROCHURE
      ========================================================================= */}
      <WhyChooseUs />

      {/* =========================================================================
          HOW IT WORKS IN 3 STEPS: MEASURE, PICK, GET YOUR QUOTE
      ========================================================================= */}
      <HowItWorks />

      {/* =========================================================================
          CLOSING INTERACTIVE ROOM PLANNER & DIRECT WHATSAPP CONCIERGE
      ========================================================================= */}
      <ClosingCta />
    </div>
  );
}
