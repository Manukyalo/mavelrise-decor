import React from "react";
import { getTranslations } from "next-intl/server";
import { TextSplitReveal } from "@/components/motion/TextSplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { MultiLayerParallax } from "@/components/motion/MultiLayerParallax";
import { PinnedScene } from "@/components/motion/PinnedScene";
import { ScrubbedTimeline } from "@/components/motion/ScrubbedTimeline";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { ImageMaskReveal } from "@/components/motion/ImageMaskReveal";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { ArrowUpRight, ArrowDown, Sparkles, Layers, Sliders, Ruler, Shield } from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="relative w-full overflow-hidden bg-brand-black text-brand-sand-50">
      {/* =========================================================================
          SECTION 1: HERO WITH MULTI-LAYER PARALLAX DEPTH & TEXT SPLIT REVEAL
      ========================================================================= */}
      <section className="relative min-h-[95vh] flex flex-col justify-center pt-28 pb-16 border-b border-white/10">
        <MultiLayerParallax
          className="min-h-[85vh] flex items-center"
          bgSpeed={-70}
          midSpeed={20}
          fgSpeed={80}
          /* BACKGROUND LAYER: Architectural grid & atmospheric lighting glows */
          backgroundContent={
            <div className="relative w-full h-full">
              {/* Subtle architectural radial lighting */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-brand-green/10 blur-[130px] pointer-events-none" />
              <div className="absolute top-1/3 right-10 w-[450px] h-[400px] rounded-full bg-brand-orange/10 blur-[140px] pointer-events-none" />

              {/* Architectural laser measurement lines */}
              <div className="absolute inset-0 bg-noise opacity-40" />
              <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
              <div className="absolute right-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
            </div>
          }
          /* MIDGROUND LAYER: Core Typography & Value Proposition */
          midgroundContent={
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-4xl space-y-8">
                {/* Architectural Badge */}
                <Reveal direction="down" distance={15} duration={0.8}>
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-black-elevated/90 border border-white/15 text-xs font-mono tracking-widest text-brand-sand-300 uppercase shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                    <span>{t("hero.badge")}</span>
                  </div>
                </Reveal>

                {/* Primary Headline with Text-Split Mask Animation */}
                <div className="space-y-1">
                  <TextSplitReveal
                    text={t("hero.titleLine1")}
                    as="h1"
                    className="block font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-brand-white uppercase leading-[0.95]"
                    wordClassName="font-light"
                    duration={1.1}
                  />
                  <TextSplitReveal
                    text={t("hero.titleLine2")}
                    as="h1"
                    className="block font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-brand-white uppercase leading-[0.95]"
                    wordClassName="font-normal italic text-brand-sand-200"
                    delay={0.15}
                    duration={1.1}
                  />
                </div>

                {/* Body Description */}
                <Reveal direction="up" distance={25} delay={0.3} duration={0.9}>
                  <p className="text-base sm:text-lg md:text-xl font-sans text-brand-sand-300 max-w-2xl font-light leading-relaxed">
                    {t("hero.description")}
                  </p>
                </Reveal>

                {/* Action CTAs */}
                <Reveal direction="up" distance={20} delay={0.45} duration={0.9}>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="#collections"
                      className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-sm bg-brand-white hover:bg-brand-orange text-brand-black hover:text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl"
                    >
                      <span>{t("hero.ctaPrimary")}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm bg-transparent hover:bg-white/5 text-brand-sand-200 border border-white/20 hover:border-white/40 font-mono text-xs uppercase tracking-widest transition-all duration-300"
                    >
                      <span>{t("hero.ctaSecondary")}</span>
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          }
          /* FOREGROUND LAYER: Floating Material Spec Badges */
          foregroundContent={
            <div className="container mx-auto px-4 md:px-8 h-full relative pointer-events-none hidden lg:block">
              <div className="absolute right-12 top-1/4 p-4 rounded-sm glass-panel border border-brand-orange/30 shadow-2xl max-w-xs space-y-1.5 animate-pulseGlow">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-brand-orange uppercase">
                  <span>SPECIFICATION 01</span>
                  <span>48V DC</span>
                </div>
                <div className="text-sm font-display text-brand-white uppercase tracking-wider">
                  Recessed Magnetic Flute
                </div>
                <div className="text-[11px] font-sans text-brand-sand-400">
                  Zero-glare microprism profile embedded into acoustic gypsum boards.
                </div>
              </div>

              <div className="absolute right-36 bottom-8 p-3 rounded-sm glass-panel border border-brand-green/40 shadow-2xl space-y-1">
                <div className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase">
                  FINISH 02 • WHITE OAK
                </div>
                <div className="text-xs font-display text-brand-white uppercase tracking-wide">
                  Calibrated Acoustic Slat
                </div>
              </div>
            </div>
          }
        />

        {/* Scroll Indicator Prompt */}
        <div className="container mx-auto px-4 md:px-8 mt-12 flex items-center justify-between text-xs font-mono tracking-widest text-brand-sand-400 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1px] bg-brand-orange" />
            <span>MRD • NAIROBI ARCHITECTURAL ATELIER</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{t("hero.scrollPrompt")}</span>
            <ArrowDown className="w-3.5 h-3.5 text-brand-orange animate-bounce" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: STATISTICAL ACCURACY & REPUTATION COUNTERS
      ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-white/10 bg-brand-black-elevated/40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Stat 1 */}
            <Reveal direction="up" delay={0.1} className="p-6 rounded-sm bg-brand-black border border-white/10 relative overflow-hidden group hover:border-brand-orange/40 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-white mb-2">
                <AnimatedCounter value={380} suffix="+" duration={2.2} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-sand-300">
                {t("stats.stat1Label")}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Reveal>

            {/* Stat 2 */}
            <Reveal direction="up" delay={0.2} className="p-6 rounded-sm bg-brand-black border border-white/10 relative overflow-hidden group hover:border-brand-green/40 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-white mb-2">
                <AnimatedCounter value={14} suffix=" YRS" duration={2.0} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-sand-300">
                {t("stats.stat2Label")}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Reveal>

            {/* Stat 3 */}
            <Reveal direction="up" delay={0.3} className="p-6 rounded-sm bg-brand-black border border-white/10 relative overflow-hidden group hover:border-brand-orange/40 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-white mb-2">
                <AnimatedCounter value={99.4} decimals={1} suffix="%" duration={2.4} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-sand-300">
                {t("stats.stat3Label")}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Reveal>

            {/* Stat 4 */}
            <Reveal direction="up" delay={0.4} className="p-6 rounded-sm bg-brand-black border border-white/10 relative overflow-hidden group hover:border-brand-green/40 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-brand-white mb-2">
                <AnimatedCounter value={48} suffix=" HRS" duration={1.8} />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-brand-sand-300">
                {t("stats.stat4Label")}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PINNED SCENE & SCRUBBED TIMELINE NARRATIVE
      ========================================================================= */}
      <section id="studio" className="relative py-24 border-b border-white/10 bg-brand-black">
        <PinnedScene pinDuration="+=120%" className="min-h-[85vh] flex items-center">
          <div className="container mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Sticky Narrative Anchor */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-orange">
                  <Layers className="w-3.5 h-3.5" />
                  <span>The MarvelRise Methodology</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light uppercase text-brand-white leading-tight">
                  Engineered Down To The <span className="italic text-brand-sand-200">Millimeter</span>
                </h2>

                <p className="text-sm font-sans text-brand-sand-400 leading-relaxed max-w-md">
                  We don't merely install ceilings; we sculpt acoustics, diffuse architectural light, and frame volume to elevate human emotion.
                </p>

                <div className="pt-4 flex items-center gap-6 text-xs font-mono text-brand-sand-300 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-brand-orange" /> Laser Leveled
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" /> Acoustic Grade
                  </span>
                </div>
              </div>

              {/* Right Column: Scrubbed Sequence Progression */}
              <div className="lg:col-span-7">
                <ScrubbedTimeline className="space-y-4">
                  <div className="scrub-item p-6 rounded-sm bg-brand-black-elevated border border-white/10 hover:border-brand-orange/40 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono tracking-widest text-brand-orange uppercase">Phase 01</span>
                      <span className="text-[11px] font-mono text-brand-sand-400">3D Laser Scan</span>
                    </div>
                    <h3 className="font-display text-xl text-brand-white uppercase mb-1">Volumetric Survey & Acoustic Simulation</h3>
                    <p className="text-xs font-sans text-brand-sand-400">
                      Sub-millimeter LiDAR room mapping to identify resonance nodes and mechanical clash points prior to fabrication.
                    </p>
                  </div>

                  <div className="scrub-item p-6 rounded-sm bg-brand-black-elevated border border-white/10 hover:border-brand-green/40 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono tracking-widest text-brand-green uppercase">Phase 02</span>
                      <span className="text-[11px] font-mono text-brand-sand-400">Heavy Gauge Steel</span>
                    </div>
                    <h3 className="font-display text-xl text-brand-white uppercase mb-1">Heavy-Duty Rigid Subgrid Suspension</h3>
                    <p className="text-xs font-sans text-brand-sand-400">
                      Zinc-galvanized framing engineered to resist structural deflection across wide spans with zero sagging over decades.
                    </p>
                  </div>

                  <div className="scrub-item p-6 rounded-sm bg-brand-black-elevated border border-white/10 hover:border-brand-orange/40 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono tracking-widest text-brand-orange uppercase">Phase 03</span>
                      <span className="text-[11px] font-mono text-brand-sand-400">Seamless Finish</span>
                    </div>
                    <h3 className="font-display text-xl text-brand-white uppercase mb-1">Bespoke Gypsum Jointing & Shadowline Reglets</h3>
                    <p className="text-xs font-sans text-brand-sand-400">
                      Paper-taped seamless joints finished to Level 5 paint readiness with concealed perimeter architectural negative reveals.
                    </p>
                  </div>
                </ScrubbedTimeline>
              </div>
            </div>
          </div>
        </PinnedScene>
      </section>

      {/* =========================================================================
          SECTION 4: HORIZONTAL SCROLL ARCHITECTURAL FINISHES & SYSTEMS
      ========================================================================= */}
      <section id="collections" className="relative py-20 border-b border-white/10 bg-brand-black">
        <div className="container mx-auto px-4 md:px-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-orange mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>{t("showcase.horizontalTitle")}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light uppercase text-brand-white">
                {t("showcase.title")}
              </h2>
            </div>
            <p className="text-xs font-mono text-brand-sand-400 uppercase tracking-widest">
              {t("showcase.horizontalSubtitle")} →
            </p>
          </div>
        </div>

        {/* Pinned Horizontal Track */}
        <HorizontalScroll className="gap-8">
          {/* Card 1 */}
          <div className="w-[340px] sm:w-[420px] shrink-0 p-6 rounded-sm bg-brand-black-elevated border border-white/10 group hover:border-brand-orange/50 transition-all duration-300">
            <div className="h-60 mb-6 rounded-xs overflow-hidden relative">
              <ImageMaskReveal direction="left-to-right" curtainColor="#0F4C3A" className="h-full">
                <div className="w-full h-full bg-gradient-to-br from-brand-black-border via-brand-black to-brand-green/30 flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-brand-orange uppercase">SYSTEM 01</span>
                    <h4 className="font-display text-2xl text-brand-white uppercase">{t("cards.item1Title")}</h4>
                  </div>
                </div>
              </ImageMaskReveal>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-brand-sand-400 uppercase block mb-1">
              {t("cards.item1Category")}
            </span>
            <h3 className="font-display text-xl text-brand-white uppercase mb-2">
              {t("cards.item1Title")}
            </h3>
            <p className="text-xs font-sans text-brand-sand-400 leading-relaxed">
              {t("cards.item1Desc")}
            </p>
          </div>

          {/* Card 2 */}
          <div className="w-[340px] sm:w-[420px] shrink-0 p-6 rounded-sm bg-brand-black-elevated border border-white/10 group hover:border-brand-green/50 transition-all duration-300">
            <div className="h-60 mb-6 rounded-xs overflow-hidden relative">
              <ImageMaskReveal direction="bottom-to-top" curtainColor="#F25C05" className="h-full">
                <div className="w-full h-full bg-gradient-to-br from-brand-black-border via-brand-black to-brand-orange/25 flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">SYSTEM 02</span>
                    <h4 className="font-display text-2xl text-brand-white uppercase">{t("cards.item2Title")}</h4>
                  </div>
                </div>
              </ImageMaskReveal>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-brand-sand-400 uppercase block mb-1">
              {t("cards.item2Category")}
            </span>
            <h3 className="font-display text-xl text-brand-white uppercase mb-2">
              {t("cards.item2Title")}
            </h3>
            <p className="text-xs font-sans text-brand-sand-400 leading-relaxed">
              {t("cards.item2Desc")}
            </p>
          </div>

          {/* Card 3 */}
          <div className="w-[340px] sm:w-[420px] shrink-0 p-6 rounded-sm bg-brand-black-elevated border border-white/10 group hover:border-brand-orange/50 transition-all duration-300">
            <div className="h-60 mb-6 rounded-xs overflow-hidden relative">
              <ImageMaskReveal direction="left-to-right" curtainColor="#0A0B0D" className="h-full">
                <div className="w-full h-full bg-gradient-to-br from-brand-black-border via-brand-black to-brand-green/20 flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-brand-orange uppercase">SYSTEM 03</span>
                    <h4 className="font-display text-2xl text-brand-white uppercase">{t("cards.item3Title")}</h4>
                  </div>
                </div>
              </ImageMaskReveal>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-brand-sand-400 uppercase block mb-1">
              {t("cards.item3Category")}
            </span>
            <h3 className="font-display text-xl text-brand-white uppercase mb-2">
              {t("cards.item3Title")}
            </h3>
            <p className="text-xs font-sans text-brand-sand-400 leading-relaxed">
              {t("cards.item3Desc")}
            </p>
          </div>

          {/* Card 4 */}
          <div className="w-[340px] sm:w-[420px] shrink-0 p-6 rounded-sm bg-brand-black-elevated border border-white/10 group hover:border-brand-green/50 transition-all duration-300">
            <div className="h-60 mb-6 rounded-xs overflow-hidden relative">
              <ImageMaskReveal direction="center-expand" curtainColor="#0F4C3A" className="h-full">
                <div className="w-full h-full bg-gradient-to-br from-brand-black-border via-brand-black to-brand-orange/20 flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">SYSTEM 04</span>
                    <h4 className="font-display text-2xl text-brand-white uppercase">{t("cards.item4Title")}</h4>
                  </div>
                </div>
              </ImageMaskReveal>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-brand-sand-400 uppercase block mb-1">
              {t("cards.item4Category")}
            </span>
            <h3 className="font-display text-xl text-brand-white uppercase mb-2">
              {t("cards.item4Title")}
            </h3>
            <p className="text-xs font-sans text-brand-sand-400 leading-relaxed">
              {t("cards.item4Desc")}
            </p>
          </div>
        </HorizontalScroll>
      </section>

      {/* =========================================================================
          SECTION 5: BESPOKE FABRICATION & INQUIRY INVITATION
      ========================================================================= */}
      <section id="custom" className="py-24 border-b border-white/10 relative overflow-hidden bg-brand-black-elevated/60">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Reveal direction="up" distance={20}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-xs font-mono uppercase tracking-widest text-brand-orange">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nairobi Atelier & Showroom</span>
              </div>
            </Reveal>

            <Reveal direction="up" distance={25} delay={0.15}>
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase text-brand-white font-light">
                Ready to elevate your next <span className="italic text-brand-orange">architectural space</span>?
              </h2>
            </Reveal>

            <Reveal direction="up" distance={20} delay={0.3}>
              <p className="text-sm sm:text-base font-sans text-brand-sand-300 max-w-xl mx-auto leading-relaxed">
                Connect directly with our master craftsmen on Enterprise Road or request a site visit anywhere across Nairobi and East Africa.
              </p>
            </Reveal>

            <Reveal direction="up" distance={15} delay={0.4}>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#contact"
                  className="px-8 py-3.5 rounded-sm bg-brand-orange hover:bg-brand-orange-hover text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl shadow-brand-orange/20"
                >
                  Schedule Showroom Consultation
                </a>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent(t("whatsapp.prefill"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-sm bg-brand-black-elevated hover:bg-brand-green text-brand-white border border-white/15 hover:border-brand-green font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300"
                >
                  Instant WhatsApp Desk
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
