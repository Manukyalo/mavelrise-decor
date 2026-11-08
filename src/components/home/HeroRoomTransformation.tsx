"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTilt } from "@/hooks/useTilt";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight, Sparkles, Layers, Sliders, Volume2, Lightbulb } from "lucide-react";
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
  subText = "Experience the live transformation: scroll to witness bare concrete become an acoustic luxury retreat with floor planks, wall panels, and illuminated lighting.",
}: HeroRoomTransformationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomWrapperRef = useRef<HTMLDivElement>(null);

  // Transformation Scene Elements
  const floorPlanksRef = useRef<HTMLDivElement>(null);
  const wallPanelsRef = useRef<HTMLDivElement>(null);
  const marbleSlabRef = useRef<HTMLDivElement>(null);
  const lampFixtureRef = useRef<HTMLDivElement>(null);
  const lampGlowRef = useRef<HTMLDivElement>(null);
  const chapterBadgeRef = useRef<HTMLSpanElement>(null);
  const chapterTitleRef = useRef<HTMLHeadingElement>(null);
  const chapterDescRef = useRef<HTMLParagraphElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const tilt = useTilt(6); // Subtle 3D mouse parallax tilt

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // In reduced motion mode, show fully transformed state immediately
      if (floorPlanksRef.current) floorPlanksRef.current.style.opacity = "1";
      if (wallPanelsRef.current) wallPanelsRef.current.style.opacity = "1";
      if (marbleSlabRef.current) marbleSlabRef.current.style.opacity = "1";
      if (lampFixtureRef.current) lampFixtureRef.current.style.opacity = "1";
      if (lampGlowRef.current) lampGlowRef.current.style.opacity = "0.8";
      return;
    }

    const ctx = gsap.context(() => {
      // Master Scrubbed Timeline pinned across 300vh scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.22) setCurrentStep(1);
            else if (p < 0.48) setCurrentStep(2);
            else if (p < 0.74) setCurrentStep(3);
            else if (p < 0.9) setCurrentStep(4);
            else setCurrentStep(5);
          },
        },
      });

      // 1. Initial State: Raw concrete room (0% to 20%)

      // 2. Floor Planks click and slide in (20% to 45%)
      tl.fromTo(
        floorPlanksRef.current,
        {
          opacity: 0,
          y: 60,
          scaleY: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        0.5
      );

      // Staggered planks click snap
      const planks = floorPlanksRef.current?.querySelectorAll(".plank-item");
      if (planks && planks.length > 0) {
        tl.fromTo(
          planks,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: "back.out(1.5)" },
          0.6
        );
      }

      // 3. Wall Panels & Marble Slabs slide in (45% to 70%)
      tl.fromTo(
        wallPanelsRef.current,
        {
          x: -120,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.8,
          ease: "power3.out",
        },
        1.8
      );

      tl.fromTo(
        marbleSlabRef.current,
        {
          x: 120,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.8,
          ease: "power3.out",
        },
        2.0
      );

      // 4. Lamp lowers down and lights up (70% to 90%)
      tl.fromTo(
        lampFixtureRef.current,
        {
          y: -80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power2.out",
        },
        3.5
      );

      tl.fromTo(
        lampGlowRef.current,
        {
          opacity: 0,
          scale: 0.4,
        },
        {
          opacity: 0.9,
          scale: 1.15,
          duration: 1.5,
          ease: "power3.inOut",
        },
        4.0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Chapter Descriptions
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
      title: "Floor Planks Click Into Place",
      desc: "Waterproof stone-plastic composite planks lock with millimeter precision, eliminating structural echo.",
    },
    {
      num: "03",
      badge: "THE VERTICAL PLANE",
      title: "Walls Come Alive With Fluted Oak & Marble",
      desc: "Acoustic timber slats and high-gloss Calacatta marble slabs sculpt the room's sound and elegance.",
    },
    {
      num: "04",
      badge: "THE ATMOSPHERE",
      title: "Light Arrives With Sculptural Lampshades",
      desc: "A 3000K warm diurnal light wash bathes the room in amber radiance, illuminating rich wood textures.",
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
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-brand-black overflow-hidden flex flex-col justify-between"
    >
      {/* Dynamic Ambient Background Illumination */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-luxury"
        style={{
          background:
            currentStep >= 4
              ? "radial-gradient(circle at 50% 40%, rgba(242, 92, 5, 0.18) 0%, rgba(15, 76, 58, 0.12) 45%, #0A0B0D 85%)"
              : currentStep >= 2
              ? "radial-gradient(circle at 50% 60%, rgba(15, 76, 58, 0.15) 0%, #0A0B0D 70%)"
              : "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, #0A0B0D 80%)",
        }}
      />

      {/* Top Bar: Headline & Story Chapter Counter */}
      <div className="container mx-auto px-4 md:px-8 pt-24 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-black-elevated border border-white/15 text-[10px] font-mono tracking-widest text-brand-orange uppercase">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span>CINEMATIC ROOM TRANSFORMATION</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-light uppercase text-brand-white leading-[0.98] tracking-tight">
            {headlineLine1} <br />
            <span className="italic text-brand-sand-200">{headlineLine2}</span>
          </h1>

          <p className="text-xs sm:text-sm font-sans text-brand-sand-300 max-w-xl leading-relaxed">
            {subText}
          </p>
        </div>

        {/* Primary CTA: "Design your room" */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <MagneticButton strength={0.4}>
            <a
              href="#room-planner"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-sm bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 shadow-2xl shadow-brand-orange/30 group"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </MagneticButton>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent("Hello MarvelRise Decor, I would like to design my room and get an estimate.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-sm bg-white/5 hover:bg-white/10 text-brand-sand-200 border border-white/15 hover:border-white/30 text-xs font-mono uppercase tracking-widest transition-all duration-300"
          >
            <span>WhatsApp Estimate</span>
          </a>
        </div>
      </div>

      {/* 3D PERSPECTIVE INTERACTIVE ROOM TRANSFORMATION CANVAS */}
      <div className="relative w-full h-[58vh] md:h-[62vh] my-4 flex items-center justify-center z-10 px-4">
        <div
          ref={roomWrapperRef}
          className="relative w-full max-w-5xl h-full rounded-sm bg-brand-black-elevated/80 border border-white/15 overflow-hidden shadow-2xl will-change-transform flex items-center justify-center"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y * 0.4}deg) rotateY(${tilt.x * 0.4}deg)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {/* Subtle Room Grid & Wireframe Blueprint Coordinates */}
          <div className="absolute inset-0 bg-noise opacity-30" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />

          {/* LAYER 1: Raw Concrete Room Wireframe (Base Layer) */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-40 pointer-events-none">
            <div className="flex justify-between text-[10px] font-mono tracking-widest text-brand-black-muted">
              <span>AXIS: X+4.82 Y+2.90 Z+0.00</span>
              <span>VOLUME: 68.4 M³</span>
            </div>
            {/* Raw concrete back wall lines */}
            <div className="w-full h-full border-b border-white/10 flex items-center justify-center">
              <span className="text-[11px] font-mono text-brand-sand-500 uppercase tracking-widest">
                RAW SPATIAL VOID • CONCRETE ENCLOSURE
              </span>
            </div>
          </div>

          {/* LAYER 2: SPC Click-Lock Floor Planks (Animated In) */}
          <div
            ref={floorPlanksRef}
            className="absolute bottom-0 inset-x-0 h-44 md:h-52 bg-gradient-to-t from-[#1F1712] via-[#2A1F17] to-[#140F0C] border-t border-brand-orange/40 will-change-transform z-10 opacity-0 overflow-hidden"
          >
            {/* Planks grid */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 p-3 h-full">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="plank-item rounded-xs bg-[#3E2B1E] border-r border-black/40 shadow-inner flex flex-col justify-end p-2 relative overflow-hidden"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                >
                  <div className="absolute top-1 left-1.5 text-[8px] font-mono text-amber-200/40">
                    SPC-EIR
                  </div>
                  <span className="text-[9px] font-mono text-amber-200/60 uppercase">
                    Oak 0{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Click-lock badge */}
            <div className="absolute top-2 right-4 px-2.5 py-0.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-[9px] font-mono text-brand-orange uppercase">
              Click-Lock Planks Engaged
            </div>
          </div>

          {/* LAYER 3A: Left Wall Fluted Acoustic Timber Slat Panels */}
          <div
            ref={wallPanelsRef}
            className="absolute left-0 top-0 bottom-36 md:bottom-44 w-1/3 md:w-1/4 bg-[#1B140E] border-r border-white/20 will-change-transform z-20 opacity-0 overflow-hidden shadow-2xl"
          >
            {/* Fluted Vertical Slats */}
            <div className="flex h-full gap-1 p-2 bg-black/60">
              {[...Array(12)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-r from-[#3B281B] via-[#523A28] to-[#2B1D13] shadow-md rounded-xs"
                />
              ))}
            </div>
            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-xs bg-black/80 border border-amber-500/30 text-[8px] font-mono text-amber-300 uppercase">
              Acoustic Slat PET
            </div>
          </div>

          {/* LAYER 3B: Right Wall Monolithic UV Marble Sheet */}
          <div
            ref={marbleSlabRef}
            className="absolute right-0 top-0 bottom-36 md:bottom-44 w-1/3 md:w-1/4 bg-[#16181C] border-l border-white/20 will-change-transform z-20 opacity-0 overflow-hidden shadow-2xl flex flex-col justify-between p-4"
          >
            {/* Gold veining simulation */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 flex justify-between items-start">
              <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest">
                UV Marble Sheet
              </span>
              <span className="text-[8px] font-mono text-brand-orange">Nero & Gold</span>
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-display text-white uppercase block">
                Continuous Monolith
              </span>
              <span className="text-[8px] font-sans text-brand-sand-400">
                Scratch & Stain Barrier
              </span>
            </div>
          </div>

          {/* LAYER 4: Pendant Lampshade Fixture & Atmospheric Warm Glow */}
          <div
            ref={lampFixtureRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none opacity-0"
          >
            {/* Cord & Ceiling Rose */}
            <div className="w-[1.5px] h-16 md:h-24 bg-gradient-to-b from-white/40 to-brand-brass-dark" />
            <div className="w-5 h-2 rounded-xs bg-brand-brass" />

            {/* Brushed Brass Lampshade */}
            <div className="relative w-28 md:w-36 h-12 md:h-14 bg-gradient-to-b from-brand-brass to-brand-brass-dark rounded-t-full border border-amber-300/40 shadow-xl flex items-end justify-center pb-1">
              <div className="w-8 h-4 rounded-t-full bg-amber-100 shadow-[0_0_20px_#FFD180]" />
            </div>

            {/* Radiant Lamp Wash Glow Casting Over Floor and Walls */}
            <div
              ref={lampGlowRef}
              className="w-[380px] md:w-[560px] h-[340px] md:h-[480px] rounded-full bg-gradient-to-b from-amber-400/40 via-brand-orange/20 to-transparent blur-[70px] pointer-events-none opacity-0 -mt-4"
            />
          </div>

          {/* Center Cinematic Stage Callout */}
          <div className="absolute bottom-6 z-30 pointer-events-none text-center">
            <span className="text-[10px] font-mono tracking-[0.3em] text-brand-sand-200 uppercase bg-black/60 px-4 py-1 rounded-full border border-white/10 backdrop-blur-md">
              Scroll To Control Transformation Scene
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Story Chapter HUD / Status Bar */}
      <div className="container mx-auto px-4 md:px-8 pb-8 z-20">
        <div className="p-4 sm:p-5 rounded-sm glass-panel border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Step Counter */}
            <div className="w-10 h-10 rounded-sm bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center font-display text-lg text-brand-orange font-semibold">
              {currentMeta.num}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  ref={chapterBadgeRef}
                  className="text-[10px] font-mono tracking-widest text-brand-orange uppercase font-semibold"
                >
                  {currentMeta.badge}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] font-mono tracking-wider text-brand-sand-400 uppercase">
                  Stage {currentStep} of 5
                </span>
              </div>
              <h2
                ref={chapterTitleRef}
                className="font-display text-base sm:text-lg text-brand-white uppercase"
              >
                {currentMeta.title}
              </h2>
            </div>
          </div>

          {/* Chapter Description */}
          <p
            ref={chapterDescRef}
            className="text-xs font-sans text-brand-sand-300 max-w-md leading-relaxed"
          >
            {currentMeta.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
