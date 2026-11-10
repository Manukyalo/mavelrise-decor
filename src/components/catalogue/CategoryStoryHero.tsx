"use client";

import { useEffect, useRef, useState } from "react";
import { Category } from "@/types/catalogue";
import { Layers, ShieldCheck, Waves, Sparkles, SunDim, VolumeX } from "lucide-react";
import Link from "next/link";

interface CategoryStoryHeroProps {
  category: Category;
  locale: string;
}

export function CategoryStoryHero({ category, locale }: CategoryStoryHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Calculate progress while this hero is scrolling past
      const total = rect.height;
      const current = windowHeight - rect.top;
      const progress = Math.min(Math.max(current / (total + windowHeight), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden border-b border-amber-500/20 bg-gradient-to-b from-[#03060c] via-[#060c16] to-[#040810]"
    >
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C49A6C_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] font-mono uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Architectural Storyline</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-medium tracking-tight leading-[1.1]">
              {category.name}
            </h1>

            <p className="font-serif text-xl text-amber-200/80 italic font-light">
              &ldquo;{category.tagline || "Engineered for Nairobi's premier spaces"}&rdquo;
            </p>

            <p className="text-sm text-white/70 leading-relaxed max-w-xl">
              {category.description}
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {category.slug === "spc-flooring" && (
                <Link
                  href={`/${locale}/planner`}
                  className="px-5 py-2.5 bg-amber-400 text-black text-xs font-mono font-semibold uppercase tracking-wider rounded-xs hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
                >
                  Launch 3D Room Planner
                </Link>
              )}
              <a
                href="#products-list"
                className="px-5 py-2.5 border border-white/20 text-white/80 text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-white/5 transition-all"
              >
                Browse All Specifications ↓
              </a>
            </div>
          </div>

          {/* Interactive Scroll Story Canvas / Visualiser */}
          <div className="lg:col-span-6">
            <div className="relative p-6 sm:p-8 rounded-sm bg-[#050a12]/90 border border-amber-500/20 shadow-2xl backdrop-blur-xl">
              {/* Category-Specific Visual Scroll Interactive */}
              {category.slug === "spc-flooring" && (
                <SpcInteractiveStory progress={scrollProgress} />
              )}
              {category.slug === "wpc-wall-panels" && (
                <WpcInteractiveStory progress={scrollProgress} />
              )}
              {category.slug === "marble-sheets" && (
                <MarbleInteractiveStory progress={scrollProgress} />
              )}
              {category.slug === "lampshades" && (
                <LampshadesInteractiveStory progress={scrollProgress} />
              )}
              {category.slug === "decor-accessories" && (
                <DecorInteractiveStory progress={scrollProgress} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 1. SPC: Plank-by-plank floor scrub & 5-layer acoustic anatomy
function SpcInteractiveStory({ progress }: { progress: number }) {
  const layers = [
    { name: "UV Ceramic Bead Coating", desc: "Scratch & UV stain barrier" },
    { name: "0.55mm Heavy Wear Layer", desc: "AC5 Commercial footfall rating" },
    { name: "High-Definition Wood Grain Film", desc: "Micro-registered tactile grain" },
    { name: "Stone Plastic Composite Core", desc: "70% limestone monolithic stability" },
    { name: "1.5mm Acoustic IXPE Underlay", desc: "Sound dampening & thermal comfort" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          5-Layer Monolithic Anatomy
        </span>
        <span className="text-[10px] font-mono text-white/40">
          Scroll Scrub: {Math.round(progress * 100)}%
        </span>
      </div>

      {/* Layer Stacks */}
      <div className="space-y-2.5">
        {layers.map((layer, idx) => {
          const isRevealed = progress >= (idx * 0.15);
          return (
            <div
              key={layer.name}
              className={`p-3 rounded-xs border transition-all duration-500 ${
                isRevealed
                  ? "bg-amber-400/10 border-amber-400/40 translate-x-2"
                  : "bg-black/30 border-white/5 opacity-40 translate-x-0"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-medium">
                  {idx + 1}. {layer.name}
                </span>
                <span className="text-[10px] text-amber-300">
                  {isRevealed ? "Active" : "Locked"}
                </span>
              </div>
              <p className="text-[11px] text-white/60 mt-1">{layer.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono text-white/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Waterproof</span>
        </div>
        <div className="flex items-center gap-2">
          <VolumeX className="w-4 h-4 text-amber-300" />
          <span>NRC 0.45 Sound Dampening</span>
        </div>
      </div>
    </div>
  );
}

// 2. WPC: Wall Panel Fluting Perspective Scrub
function WpcInteractiveStory({ progress }: { progress: number }) {
  const panelCount = 7;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Acoustic Fluted Ridge Scrub
        </span>
        <span className="text-[10px] font-mono text-white/40">
          Wall Perspective
        </span>
      </div>

      {/* Simulated Fluting Wall Section */}
      <div className="h-44 bg-[#020408] rounded-xs border border-white/10 p-3 flex gap-2 items-stretch overflow-hidden">
        {Array.from({ length: panelCount }).map((_, i) => {
          const offset = Math.sin((progress * 4) + i * 0.8) * 12;
          return (
            <div
              key={i}
              className="flex-1 rounded-xs bg-gradient-to-b from-[#3a2c20] via-[#211811] to-[#120d09] border-r border-amber-500/20 shadow-lg flex flex-col justify-end p-2 transition-transform duration-300"
              style={{
                transform: `translateY(${offset}px)`,
              }}
            >
              <span className="text-[9px] font-mono text-amber-300/60 writing-mode-vertical">
                J300
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/70 leading-relaxed font-mono">
        Vertical interlocking tongue-and-groove joints eliminate visible screws, turning plain masonry into acoustic sound-absorbing wall art.
      </p>
    </div>
  );
}

// 3. Marble Sheets: Flowing Veining Reveal
function MarbleInteractiveStory({ progress }: { progress: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
          <Waves className="w-4 h-4" />
          Monolithic Vein Continuity
        </span>
        <span className="text-[10px] font-mono text-white/40">
          Calacatta Gold
        </span>
      </div>

      {/* Veined Surface Simulation */}
      <div className="relative h-44 rounded-xs border border-amber-400/30 overflow-hidden bg-gradient-to-br from-[#1c222d] via-[#0d121c] to-[#05070c]">
        {/* Animated SVG Veins */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
          <path
            d="M -20,180 Q 80,40 220,120 T 420,20"
            fill="none"
            stroke="#E8A856"
            strokeWidth="3"
            strokeOpacity={0.4 + progress * 0.5}
            strokeDasharray="400"
            strokeDashoffset={400 - progress * 400}
            className="transition-all duration-300"
          />
          <path
            d="M 220,120 Q 280,180 380,160"
            fill="none"
            stroke="#C49A6C"
            strokeWidth="1.5"
            strokeOpacity={progress}
            className="transition-all duration-300"
          />
        </svg>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
          <span className="text-xs font-mono text-white/90">
            Peel-and-stick adhesive roll or 5mm rigid UV slab — no heavy masonry.
          </span>
        </div>
      </div>

      <p className="text-xs text-white/70 leading-relaxed font-mono">
        Book-matched symmetry delivers the grandeur of Carrara and Nero Marquina at 1/10th the weight and zero demolition downtime.
      </p>
    </div>
  );
}

// 4. Lampshades: Sequential Diurnal Illumination
function LampshadesInteractiveStory({ progress }: { progress: number }) {
  const lamps = [
    { code: "MRDP001", name: "Cage Grid" },
    { code: "MRDP002", name: "Orange Orb" },
    { code: "MRDP003", name: "Petal Pinecone" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
          <SunDim className="w-4 h-4" />
          Sequential Diurnal Glow
        </span>
        <span className="text-[10px] font-mono text-white/40">
          2700K Warm Kelvin
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {lamps.map((lamp, i) => {
          const isLit = progress >= i * 0.25;
          return (
            <div
              key={lamp.code}
              className={`p-3 rounded-xs border text-center transition-all duration-700 ${
                isLit
                  ? "bg-amber-400/15 border-amber-400/50 shadow-lg shadow-amber-400/20"
                  : "bg-black/40 border-white/5 opacity-40"
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full transition-all duration-700 ${
                  isLit ? "bg-amber-400 shadow-[0_0_20px_#f59e0b]" : "bg-white/10"
                }`}
              />
              <span className="text-[10px] font-mono text-white/90 block mt-2 font-medium">
                {lamp.code}
              </span>
              <span className="text-[9px] text-white/50 block">{lamp.name}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/70 leading-relaxed font-mono">
        Architectural polyester and woven rattan pendants tuned to 2700K–3000K diurnal Kelvin warmth.
      </p>
    </div>
  );
}

// 5. Decor: Tactile Artifacts
function DecorInteractiveStory({ progress }: { progress: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Curated Tactile Artifacts
        </span>
        <span className="text-[10px] font-mono text-white/40">
          Atelier Collection
        </span>
      </div>

      <div className="p-4 bg-black/40 rounded-xs border border-white/5 space-y-2">
        <div className="text-xs text-white font-medium font-serif">
          Hand-Finished Bespoke Decor Accents
        </div>
        <p className="text-xs text-white/60 leading-relaxed">
          From hammered bronze kinetic wall reliefs to hand-thrown stoneware vessels and tailored bouclé bolsters — every piece completes the architectural ensemble.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white/60">
        <div className="p-2 border border-white/5 bg-white/[0.01]">
          ✓ Handcrafted metals
        </div>
        <div className="p-2 border border-white/5 bg-white/[0.01]">
          ✓ Stoneware ceramics
        </div>
      </div>
    </div>
  );
}

