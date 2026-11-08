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
      color: "text-brand-orange",
      borderHover: "hover:border-brand-orange/50",
    },
    {
      num: "02",
      title: "100% Water & Termite Immunity",
      desc: "Our stone-polymer composite flooring and UV marble sheets are completely impermeable to moisture, flooding, and tropical pests.",
      icon: Droplets,
      color: "text-cyan-400",
      borderHover: "hover:border-cyan-400/50",
    },
    {
      num: "03",
      title: "Acoustic Decibel Suppression",
      desc: "Integrated PET felt backings and high-density IXPE acoustic cushions absorb up to NRC 0.85, eliminating hollow flutter echo in large halls.",
      icon: Volume2,
      color: "text-emerald-400",
      borderHover: "hover:border-emerald-400/50",
    },
    {
      num: "04",
      title: "Nairobi In-House Fabrication Atelier",
      desc: "Direct workshop in Industrial Area and design hub in Westlands. We manufacture and cut custom modules locally with zero shipping delays.",
      icon: Building2,
      color: "text-brand-orange",
      borderHover: "hover:border-brand-orange/50",
    },
    {
      num: "05",
      title: "Dedicated Lead Finisher Supervision",
      desc: "Every residence or boardroom project is assigned a dedicated senior architectural finishes supervisor to oversee daily installation tolerances and milestone sign-offs.",
      icon: Clock,
      color: "text-amber-400",
      borderHover: "hover:border-amber-400/50",
    },
    {
      num: "06",
      title: "Lifetime Structural Guarantee",
      desc: "Backed by NCA-certified architectural finishers. We warranty all subgrid framing and click-lock joinery against sagging or buckling.",
      icon: ShieldCheck,
      color: "text-emerald-400",
      borderHover: "hover:border-emerald-400/50",
    },
  ];

  return (
    <section className="py-24 bg-brand-black text-brand-sand-50 border-b border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-orange">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The MarvelRise Brochure Standard</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl uppercase font-light text-brand-white leading-tight">
            Six Benchmarks of <span className="italic text-brand-orange">Master Finishing</span>
          </h2>
          <p className="text-xs sm:text-sm font-sans text-brand-sand-300 max-w-xl leading-relaxed">
            Why Nairobi's premier developers, interior architects, and luxury homeowners commission MarvelRise Decor over standard contractors.
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
                className={`p-6 sm:p-8 rounded-sm bg-brand-black-elevated border border-white/10 flex flex-col justify-between h-full transition-all duration-300 ${pt.borderHover} group relative overflow-hidden`}
              >
                {/* Background Number Watermark */}
                <span className="absolute -right-2 -bottom-2 text-6xl font-display font-light text-white/[0.03] select-none group-hover:text-brand-orange/[0.08] transition-colors pointer-events-none">
                  {pt.num}
                </span>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xs bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                      <pt.icon className={`w-5 h-5 ${pt.color}`} />
                    </div>
                    <span className="text-xs font-mono text-brand-sand-400">
                      POINT {pt.num}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl uppercase text-brand-white group-hover:text-brand-orange transition-colors">
                    {pt.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-sans text-brand-sand-400 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-brand-sand-400">
                  <span>ATELIER BENCHMARK</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-sand-500 group-hover:text-brand-orange transition-colors" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

