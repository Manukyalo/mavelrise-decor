"use client";

import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, ChevronRight, Sparkles, Layers, Shield, Droplets, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductLinesShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeLayerIndex, setActiveLayerIndex] = useState(2); // SPC layer inspection
  const [selectedSwatch, setSelectedSwatch] = useState(0);

  const spcLayers = [
    {
      id: "wear",
      title: "UV Ceramic Wear Barrier",
      thickness: "0.55mm Commercial Grade",
      desc: "Double-cured polyurethane infused with ceramic beads. Resists pet claws, high heels, and heavy foot traffic without dulling.",
      icon: Shield,
      tag: "LAYER 01 • 0.55 MM",
      borderColor: "border-brand-gold",
      activeBg: "bg-brand-navy-light shadow-brand-gold/30 ring-2 ring-brand-gold border-brand-gold",
      inactiveBg: "bg-brand-navy/60 border-brand-gold/25",
    },
    {
      id: "film",
      title: "Ultra-HD EIR Decorative Film",
      thickness: "French Oak Photographic Print",
      desc: "Embossed-In-Register wood grain synchronized with real tactile knotting and natural matte pigmentation.",
      icon: Sparkles,
      tag: "LAYER 02 • EIR GRAIN",
      borderColor: "border-brand-gold",
      activeBg: "bg-[#4A301D] shadow-brand-gold/30 ring-2 ring-brand-gold border-brand-gold",
      inactiveBg: "bg-[#2E1D13]/70 border-brand-gold/25",
    },
    {
      id: "core",
      title: "Solid Stone Polymer Core",
      thickness: "4.5mm Rigid Limestone Core",
      desc: "70% natural limestone powder fused with virgin PVC. Zero thermal expansion, 100% waterproof, and completely termite-proof.",
      icon: Droplets,
      tag: "LAYER 03 • CORE 4.5 MM",
      borderColor: "border-brand-gold",
      activeBg: "bg-brand-navy-card shadow-brand-gold/40 ring-2 ring-brand-gold border-brand-gold",
      inactiveBg: "bg-brand-navy border-brand-gold/25",
    },
    {
      id: "click",
      title: "Patented Unilin Joint",
      thickness: "Watertight Mechanical Seal",
      desc: "Laser-machined joint profile enabling glueless installation. Resists moisture seepage and locks planks seamlessly together.",
      icon: Layers,
      tag: "LAYER 04 • UNILIN SEAL",
      borderColor: "border-brand-gold",
      activeBg: "bg-brand-navy-light shadow-brand-gold/30 ring-2 ring-brand-gold border-brand-gold",
      inactiveBg: "bg-brand-navy/60 border-brand-gold/25",
    },
    {
      id: "underlay",
      title: "Acoustic IXPE Pad",
      thickness: "1.5mm Integrated Membrane",
      desc: "High-density cross-linked polyethylene pad dampening impact footfall sounds by up to 21dB while correcting minor subfloor variations.",
      icon: VolumeX,
      tag: "LAYER 05 • 1.5 MM MEMBRANE",
      borderColor: "border-brand-gold",
      activeBg: "bg-brand-navy-deep shadow-brand-gold/30 ring-2 ring-brand-gold border-brand-gold",
      inactiveBg: "bg-brand-navy/60 border-brand-gold/25",
    },
  ];

  const currentActiveLayer = spcLayers[activeLayerIndex];

  const productLines = [
    {
      id: "spc",
      number: "01",
      category: "Flooring Architecture",
      title: "SPC Click-Lock Flooring",
      subtitle: "Impervious to water, high traffic, and East African humidity.",
      specs: [
        "4.5mm Rigid Limestone Core + 1.5mm Acoustic IXPE Pad",
        "0.55mm Commercial Ceramic-Polyurethane Wear Barrier",
        "Patented Unilin Click-Lock Glueless Mechanical Seal",
        "100% Termite Immune • Zero Water Swelling",
      ],
      textures: [
        { name: "French Oak", color: "#8E6B47", sub: "Warm Natural" },
        { name: "Smoked Walnut", color: "#4A3222", sub: "Deep Amber" },
        { name: "Nordic Ash", color: "#D1C2A5", sub: "Bleached Grain" },
        { name: "Charcoal Noir", color: "#1D1E24", sub: "Matte Black" },
      ],
      bgGradient: "from-brand-navy via-brand-navy-card to-brand-navy-deep",
      accentColor: "#C8A15A",
      badgeColor: "border-brand-gold/40 text-brand-gold",
      heroTextureMock: (
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-brand-navy-deep/95 border border-brand-gold/30 rounded-sm relative overflow-hidden">
          {/* Top prompt */}
          <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3 z-10">
            <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase flex items-center gap-1.5 font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive 5-Layer Anatomy</span>
            </span>
            <span className="text-[10px] font-mono text-brand-ivory/60">
              Click Layer To Inspect
            </span>
          </div>

          {/* 3D Stratified Layer Stack (Perspective Preserved) */}
          <div className="relative w-full h-44 sm:h-52 my-3 flex items-center justify-center perspective-[1000px]">
            <div
              className="relative w-56 sm:w-72 h-28 sm:h-32 transition-transform duration-300"
              style={{ transformStyle: "preserve-3d" }}
            >
              {spcLayers.map((layer, idx) => {
                const yOffset = (idx - 2) * 26;
                const isSelected = activeLayerIndex === idx;

                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerIndex(idx)}
                    role="button"
                    tabIndex={0}
                    data-cursor-hover
                    className={cn(
                      "absolute inset-0 rounded-xs border-2 flex items-center justify-between px-3 py-1.5 cursor-pointer transition-all duration-300 select-none shadow-lg",
                      isSelected ? layer.activeBg : layer.inactiveBg
                    )}
                    style={{
                      transform: `translateY(${yOffset}px) rotateX(25deg) rotateY(-15deg) scale(${isSelected ? 1.05 : 0.98})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <span className="text-[9px] font-mono uppercase font-bold text-brand-ivory tracking-wider truncate">
                      {layer.tag}
                    </span>
                    <span className="text-[8px] font-mono text-brand-gold uppercase hidden sm:inline">
                      {layer.thickness.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Layer Dynamic Card */}
          <div className="p-3 rounded-xs bg-brand-navy-card/90 border border-brand-gold/25 z-10 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-brand-gold font-bold">
                  {currentActiveLayer.tag}
                </span>
                <span className="text-brand-gold/30">•</span>
                <span className="text-[10px] font-mono text-brand-ivory/80">
                  {currentActiveLayer.thickness}
                </span>
              </div>
              <p className="text-[11px] font-sans text-brand-ivory/70 line-clamp-1">
                {currentActiveLayer.desc}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {spcLayers.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLayerIndex(i)}
                  className={cn(
                    "w-5 h-5 rounded-xs text-[9px] font-mono flex items-center justify-center transition-colors",
                    activeLayerIndex === i
                      ? "bg-brand-gold text-brand-navy font-bold"
                      : "bg-brand-navy border border-brand-gold/20 text-brand-ivory/60 hover:text-brand-ivory"
                  )}
                >
                  {i + 1}
                </button>
              ))}
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
      textures: [
        { name: "American Walnut", color: "#4A3222", sub: "Deep Grain" },
        { name: "White Oak", color: "#C4A47C", sub: "Nordic Clean" },
        { name: "Smoked Ebony", color: "#1F1A17", sub: "Executive Dark" },
        { name: "Golden Teak", color: "#9E6D38", sub: "Warm Honey" },
      ],
      bgGradient: "from-brand-navy via-brand-navy-card to-brand-navy-deep",
      accentColor: "#C8A15A",
      badgeColor: "border-brand-gold/40 text-brand-gold",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-brand-navy-deep/90 p-6 flex flex-col justify-between border border-brand-gold/30 relative overflow-hidden">
          <div className="flex h-full gap-2 py-4">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-xs bg-gradient-to-r from-[#4E3725] via-[#6B4E35] to-[#3A291B] shadow-lg border-r border-black/40"
              />
            ))}
          </div>
          <div className="flex justify-between items-end z-10 pt-2 border-t border-brand-gold/15">
            <span className="text-[10px] font-mono text-brand-gold uppercase font-bold">
              NRC 0.85 ACOUSTIC RATING
            </span>
            <span className="text-xs font-display text-brand-ivory uppercase">
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
      textures: [
        { name: "Calacatta Gold", color: "#EBE5D8", sub: "Ivory & Amber Veins" },
        { name: "Nero Marquina", color: "#16181D", sub: "Obsidian & Gold" },
        { name: "Panda White", color: "#F0EFEA", sub: "High Contrast Slabs" },
        { name: "Emerald Jade", color: "#122822", sub: "Deep Malachite" },
      ],
      bgGradient: "from-brand-navy via-brand-navy-card to-brand-navy-deep",
      accentColor: "#C8A15A",
      badgeColor: "border-brand-gold/40 text-brand-gold",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-gradient-to-br from-[#101926] via-brand-navy to-brand-navy-deep p-6 flex flex-col justify-between border border-brand-gold/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/25 via-transparent to-transparent pointer-events-none" />
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold">
              CALACATTA GOLD • MONOLITH
            </span>
            <span className="text-xs font-mono text-brand-gold">MIRROR UV</span>
          </div>
          <div className="space-y-1 z-10">
            <div className="font-display text-2xl text-brand-ivory uppercase">
              Seamless Book-Matched Veins
            </div>
            <div className="text-xs text-brand-ivory/70 font-sans">
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
      textures: [
        { name: "Floating Bulkhead", color: "#243247", sub: "Suspended Tier" },
        { name: "Perimeter Cove", color: "#1C283B", sub: "Indirect Amber" },
        { name: "Vaulted Steppes", color: "#152033", sub: "Deep Coffer" },
        { name: "Shadowline Reglet", color: "#0B1526", sub: "15mm Negative" },
      ],
      bgGradient: "from-brand-navy via-brand-navy-card to-brand-navy-deep",
      accentColor: "#C8A15A",
      badgeColor: "border-brand-gold/40 text-brand-gold",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-gradient-to-br from-brand-navy-card via-brand-navy to-brand-navy-deep p-6 flex flex-col justify-between border border-brand-gold/30 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold">
              SUBGRID TOLERANCE: ±0.5MM
            </span>
            <span className="text-xs font-mono text-brand-ivory/80">LEVEL 5 FINISH</span>
          </div>
          <div className="space-y-1 z-10">
            <div className="font-display text-2xl text-brand-ivory uppercase">
              Multi-Tier Floating Rafts
            </div>
            <div className="text-xs text-brand-ivory/70 font-sans">
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
      subtitle: "Concealed 48V magnetic tracks, sculptural champagne pendants, and warm coves.",
      specs: [
        "48V Low-Voltage Safe Magnetic Track Integration",
        "CRI 95+ High-Fidelity Color Rendering LEDs",
        "3000K Warm Diurnal Dimming Calibration",
        "Custom Hand-Spun Champagne Gold Brass Lampshades",
      ],
      textures: [
        { name: "Champagne Brass", color: "#C8A15A", sub: "Hand-Spun" },
        { name: "Burnished Bronze", color: "#8C6A38", sub: "Antique Warm" },
        { name: "Matte Charcoal", color: "#161F2E", sub: "Architectural Noir" },
        { name: "Ivory Diffuser", color: "#F6F1E7", sub: "Microprism Warm" },
      ],
      bgGradient: "from-brand-navy via-brand-navy-card to-brand-navy-deep",
      accentColor: "#C8A15A",
      badgeColor: "border-brand-gold/40 text-brand-gold",
      heroTextureMock: (
        <div className="w-full h-full rounded-sm bg-gradient-to-br from-brand-navy-card via-brand-navy to-brand-navy-deep p-6 flex flex-col justify-between border border-brand-gold/30 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-brand-gold/20 blur-3xl pointer-events-none" />
          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold">
              LOW-VOLTAGE 48V DC • CRI 97
            </span>
            <span className="text-xs font-mono text-brand-gold">CHAMPAGNE WARM</span>
          </div>
          <div className="space-y-1 z-10">
            <div className="font-display text-2xl text-brand-ivory uppercase">
              Sculptural Pendant & Cove
            </div>
            <div className="text-xs text-brand-ivory/70 font-sans">
              Flicker-free micro-prism optics with custom champagne shade housings.
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentProduct = productLines[activeTab];

  return (
    <section id="product-lines" className="py-24 bg-brand-navy text-brand-ivory border-b border-brand-gold/15 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proprietary Architectural Systems</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl uppercase font-light text-brand-ivory leading-tight">
              The Five Disciplines of <span className="italic text-brand-gold">MarvelRise</span>
            </h2>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-gold/70">
            Select A Discipline To Inspect Anatomy →
          </p>
        </div>

        {/* Tab Navigation Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b border-brand-gold/15 pb-4">
          {productLines.map((prod, idx) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => {
                setActiveTab(idx);
                setSelectedSwatch(0);
              }}
              className={cn(
                "p-3 rounded-xs text-left transition-all duration-300 relative group border",
                activeTab === idx
                  ? "border-brand-gold bg-brand-navy-card shadow-lg shadow-brand-gold/15"
                  : "border-transparent hover:border-brand-gold/30 hover:bg-brand-navy-elevated"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-brand-gold/60 group-hover:text-brand-gold">
                  0{idx + 1}
                </span>
                {activeTab === idx && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                )}
              </div>
              <div className="text-xs font-display uppercase tracking-wider text-brand-ivory truncate">
                {prod.title.split(" ")[0]} {prod.title.split(" ")[1] || ""}
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Product Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-sm bg-brand-navy-card border border-brand-gold/30 shadow-2xl relative overflow-hidden transition-all duration-500">
          {/* Left Column: Specifications & Swatch Strip (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold block font-bold">
                DISCIPLINE {currentProduct.number} • {currentProduct.category}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl uppercase text-brand-ivory">
                {currentProduct.title}
              </h3>
              <p className="text-sm font-sans text-brand-ivory/75 leading-relaxed max-w-lg">
                {currentProduct.subtitle}
              </p>
            </div>

            {/* Technical Parameters List with Champagne Gold Accents */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-brand-gold">
                Architectural Performance Specs
              </h4>
              <ul className="space-y-2">
                {currentProduct.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs font-sans text-brand-ivory/80">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strip of Named Colour Swatches (as requested in visual references) */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-brand-gold block font-bold">
                  Curated Material Swatch Strip
                </span>
                <span className="text-[10px] font-mono text-brand-ivory/60 uppercase">
                  {currentProduct.textures[selectedSwatch]?.name} • {currentProduct.textures[selectedSwatch]?.sub}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currentProduct.textures.map((tex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedSwatch(i)}
                    className={cn(
                      "p-2 rounded-xs border text-left transition-all duration-200 flex items-center gap-2.5 group",
                      selectedSwatch === i
                        ? "border-brand-gold bg-brand-navy-light shadow-md"
                        : "border-brand-gold/15 bg-brand-navy-deep/60 hover:border-brand-gold/40"
                    )}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-white/20 shadow-sm"
                      style={{ backgroundColor: tex.color }}
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-mono text-brand-ivory block truncate font-medium">
                        {tex.name}
                      </span>
                      <span className="text-[8px] font-mono text-brand-gold/70 block truncate">
                        {tex.sub}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center gap-4">
              <a
                href="#room-planner"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-lg shadow-brand-gold/20"
              >
                <span>Request Sample Swatch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent(`Hello MarvelRise Decor, I would like technical details and pricing on ${currentProduct.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono uppercase tracking-wider text-brand-ivory/70 hover:text-brand-gold transition-colors flex items-center gap-1"
              >
                <span>Consult Lead Finisher</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Layered Texture Mockup / 3D Anatomy (6 cols) */}
          <div className="lg:col-span-6 min-h-[380px] sm:min-h-[440px] rounded-sm overflow-hidden">
            {currentProduct.heroTextureMock}
          </div>
        </div>
      </div>
    </section>
  );
}
