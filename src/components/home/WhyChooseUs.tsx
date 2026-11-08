"use client";

import React from "react";
import { Reveal } from "@/components/motion/Reveal";
import {
  Ruler,
  Droplets,
  Volume2,
  Building2,
  Clock,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export function WhyChooseUs() {
  const points = [
    {
      num: "01",
      title: "Sub-Millimeter Laser Precision",
      desc: "Our installations are calibrated using cross-line 3D laser levels to maintain tight ±0.5mm joint tolerances with zero visible seams.",
      icon: Ruler,
    },
    {
      num: "02",
      title: "100% Water & Termite Immunity",
      desc: "Our stone-polymer composite flooring and UV marble sheets are completely impermeable to moisture, flooding, and tropical pests.",
      icon: Droplets,
    },
    {
      num: "03",
      title: "Acoustic Decibel Suppression",
      desc: "Integrated PET felt backings and high-density IXPE acoustic cushions absorb up to NRC 0.85, eliminating hollow flutter echo in large halls.",
      icon: Volume2,
    },
    {
      num: "04",
      title: "Nairobi In-House Fabrication Atelier",
      desc: "Direct workshop in Industrial Area and design hub in Westlands. We manufacture and cut custom modules locally with zero shipping delays.",
      icon: Building2,
    },
    {
      num: "05",
      title: "Dedicated Lead Finisher Supervision",
      desc: "Every residence or boardroom project is assigned a dedicated senior architectural finishes supervisor to oversee daily installation tolerances and milestone sign-offs.",
      icon: Clock,
    },
    {
      num: "06",
      title: "Lifetime Structural Guarantee",
      desc: "Backed by NCA-certified architectural finishers. We warranty all subgrid framing and click-lock joinery against sagging or buckling.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-24 bg-brand-navy-deep text-brand-ivory border-b border-brand-gold/15 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The MarvelRise Brochure Standard</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl uppercase font-light text-brand-ivory leading-tight">
            Six Benchmarks of <span className="italic text-brand-gold">Master Finishing</span>
          </h2>
          <p className="text-xs sm:text-sm font-sans text-brand-ivory/70 max-w-xl leading-relaxed">
            Why Nairobi&apos;s premier developers, interior architects, and luxury homeowners commission MarvelRise Decor over standard contractors.
          </p>
        </div>

        {/* 6-Point Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, idx) => (
            <Reveal
              key={pt.num}
              direction="up"
              distance={25}
              delay={idx * 0.08}
              className="h-full"
            >
              <div
                className="p-6 sm:p-8 rounded-sm bg-brand-navy-card border border-brand-gold/20 hover:border-brand-gold/60 flex flex-col justify-between h-full transition-all duration-300 group relative overflow-hidden shadow-xl"
              >
                {/* Background Number Watermark */}
                <span className="absolute -right-2 -bottom-2 text-6xl font-display font-light text-brand-gold/[0.04] select-none group-hover:text-brand-gold/[0.12] transition-colors pointer-events-none">
                  {pt.num}
                </span>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xs bg-brand-navy border border-brand-gold/25 group-hover:border-brand-gold/50 transition-colors">
                      <pt.icon className="w-5 h-5 text-brand-gold" />
                    </div>
                    <span className="text-xs font-mono text-brand-gold font-bold">
                      BENCHMARK {pt.num}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl uppercase text-brand-ivory group-hover:text-brand-gold transition-colors">
                    {pt.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-sans text-brand-ivory/70 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-brand-gold/15 flex items-center justify-between text-[11px] font-mono text-brand-gold/70 group-hover:text-brand-gold">
                  <span>ATELIER SPECIFICATION</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
