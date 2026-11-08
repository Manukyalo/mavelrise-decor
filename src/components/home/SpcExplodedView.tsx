"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Droplets, Layers, VolumeX, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpcExplodedView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersContainerRef = useRef<HTMLDivElement>(null);

  // References to the 5 distinct anatomical layers
  const layer1Ref = useRef<HTMLDivElement>(null); // UV Wear Layer
  const layer2Ref = useRef<HTMLDivElement>(null); // Decor Film
  const layer3Ref = useRef<HTMLDivElement>(null); // Rigid Stone Core
  const layer4Ref = useRef<HTMLDivElement>(null); // Click-Lock Profile
  const layer5Ref = useRef<HTMLDivElement>(null); // IXPE Acoustic Underlayment

  const [activeLayerIndex, setActiveLayerIndex] = useState(2); // Default to core

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Pin container and scrub layers apart vertically
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.2) setActiveLayerIndex(0);
            else if (p < 0.4) setActiveLayerIndex(1);
            else if (p < 0.6) setActiveLayerIndex(2);
            else if (p < 0.8) setActiveLayerIndex(3);
            else setActiveLayerIndex(4);
          },
        },
      });

      // Layer 1 floats high up
      tl.to(
        layer1Ref.current,
        {
          y: -140,
          rotateX: 25,
          rotateY: -15,
          scale: 1.05,
          ease: "power2.out",
        },
        0
      );

      // Layer 2 floats upper-mid
      tl.to(
        layer2Ref.current,
        {
          y: -70,
          rotateX: 25,
          rotateY: -15,
          scale: 1.02,
          ease: "power2.out",
        },
        0
      );

      // Layer 3 stays central anchor
      tl.to(
        layer3Ref.current,
        {
          y: 0,
          rotateX: 25,
          rotateY: -15,
          scale: 1,
          ease: "power2.out",
        },
        0
      );

      // Layer 4 click-lock highlights & moves lower-mid
      tl.to(
        layer4Ref.current,
        {
          y: 70,
          rotateX: 25,
          rotateY: -15,
          scale: 0.98,
          ease: "power2.out",
        },
        0
      );

      // Layer 5 IXPE drops low
      tl.to(
        layer5Ref.current,
        {
          y: 140,
          rotateX: 25,
          rotateY: -15,
          scale: 0.95,
          ease: "power2.out",
        },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const layersData = [
    {
      id: "wear",
      title: "UV Ceramic Wear Barrier",
      thickness: "0.55mm Commercial Grade",
      desc: "Double-cured polyurethane infused with ceramic beads. Resists pet claws, high heels, and heavy foot traffic without dulling.",
      icon: Shield,
      color: "border-cyan-400/50 text-cyan-300",
      accentBg: "bg-cyan-500/10",
    },
    {
      id: "film",
      title: "Ultra-HD EIR Decorative Film",
      thickness: "High-Definition Print Layer",
      desc: "Embossed-In-Register wood grain synchronized with real tactile knotting and natural matte French Oak pigmentation.",
      icon: Sparkles,
      color: "border-amber-400/50 text-amber-300",
      accentBg: "bg-amber-500/10",
    },
    {
      id: "core",
      title: "Solid Stone Polymer Composite Core",
      thickness: "4.5mm Rigid Limestone Core",
      desc: "70% natural limestone powder fused with virgin PVC. Zero thermal expansion, 100% waterproof, and completely termite-proof.",
      icon: Droplets,
      color: "border-brand-orange text-brand-orange",
      accentBg: "bg-brand-orange/15",
    },
    {
      id: "click",
      title: "Precision Unilin Click-Lock Milled Joint",
      thickness: "Watertight Mechanical Seal",
      desc: "Laser-machined joint profile enabling glueless installation. Resists moisture seepage and locks planks seamlessly together.",
      icon: Layers,
      color: "border-emerald-400/50 text-emerald-300",
      accentBg: "bg-emerald-500/10",
    },
    {
      id: "underlay",
      title: "Acoustic IXPE Sound Dampening Pad",
      thickness: "1.5mm Integrated Foam",
      desc: "High-density cross-linked polyethylene pad dampening impact footfall sounds by up to 21dB while correcting minor subfloor variations.",
      icon: VolumeX,
      color: "border-indigo-400/50 text-indigo-300",
      accentBg: "bg-indigo-500/10",
    },
  ];

  const currentActiveLayer = layersData[activeLayerIndex] || layersData[2];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-brand-black-elevated text-brand-sand-50 py-20 border-b border-white/10 flex flex-col justify-center overflow-hidden"
    >
      {/* Background Architectural Noise & Watermark */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 select-none text-[16vw] font-display font-black text-white/[0.02] pointer-events-none">
        SPC CORE
      </div>

      <div className="container mx-auto px-4 md:px-8 z-10 flex flex-col justify-between h-full">
        {/* Section Header */}
        <div className="max-w-2xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-orange">
            <Layers className="w-3.5 h-3.5" />
            <span>Pin-And-Scrub Architectural Anatomy</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light uppercase text-brand-white leading-tight">
            The Physics of <span className="italic text-brand-orange">SPC Flooring</span>
          </h2>
          <p className="text-xs sm:text-sm font-sans text-brand-sand-300 max-w-lg leading-relaxed">
            Scroll to pull apart the five microscopic layers engineered to withstand East Africa’s moisture, termites, and heavy footfall.
          </p>
        </div>

        {/* 3D Exploded Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          {/* Left / Center: 3D Exploded Layers Stack */}
          <div className="lg:col-span-7 flex items-center justify-center min-h-[380px] sm:min-h-[460px] perspective-[1200px]">
            <div
              ref={layersContainerRef}
              className="relative w-72 sm:w-96 h-48 sm:h-56 will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* LAYER 1: UV Wear Layer */}
              <div
                ref={layer1Ref}
                className={cn(
                  "absolute inset-0 rounded-sm border-2 backdrop-blur-md flex flex-col justify-between p-4 shadow-xl transition-colors duration-300",
                  activeLayerIndex === 0
                    ? "border-cyan-400 bg-cyan-950/40 shadow-cyan-500/20"
                    : "border-cyan-500/30 bg-cyan-950/20"
                )}
                style={{
                  transform: "rotateX(25deg) rotateY(-15deg)",
                  transformOrigin: "center center",
                }}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-cyan-300 uppercase">
                  <span>LAYER 01</span>
                  <span>0.55 MM</span>
                </div>
                <div className="font-display text-sm sm:text-base text-brand-white uppercase">
                  UV Double-Coated Wear Barrier
                </div>
              </div>

              {/* LAYER 2: Decor Film */}
              <div
                ref={layer2Ref}
                className={cn(
                  "absolute inset-0 rounded-sm border-2 flex flex-col justify-between p-4 shadow-xl transition-colors duration-300",
                  activeLayerIndex === 1
                    ? "border-amber-400 bg-[#3B291A]/90 shadow-amber-500/20"
                    : "border-amber-500/30 bg-[#2E2014]/70"
                )}
                style={{
                  transform: "rotateX(25deg) rotateY(-15deg)",
                  transformOrigin: "center center",
                }}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-amber-300 uppercase">
                  <span>LAYER 02</span>
                  <span>EIR GRAIN</span>
                </div>
                <div className="font-display text-sm sm:text-base text-brand-white uppercase">
                  French Oak Photographic Print
                </div>
              </div>

              {/* LAYER 3: Rigid Stone Core */}
              <div
                ref={layer3Ref}
                className={cn(
                  "absolute inset-0 rounded-sm border-2 flex flex-col justify-between p-4 shadow-2xl transition-colors duration-300",
                  activeLayerIndex === 2
                    ? "border-brand-orange bg-[#1E2229] shadow-brand-orange/30"
                    : "border-white/20 bg-[#16181D]"
                )}
                style={{
                  transform: "rotateX(25deg) rotateY(-15deg)",
                  transformOrigin: "center center",
                }}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-brand-orange uppercase">
                  <span>LAYER 03 • CORE</span>
                  <span>4.5 MM RIGID</span>
                </div>
                <div>
                  <div className="font-display text-base sm:text-lg text-brand-white uppercase">
                    Solid Stone-Plastic Composite
                  </div>
                  <div className="text-[10px] font-mono text-brand-sand-400">
                    70% Natural Limestone + Virgin PVC
                  </div>
                </div>
              </div>

              {/* LAYER 4: Unilin Click-Lock Edge */}
              <div
                ref={layer4Ref}
                className={cn(
                  "absolute inset-0 rounded-sm border-2 flex flex-col justify-between p-4 shadow-xl transition-colors duration-300",
                  activeLayerIndex === 3
                    ? "border-emerald-400 bg-emerald-950/40 shadow-emerald-500/20"
                    : "border-emerald-500/30 bg-emerald-950/20"
                )}
                style={{
                  transform: "rotateX(25deg) rotateY(-15deg)",
                  transformOrigin: "center center",
                }}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-emerald-300 uppercase">
                  <span>LAYER 04</span>
                  <span>UNILIN JOINT</span>
                </div>
                <div className="font-display text-sm sm:text-base text-brand-white uppercase">
                  Patented Hermetic Click-Lock
                </div>
              </div>

              {/* LAYER 5: Acoustic IXPE Pad */}
              <div
                ref={layer5Ref}
                className={cn(
                  "absolute inset-0 rounded-sm border-2 flex flex-col justify-between p-4 shadow-xl transition-colors duration-300",
                  activeLayerIndex === 4
                    ? "border-indigo-400 bg-indigo-950/40 shadow-indigo-500/20"
                    : "border-indigo-500/30 bg-indigo-950/20"
                )}
                style={{
                  transform: "rotateX(25deg) rotateY(-15deg)",
                  transformOrigin: "center center",
                }}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-indigo-300 uppercase">
                  <span>LAYER 05</span>
                  <span>1.5 MM MEMBRANE</span>
                </div>
                <div className="font-display text-sm sm:text-base text-brand-white uppercase">
                  High-Density IXPE Acoustic Underlay
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Deep Dive Card synchronized with current scrub layer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 sm:p-8 rounded-sm glass-panel border border-white/15 relative overflow-hidden space-y-4 transition-all duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-orange">
                  Layer 0{activeLayerIndex + 1} of 05
                </span>
                <span className="text-[11px] font-mono text-brand-sand-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  {currentActiveLayer.thickness}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-2xl text-brand-white uppercase">
                  {currentActiveLayer.title}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-brand-sand-300 leading-relaxed">
                  {currentActiveLayer.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <div className="p-2 rounded-xs bg-brand-orange/20 border border-brand-orange/40 text-brand-orange">
                  <currentActiveLayer.icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono tracking-wider text-brand-sand-200 uppercase">
                  Engineered for Permanent Structural Durability
                </span>
              </div>
            </div>

            {/* Quick Layer Switcher / Scrub Position Indicators */}
            <div className="flex items-center gap-2 pt-2">
              {layersData.map((layer, idx) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setActiveLayerIndex(idx)}
                  className={cn(
                    "flex-1 py-1.5 rounded-xs text-[10px] font-mono uppercase tracking-wider transition-all duration-300",
                    activeLayerIndex === idx
                      ? "bg-brand-orange text-white font-semibold"
                      : "bg-white/5 text-brand-sand-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  L0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Specs Ticker */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-brand-sand-400 uppercase">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-orange" /> 100% Formaldehyde-Free
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Class Bfl-S1 Fire Rated
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-orange" /> Zero Termite Susceptibility
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Compatible With Underfloor Heating
          </span>
        </div>
      </div>
    </section>
  );
}
