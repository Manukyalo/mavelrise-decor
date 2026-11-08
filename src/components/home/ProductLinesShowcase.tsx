"use client";

import React, { useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowUpRight, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductLinesShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const productLines = [
    {
      id: "spc",
      number: "01",
      category: "Flooring Architecture",
      title: "SPC Click-Lock Flooring",
      subtitle: "Impervious to water, scratches, and East African humidity.",
      specs: [
        "4.5mm Rigid Limestone Core + 1.5mm Acoustic IXPE Pad",
        "0.55mm Commercial Ceramic-Polyurethane Wear Barrier",
        "Patented Unilin Click-Lock Glueless Mechanical Seal",
        "100% Termite Immune • Zero Water Swelling",
      ],
      textures: ["Natural French Oak", "Smoked Walnut", "Nordic Ash", "Charcoal Noir"],
      bgGradient: "from-[#2B1E16] via-[#1B140E] to-[#0A0B0D]",
      accentColor: "#F25C05",
      badgeColor: "border-brand-orange/40 text-brand-orange",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-gradient-to-br from-[#4A3222] via-[#2F1F14] to-[#160E08] p-6 flex flex-col justify-between border border-amber-900/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-noise opacity-30" />
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono tracking-widest text-brand-orange uppercase">
              PLANK DIMENSIONS: 1220 × 180 × 6.0 MM
            </span>
            <span className="text-xs font-mono text-brand-sand-300">EIR FINISH</span>
          </div>
          <div className="space-y-1 z-10">
            <div className="font-display text-2xl text-brand-white uppercase">
              French Oak Herringbone
            </div>
            <div className="text-xs text-brand-sand-400 font-sans">
              Tactile grain indentation synchronized to optical wood knots.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slats",
      number: "02",
      category: "Wall Acoustics & Joinery",
      title: "Acoustic Fluted Slat Panels",
      subtitle: "Calibrated timber battens engineered for boardroom & lounge silence.",
      specs: [
        "NRC 0.85 Sound Absorption Index",
        "Real Timber Veneer on Recycled PET Acoustic Felt",
        "2400 × 600mm Monolithic Vertical Slat Modules",
        "Eliminates Room Flutter Echo & Harsh Reverberation",
      ],
      textures: ["American Walnut", "White Oak", "Smoked Ebony", "Teak"],
      bgGradient: "from-[#19241E] via-[#0E1713] to-[#0A0B0D]",
      accentColor: "#0F4C3A",
      badgeColor: "border-brand-green/40 text-emerald-400",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-black/80 p-6 flex flex-col justify-between border border-emerald-900/40 relative overflow-hidden">
          <div className="flex h-full gap-2 py-4">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-xs bg-gradient-to-r from-[#4E3725] via-[#6B4E35] to-[#3A291B] shadow-lg"
              />
            ))}
          </div>
          <div className="flex justify-between items-end z-10 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono text-emerald-400 uppercase">
              NRC 0.85 ACOUSTIC RATING
            </span>
            <span className="text-xs font-display text-white uppercase">
              Slats: 27mm × 12mm
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "marble",
      number: "03",
      category: "Feature Wall Surfaces",
      title: "UV Marble Architectural Sheets",
      subtitle: "Monolithic high-gloss stone slabs without the weight or cost of quarry marble.",
      specs: [
        "2800 × 1220 × 3.0mm Continuous Monolithic Sheet",
        "Mirror-Gloss UV Cured Topcoat (Scratch & Solvent Resistant)",
        "Class A Flame Spread Safety Rating",
        "Seamless Book-Matched Veining Configurations",
      ],
      textures: ["Calacatta Gold", "Nero Marquina", "Panda White", "Emerald Jade"],
      bgGradient: "from-[#222129] via-[#14141A] to-[#0A0B0D]",
      accentColor: "#F25C05",
      badgeColor: "border-white/30 text-brand-sand-200",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-gradient-to-br from-[#1E2026] via-[#111317] to-[#0A0B0D] p-6 flex flex-col justify-between border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent pointer-events-none" />
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono tracking-widest text-brand-sand-300 uppercase">
              CALACATTA GOLD • MONOLITH
            </span>
            <span className="text-xs font-mono text-amber-300">MIRROR UV</span>
          </div>
          <div className="space-y-1 z-10">
            <div className="font-display text-2xl text-brand-white uppercase">
              Seamless Book-Matched Veins
            </div>
            <div className="text-xs text-brand-sand-400 font-sans">
              Zero grout lines for TV feature walls and executive reception lobbies.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ceilings",
      number: "04",
      category: "Ceiling Sculpting",
      title: "Gypsum Ceilings & Cornices",
      subtitle: "Multi-tier floating bulkheads, concealed LED troffers, and shadowline reglets.",
      specs: [
        "Level 5 Plasterboard Finish Ready for Architectural Spec",
        "Concealed Negative Perimeter Shadowlines (15mm Reveal)",
        "Rigid Hot-Dipped Galvanized Steel Subgrid Framing",
        "Hand-Cast Contemporary & Neoclassical Cornices",
      ],
      textures: ["Floating Bulkheads", "Perimeter Coves", "Vaulted Steppes", "Shadowline Reglets"],
      bgGradient: "from-[#17211E] via-[#0E1513] to-[#0A0B0D]",
      accentColor: "#0F4C3A",
      badgeColor: "border-brand-green/40 text-emerald-400",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-gradient-to-br from-[#1E2322] via-[#121615] to-[#080B0A] p-6 flex flex-col justify-between border border-emerald-900/40 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              SUBGRID TOLERANCE: ±0.5MM
            </span>
            <span className="text-xs font-mono text-brand-sand-300">LEVEL 5 FINISH</span>
          </div>
          <div className="space-y-1 z-10">
            <div className="font-display text-2xl text-brand-white uppercase">
              Multi-Tier Floating Rafts
            </div>
            <div className="text-xs text-brand-sand-400 font-sans">
              Concealed architectural lighting channels with zero visible fasteners.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "lighting",
      number: "05",
      category: "Illumination Systems",
      title: "Architectural Lighting & Lampshades",
      subtitle: "Concealed 48V magnetic tracks, sculptural brass pendants, and warm coves.",
      specs: [
        "48V Low-Voltage Safe Magnetic Track Integration",
        "CRI 95+ High-Fidelity Color Rendering LEDs",
        "3000K Warm Diurnal Dimming Calibration",
        "Custom Hand-Spun Brushed Brass & Matte Black Lampshades",
      ],
      textures: ["Magnetic Track Troffers", "Brushed Brass Pendants", "Microprism Diffusers", "Linear Wall Washers"],
      bgGradient: "from-[#2A1E11] via-[#1B140B] to-[#0A0B0D]",
      accentColor: "#F25C05",
      badgeColor: "border-brand-orange/40 text-brand-orange",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-gradient-to-br from-[#382613] via-[#20160B] to-[#0A0B0D] p-6 flex flex-col justify-between border border-amber-900/40 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono tracking-widest text-brand-orange uppercase">
              LOW-VOLTAGE 48V DC • CRI 97
            </span>
            <span className="text-xs font-mono text-amber-200">WARM AMBER</span>
          </div>
          <div className="space-y-1 z-10">
            <div className="font-display text-2xl text-brand-white uppercase">
              Sculptural Pendant & Cove
            </div>
            <div className="text-xs text-brand-sand-400 font-sans">
              Flicker-free micro-prism optics with custom brass shade housings.
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentProduct = productLines[activeTab];

  return (
    <section id="product-lines" className="py-24 bg-brand-black text-brand-sand-50 border-b border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-orange">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proprietary Architectural Systems</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl uppercase font-light text-brand-white leading-tight">
              The Five Disciplines of <span className="italic text-brand-orange">MarvelRise</span>
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-sand-400">
            Select A Discipline To Inspect Anatomy →
          </p>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b border-white/10 pb-4">
          {productLines.map((prod, idx) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={cn(
                "p-3 rounded-xs text-left transition-all duration-300 relative group border",
                activeTab === idx
                  ? "border-brand-orange/60 bg-brand-black-elevated shadow-lg"
                  : "border-transparent hover:border-white/15 hover:bg-white/5"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-brand-sand-400 group-hover:text-brand-orange">
                  0{idx + 1}
                </span>
                {activeTab === idx && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                )}
              </div>
              <div className="text-xs font-display uppercase tracking-wider text-brand-white truncate">
                {prod.title.split(" ")[0]} {prod.title.split(" ")[1] || ""}
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Product Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-sm bg-brand-black-elevated border border-white/15 shadow-2xl relative overflow-hidden transition-all duration-500">
          {/* Left Column: Specifications & Copy (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-orange block">
                DISCIPLINE {currentProduct.number} • {currentProduct.category}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl uppercase text-brand-white">
                {currentProduct.title}
              </h3>
              <p className="text-sm font-sans text-brand-sand-300 leading-relaxed max-w-lg">
                {currentProduct.subtitle}
              </p>
            </div>

            {/* Technical Parameters List */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-brand-sand-400">
                Architectural Performance Specs
              </h4>
              <ul className="space-y-2">
                {currentProduct.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs font-sans text-brand-sand-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Available Curated Palettes */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-brand-sand-400 block">
                Curated Finishes
              </span>
              <div className="flex flex-wrap gap-2">
                {currentProduct.textures.map((tex, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xs bg-white/5 border border-white/10 text-[11px] font-mono text-brand-sand-200"
                  >
                    {tex}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-mono uppercase tracking-widest font-semibold transition-all shadow-lg"
              >
                <span>Request Sample Swatch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent(`Hello MarvelRise Decor, I would like technical details and pricing on ${currentProduct.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-wider text-brand-sand-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Consult Lead Finisher</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Layered Texture Mockup (6 cols) */}
          <div className="lg:col-span-6 h-[340px] sm:h-[420px] rounded-sm overflow-hidden">
            {currentProduct.heroTextureMock}
          </div>
        </div>
      </div>
    </section>
  );
}
