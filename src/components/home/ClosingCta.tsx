"use client";

import React, { useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight, Sparkles, CheckCircle2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

export function ClosingCta() {
  const [spaceType, setSpaceType] = useState("Living Room Sanctuary");
  const [system, setSystem] = useState("Full Spatial Suite (Flooring + Walls + Ceilings)");
  const [area, setArea] = useState("35 – 70 m²");

  const spaces = [
    "Living Room Sanctuary",
    "Master Penthouse Suite",
    "Executive Boardroom",
    "Boutique Hospitality Lounge",
  ];

  const systems = [
    "Full Spatial Suite (Flooring + Walls + Ceilings)",
    "SPC Click-Lock Acoustic Flooring",
    "Fluted Timber & Marble Wall Panels",
    "Sculpted Gypsum Ceiling & Lighting",
  ];

  const areas = ["Under 35 m²", "35 – 70 m²", "70 – 150 m²", "Over 150 m²"];

  const prefill = `Hello MarvelRise Decor Atelier, I would like to design my room:
- Space: ${spaceType}
- Selected System: ${system}
- Estimated Area: ${area}
Please advise on sample swatches and provide an initial architectural estimate.`;

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent(prefill)}`;

  return (
    <section id="room-planner" className="py-24 bg-brand-navy-deep text-brand-ivory relative overflow-hidden">
      {/* Background radial warmth in Champagne Gold */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-brand-gold/15 blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl space-y-12">
        {/* Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Room Planner</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl uppercase font-light text-brand-ivory leading-tight">
            Design Your <span className="italic text-brand-gold">Architectural Room</span>
          </h2>

          <p className="text-xs sm:text-base font-sans text-brand-ivory/70 max-w-xl mx-auto leading-relaxed">
            Select your spatial parameters below to immediately dispatch your specification to our senior finishes team in Nairobi.
          </p>
        </div>

        {/* Interactive Configurator Card */}
        <div className="p-6 sm:p-10 rounded-sm bg-brand-navy-card border border-brand-gold/30 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Top Gold Rule */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

          {/* Selector 1: Space Type */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-brand-gold block font-bold">
              1. Select Spatial Environment
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {spaces.map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setSpaceType(sp)}
                  className={cn(
                    "p-3 rounded-xs text-left text-xs font-mono uppercase transition-all duration-200 border",
                    spaceType === sp
                      ? "border-brand-gold bg-brand-gold/20 text-brand-ivory font-bold shadow-md"
                      : "border-brand-gold/20 bg-brand-navy text-brand-ivory/70 hover:border-brand-gold/40 hover:text-brand-ivory"
                  )}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Selector 2: Systems Package */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-brand-gold block font-bold">
              2. Select Architectural Systems Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {systems.map((sys) => (
                <button
                  key={sys}
                  type="button"
                  onClick={() => setSystem(sys)}
                  className={cn(
                    "p-3.5 rounded-xs text-left text-xs font-mono uppercase transition-all duration-200 border",
                    system === sys
                      ? "border-brand-gold bg-brand-gold/20 text-brand-ivory font-bold shadow-md"
                      : "border-brand-gold/20 bg-brand-navy text-brand-ivory/70 hover:border-brand-gold/40 hover:text-brand-ivory"
                  )}
                >
                  {sys}
                </button>
              ))}
            </div>
          </div>

          {/* Selector 3: Estimated Area */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-widest text-brand-gold block font-bold">
              3. Approximate Floor / Surface Area
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {areas.map((ar) => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => setArea(ar)}
                  className={cn(
                    "p-3 rounded-xs text-center text-xs font-mono uppercase transition-all duration-200 border",
                    area === ar
                      ? "border-brand-gold bg-brand-gold/20 text-brand-ivory font-bold shadow-md"
                      : "border-brand-gold/20 bg-brand-navy text-brand-ivory/70 hover:border-brand-gold/40 hover:text-brand-ivory"
                  )}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-brand-gold/15 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono text-brand-gold uppercase tracking-wider block font-bold">
                Instant Dispatch to Senior Estimator
              </span>
              <p className="text-xs font-sans text-brand-ivory/70">
                Turnaround: Under 48 hours with itemized 3D bill of quantities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/planner"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-sm bg-brand-navy-card hover:bg-brand-navy-light text-brand-ivory border border-brand-gold/30 hover:border-brand-gold text-xs font-mono uppercase tracking-widest transition-all duration-300"
              >
                <span>Launch 3D House Planner</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-brand-gold" />
              </Link>

              <MagneticButton strength={0.4}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 shadow-xl shadow-brand-gold/25"
                >
                  <MessageSquare className="w-4 h-4 text-brand-navy" />
                  <span>Transmit via WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
