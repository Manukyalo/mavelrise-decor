"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTilt } from "@/hooks/useTilt";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight, Sparkles, Layers, Sliders, Volume2, Lightbulb, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroRoomTransformationProps {
  headlineLine1?: string;
  headlineLine2?: string;
  ctaText?: string;
  subText?: string;
}

export function HeroRoomTransformation({
  headlineLine1 = "TRANSFORM ORDINARY SPACES",
  headlineLine2 = "INTO ARCHITECTURAL SANCTUARIES",
  ctaText = "Design your room",
  subText = "Experience the live transformation: click any stage or scroll to witness bare concrete become an acoustic luxury retreat with French oak floor planks, fluted wall panels, and warm champagne illumination.",
}: HeroRoomTransformationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomWrapperRef = useRef<HTMLDivElement>(null);

  // Transformation Scene Elements
  const floorPlanksRef = useRef<HTMLDivElement>(null);
  const wallPanelsRef = useRef<HTMLDivElement>(null);
  const marbleSlabRef = useRef<HTMLDivElement>(null);
  const lampFixtureRef = useRef<HTMLDivElement>(null);
  const lampGlowRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const tilt = useTilt(6); // Subtle 3D mouse parallax tilt

  // Transition to a specific transformation step (1 to 5)
  const setStepState = useCallback((step: number) => {
    setCurrentStep(step);

    const floor = floorPlanksRef.current;
    const walls = wallPanelsRef.current;
    const marble = marbleSlabRef.current;
    const lamp = lampFixtureRef.current;
    const glow = lampGlowRef.current;

    // Step 1: Raw Canvas
    if (step === 1) {
      gsap.to(floor, { opacity: 0, y: 50, duration: 0.6, ease: "power2.out" });
      gsap.to(walls, { opacity: 0, x: -80, duration: 0.6, ease: "power2.out" });
      gsap.to(marble, { opacity: 0, x: 80, duration: 0.6, ease: "power2.out" });
      gsap.to(lamp, { opacity: 0, y: -60, duration: 0.6, ease: "power2.out" });
      gsap.to(glow, { opacity: 0, scale: 0.5, duration: 0.6, ease: "power2.out" });
    }
    // Step 2: Floor Planks Click In
    else if (step === 2) {
      gsap.to(floor, { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.2)" });
      gsap.to(walls, { opacity: 0, x: -80, duration: 0.5, ease: "power2.out" });
      gsap.to(marble, { opacity: 0, x: 80, duration: 0.5, ease: "power2.out" });
      gsap.to(lamp, { opacity: 0, y: -60, duration: 0.5, ease: "power2.out" });
      gsap.to(glow, { opacity: 0, scale: 0.5, duration: 0.5, ease: "power2.out" });
    }
    // Step 3: Walls & Marble Slabs Lock In
    else if (step === 3) {
      gsap.to(floor, { opacity: 1, y: 0, duration: 0.5 });
      gsap.to(walls, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" });
      gsap.to(marble, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.to(lamp, { opacity: 0, y: -60, duration: 0.5, ease: "power2.out" });
      gsap.to(glow, { opacity: 0, scale: 0.5, duration: 0.5, ease: "power2.out" });
    }
    // Step 4: Lamp Fixture & Warm Glow
    else if (step === 4) {
      gsap.to(floor, { opacity: 1, y: 0, duration: 0.5 });
      gsap.to(walls, { opacity: 1, x: 0, duration: 0.5 });
      gsap.to(marble, { opacity: 1, x: 0, duration: 0.5 });
      gsap.to(lamp, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
      gsap.to(glow, { opacity: 0.85, scale: 1.1, duration: 0.8, ease: "power3.out", delay: 0.2 });
    }
    // Step 5: Finished Architectural Sanctuary
    else {
      gsap.to(floor, { opacity: 1, y: 0, duration: 0.5 });
      gsap.to(walls, { opacity: 1, x: 0, duration: 0.5 });
      gsap.to(marble, { opacity: 1, x: 0, duration: 0.5 });
      gsap.to(lamp, { opacity: 1, y: 0, duration: 0.5 });
      gsap.to(glow, { opacity: 1, scale: 1.2, duration: 0.8, ease: "power3.out" });
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStepState(5);
      return;
    }

    // Scroll trigger without hard pinning so no empty blank spacers or traps are created
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 20%",
      end: "bottom 30%",
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.2) setStepState(1);
        else if (p < 0.45) setStepState(2);
        else if (p < 0.7) setStepState(3);
        else if (p < 0.9) setStepState(4);
        else setStepState(5);
      },
    });

    return () => {
      st.kill();
    };
  }, [setStepState]);

  // Chapter Metadata
  const chapterMeta = [
    {
      num: "01",
      badge: "THE RAW CANVAS",
      title: "The Empty, Ordinary Room",
      desc: "Cold concrete, flat acoustics, and unshaped volume waiting for architectural purpose.",
    },
    {
      num: "02",
      badge: "THE FOUNDATION",
      title: "French Oak Floor Planks Click Into Place",
      desc: "Waterproof stone-plastic composite planks lock with millimeter precision, eliminating structural echo.",
    },
    {
      num: "03",
      badge: "THE VERTICAL PLANE",
      title: "Walls Come Alive With Fluted Oak & UV Marble",
      desc: "Acoustic timber slats and high-gloss Calacatta marble slabs sculpt the room's sound and elegance.",
    },
    {
      num: "04",
      badge: "THE ATMOSPHERE",
      title: "Light Arrives With Sculptural Champagne Pendants",
      desc: "A 3000K warm diurnal light wash bathes the room in champagne radiance, illuminating rich wood textures.",
    },
    {
      num: "05",
      badge: "THE SANCTUARY",
      title: "The Finished Architectural Sanctuary",
      desc: "A complete room transformation engineered for timeless permanence in Nairobi.",
    },
  ];

  const currentMeta = chapterMeta[currentStep - 1] || chapterMeta[0];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] lg:min-h-[96vh] bg-brand-navy flex flex-col justify-between pt-24 sm:pt-28 pb-12 overflow-hidden"
    >
      {/* Dynamic Ambient Background Illumination (Champagne Gold & Deep Navy) */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-luxury"
        style={{
          background:
            currentStep >= 4
              ? "radial-gradient(circle at 50% 40%, rgba(200, 161, 90, 0.22) 0%, rgba(16, 34, 62, 0.6) 45%, #0B1B33 85%)"
              : currentStep >= 2
                ? "radial-gradient(circle at 50% 60%, rgba(200, 161, 90, 0.12) 0%, #0B1B33 70%)"
                : "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, #0B1B33 80%)",
        }}
      />

      {/* Top Bar: Headline & Actions */}
      <div className="container mx-auto px-4 md:px-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-navy-elevated border border-brand-gold/30 text-[10px] font-mono tracking-widest text-brand-gold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            <span>CINEMATIC ROOM TRANSFORMATION</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light uppercase text-brand-ivory leading-[0.98] tracking-tight">
            {headlineLine1} <br />
            <span className="italic text-brand-gold">{headlineLine2}</span>
          </h1>

          <p className="text-xs sm:text-sm font-sans text-brand-ivory/70 max-w-xl leading-relaxed">
            {subText}
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          <MagneticButton strength={0.4}>
            <a
              href="#room-planner"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 shadow-xl shadow-brand-gold/25 group"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </MagneticButton>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent("Hello MarvelRise Decor, I would like to design my room and get an estimate.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3.5 rounded-sm bg-brand-navy-card hover:bg-brand-navy-light text-brand-ivory border border-brand-gold/25 hover:border-brand-gold text-xs font-mono uppercase tracking-widest transition-all duration-300"
          >
            <span>WhatsApp Estimate</span>
          </a>
        </div>
      </div>

      {/* 3D PERSPECTIVE INTERACTIVE ROOM CANVAS */}
      <div className="relative w-full my-6 flex items-center justify-center z-10 px-4">
        <div
          ref={roomWrapperRef}
          className="relative w-full max-w-5xl h-[340px] sm:h-[420px] md:h-[460px] rounded-sm bg-brand-navy-card/90 border border-brand-gold/30 overflow-hidden shadow-2xl will-change-transform flex items-center justify-center"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y * 0.4}deg) rotateY(${tilt.x * 0.4}deg)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {/* Subtle Room Grid & Wireframe Blueprint Coordinates */}
          <div className="absolute inset-0 bg-noise opacity-30" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-navy-deep/90 to-transparent pointer-events-none z-10" />

          {/* LAYER 1: Raw Concrete Room Wireframe (Base Layer) */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-40 pointer-events-none">
            <div className="flex justify-between text-[10px] font-mono tracking-widest text-brand-gold/50">
              <span>AXIS: X+4.82 Y+2.90 Z+0.00</span>
              <span>VOLUME: 68.4 M³</span>
            </div>
            <div className="w-full h-full border-b border-brand-gold/15 flex items-center justify-center">
              <span className="text-[11px] font-mono text-brand-gold/60 uppercase tracking-widest">
                RAW SPATIAL VOID • CONCRETE ENCLOSURE
              </span>
            </div>
          </div>

          {/* LAYER 2: SPC Click-Lock Floor Planks */}
          <div
            ref={floorPlanksRef}
            className="absolute bottom-0 inset-x-0 h-36 md:h-44 bg-gradient-to-t from-[#2E1D13] via-[#4A301D] to-[#1C120B] border-t border-brand-gold/40 will-change-transform z-10 opacity-0 overflow-hidden"
          >
            <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 p-3 h-full">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="plank-item rounded-xs bg-[#5E3D24] border-r border-black/40 shadow-inner flex flex-col justify-end p-2 relative overflow-hidden"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(200,161,90,0.06) 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                >
                  <div className="absolute top-1 left-1.5 text-[8px] font-mono text-brand-gold/70">
                    SPC-EIR
                  </div>
                  <span className="text-[9px] font-mono text-brand-ivory/80 uppercase">
                    Oak 0{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute top-2 right-4 px-2.5 py-0.5 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-[9px] font-mono text-brand-gold uppercase font-semibold">
              French Oak Click-Lock Planks Engaged
            </div>
          </div>

          {/* LAYER 3A: Left Wall Fluted Acoustic Timber Slat Panels */}
          <div
            ref={wallPanelsRef}
            className="absolute left-0 top-0 bottom-28 md:bottom-36 w-1/3 md:w-1/4 bg-[#1F1710] border-r border-brand-gold/25 will-change-transform z-20 opacity-0 overflow-hidden shadow-2xl"
          >
            <div className="flex h-full gap-1 p-2 bg-black/60">
              {[...Array(12)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-r from-[#4A301D] via-[#664328] to-[#362214] shadow-md rounded-xs"
                />
              ))}
            </div>
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-xs bg-brand-navy-deep/90 border border-brand-gold/30 text-[8px] font-mono text-brand-gold uppercase">
              Acoustic Slat PET
            </div>
          </div>

          {/* LAYER 3B: Right Wall Monolithic UV Marble Sheet */}
          <div
            ref={marbleSlabRef}
            className="absolute right-0 top-0 bottom-28 md:bottom-36 w-1/3 md:w-1/4 bg-[#101926] border-l border-brand-gold/25 will-change-transform z-20 opacity-0 overflow-hidden shadow-2xl flex flex-col justify-between p-4"
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 flex justify-between items-start">
              <span className="text-[9px] font-mono text-brand-ivory/80 uppercase tracking-widest">
                UV Marble Sheet
              </span>
              <span className="text-[8px] font-mono text-brand-gold font-bold">Nero & Gold</span>
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-display text-brand-ivory uppercase block">
                Continuous Monolith
              </span>
              <span className="text-[8px] font-sans text-brand-ivory/60">
                Scratch & Stain Barrier
              </span>
            </div>
          </div>

          {/* LAYER 4: Pendant Lampshade Fixture & Atmospheric Warm Glow */}
          <div
            ref={lampFixtureRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none opacity-0"
          >
            <div className="w-[1.5px] h-14 md:h-20 bg-gradient-to-b from-brand-gold/40 to-brand-gold" />
            <div className="w-5 h-2 rounded-xs bg-brand-gold" />

            <div className="relative w-28 md:w-36 h-12 md:h-14 bg-gradient-to-b from-brand-gold to-[#8F6E32] rounded-t-full border border-brand-gold/50 shadow-xl flex items-end justify-center pb-1">
              <div className="w-8 h-4 rounded-t-full bg-amber-100 shadow-[0_0_20px_#C8A15A]" />
            </div>

            <div
              ref={lampGlowRef}
              className="w-[340px] md:w-[500px] h-[300px] md:h-[420px] rounded-full bg-gradient-to-b from-amber-400/35 via-brand-gold/25 to-transparent blur-[60px] pointer-events-none opacity-0 -mt-4"
            />
          </div>
        </div>
      </div>

      {/* Interactive Chapter HUD & Stage Selector */}
      <div className="container mx-auto px-4 md:px-8 z-20 space-y-3">
        {/* Stage Buttons */}
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          {chapterMeta.map((ch, idx) => (
            <button
              key={ch.num}
              type="button"
              onClick={() => setStepState(idx + 1)}
              className={cn(
                "px-3.5 py-1.5 rounded-xs text-[11px] font-mono uppercase tracking-wider transition-all duration-200 border",
                currentStep === idx + 1
                  ? "bg-brand-gold border-brand-gold text-brand-navy font-bold shadow-lg shadow-brand-gold/25"
                  : "bg-brand-navy-card border-brand-gold/20 text-brand-ivory/70 hover:border-brand-gold/50 hover:text-brand-ivory"
              )}
            >
              {ch.num}. {ch.badge.split(" ")[1] || ch.badge}
            </button>
          ))}
        </div>

        {/* Status Card */}
        <div className="p-4 sm:p-5 rounded-sm glass-panel border border-brand-gold/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center font-display text-lg text-brand-gold font-bold shrink-0">
              {currentMeta.num}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold">
                  {currentMeta.badge}
                </span>
                <span className="text-brand-gold/30">•</span>
                <span className="text-[10px] font-mono tracking-wider text-brand-ivory/60 uppercase">
                  Stage {currentStep} of 5
                </span>
              </div>
              <h2 className="font-display text-base sm:text-lg text-brand-ivory uppercase">
                {currentMeta.title}
              </h2>
            </div>
          </div>

          <p className="text-xs font-sans text-brand-ivory/75 max-w-md leading-relaxed">
            {currentMeta.desc}
          </p>
        </div>
      </div>
    </section>
  );
}
