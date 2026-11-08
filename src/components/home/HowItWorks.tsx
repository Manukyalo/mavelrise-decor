"use client";

import React from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Ruler, Palette, FileSpreadsheet, ArrowRight, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      action: "MEASURE",
      title: "Volumetric Survey & LiDAR Scan",
      desc: "Our technical team or your project architect takes laser measurements of your floor area, ceiling drops, and acoustic reflections across your property.",
      icon: Ruler,
      tag: "Free Nairobi Site Visit",
    },
    {
      num: "02",
      action: "PICK",
      title: "Select Finishes & Curated Swatches",
      desc: "Visit our Westlands design hub or Enterprise Road atelier to handle real French Oak textures, fluted timber profiles, and monolithic marble samples.",
      icon: Palette,
      tag: "Physical Material Library",
    },
    {
      num: "03",
      action: "GET YOUR QUOTE",
      title: "Itemized Quote & Rapid Installation",
      desc: "Receive a transparent, fixed-price bill of quantities within 48 hours, followed by rapid scheduling with our certified installation crew.",
      icon: FileSpreadsheet,
      tag: "48-Hour Handover Commitment",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-brand-black-elevated text-brand-sand-50 border-b border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-orange">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <span>Streamlined Three-Phase Execution</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl uppercase font-light text-brand-white leading-tight">
              From Raw Space to <span className="italic text-brand-orange">Finished Masterpiece</span>
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-sand-400">
            No Surprises • Zero Delays
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, idx) => (
            <Reveal
              key={st.num}
              direction="up"
              distance={25}
              delay={idx * 0.12}
              className="h-full"
            >
              <div className="p-8 rounded-sm bg-brand-black border border-white/10 hover:border-brand-orange/40 flex flex-col justify-between h-full transition-all duration-300 relative group">
                <div className="space-y-6">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl text-brand-orange/60 group-hover:text-brand-orange transition-colors">
                      {st.num}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-brand-sand-400 bg-white/5 px-2.5 py-1 rounded-full uppercase">
                      {st.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono tracking-widest text-brand-sand-400 uppercase block">
                      STEP {st.num} • {st.action}
                    </span>
                    <h3 className="font-display text-2xl uppercase text-brand-white">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-brand-sand-400 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-brand-sand-300">
                  <span className="uppercase text-[11px]">Proceed to Step {idx < 2 ? `0${idx + 2}` : "Handover"}</span>
                  <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
