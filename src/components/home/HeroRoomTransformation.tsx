"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTilt } from "@/hooks/useTilt";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

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
  subText = "Witness raw spatial concrete transformed in real time: acoustic French oak floor planks snap into place, fluted timber walls lock in, and warm champagne illumination bathes the room.",
}: HeroRoomTransformationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const floorPlanksRef = useRef<HTMLDivElement>(null);
  const wallPanelsRef = useRef<HTMLDivElement>(null);
  const marbleSlabRef = useRef<HTMLDivElement>(null);
  const lampFixtureRef = useRef<HTMLDivElement>(null);
  const lampGlowRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const tilt = useTilt(5);

  const setStepState = useCallback((step: number) => {
    setCurrentStep(step);

    const floor = floorPlanksRef.current;
    const walls = wallPanelsRef.current;
    const marble = marbleSlabRef.current;
    const lamp = lampFixtureRef.current;
    const glow = lampGlowRef.current;
    const ambient = ambientRef.current;

    // Guard: if refs not ready, still update step state so CSS fallback renders correctly
    if (!floor || !walls || !marble || !lamp || !glow) return;

    if (step === 1) {
      gsap.to(floor, { opacity: 0, y: 60, duration: 0.6, ease: "power2.out" });
      gsap.to(walls, { opacity: 0, x: -80, duration: 0.6, ease: "power2.out" });
      gsap.to(marble, { opacity: 0, x: 80, duration: 0.6, ease: "power2.out" });
      gsap.to(lamp, { opacity: 0, y: -50, duration: 0.5, ease: "power2.out" });
      gsap.to(glow, { opacity: 0, scale: 0.4, duration: 0.5 });
      if (ambient) gsap.to(ambient, { backgroundColor: "rgba(11,27,51,0)", duration: 0.8 });
    } else if (step === 2) {
      gsap.to(floor, { opacity: 1, y: 0, duration: 0.75, ease: "back.out(1.3)" });
      gsap.to(walls, { opacity: 0, x: -80, duration: 0.4 });
      gsap.to(marble, { opacity: 0, x: 80, duration: 0.4 });
      gsap.to(lamp, { opacity: 0, y: -50, duration: 0.4 });
      gsap.to(glow, { opacity: 0, scale: 0.4, duration: 0.4 });
    } else if (step === 3) {
      gsap.to(floor, { opacity: 1, y: 0, duration: 0.4 });
      gsap.to(walls, { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" });
      gsap.to(marble, { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.1 });
      gsap.to(lamp, { opacity: 0, y: -50, duration: 0.4 });
      gsap.to(glow, { opacity: 0, scale: 0.4, duration: 0.4 });
    } else if (step === 4) {
      gsap.to(floor, { opacity: 1, y: 0, duration: 0.3 });
      gsap.to(walls, { opacity: 1, x: 0, duration: 0.3 });
      gsap.to(marble, { opacity: 1, x: 0, duration: 0.3 });
      gsap.to(lamp, { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" });
      gsap.to(glow, { opacity: 0.9, scale: 1.1, duration: 0.9, ease: "power3.out", delay: 0.25 });
      if (ambient) gsap.to(ambient, { opacity: 1, duration: 1 });
    } else {
      gsap.to(floor, { opacity: 1, y: 0, duration: 0.3 });
      gsap.to(walls, { opacity: 1, x: 0, duration: 0.3 });
      gsap.to(marble, { opacity: 1, x: 0, duration: 0.3 });
      gsap.to(lamp, { opacity: 1, y: 0, duration: 0.3 });
      gsap.to(glow, { opacity: 1, scale: 1.25, duration: 0.9, ease: "power3.out" });
      if (ambient) gsap.to(ambient, { opacity: 1, duration: 1 });
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

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 15%",
      end: "bottom 25%",
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.2) setStepState(1);
        else if (p < 0.42) setStepState(2);
        else if (p < 0.65) setStepState(3);
        else if (p < 0.85) setStepState(4);
        else setStepState(5);
      },
    });

    return () => { st.kill(); };
  }, [setStepState]);

  const chapters = [
    { num: "01", badge: "THE VOID", label: "Raw Canvas" },
    { num: "02", badge: "THE FOUNDATION", label: "Floor Planks" },
    { num: "03", badge: "THE VERTICAL PLANE", label: "Walls & Marble" },
    { num: "04", badge: "THE ATMOSPHERE", label: "Light Arrives" },
    { num: "05", badge: "THE SANCTUARY", label: "Finished Room" },
  ];

  const stepCopy = [
    {
      title: "The Empty, Ordinary Room",
      desc: "Cold concrete, flat acoustics, unshaped volume. This is where every transformation begins.",
    },
    {
      title: "Floor Planks Click Into Place",
      desc: "Waterproof SPC planks in French Oak lock with millimeter precision, eliminating structural echo underfoot.",
    },
    {
      title: "Walls Come Alive With Fluted Oak & UV Marble",
      desc: "Acoustic timber slats and high-gloss Calacatta marble slabs sculpt the room's sound and elegance simultaneously.",
    },
    {
      title: "Light Arrives With Champagne Pendants",
      desc: "A 3000K warm diurnal wash bathes the room in champagne radiance, revealing every wood grain and stone vein.",
    },
    {
      title: "The Finished Architectural Sanctuary",
      desc: "A complete transformation engineered for timeless permanence. This is what MarvelRise Decor builds for you.",
    },
  ];

  const currentMeta = stepCopy[currentStep - 1] || stepCopy[0];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-brand-navy overflow-hidden"
    >
      {/* Warm ambient overlay — grows with lamp stages */}
      <div
        ref={ambientRef}
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          opacity: currentStep >= 4 ? 1 : 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(200,161,90,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Animated navy→gold background shift per step */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          background:
            currentStep >= 4
              ? "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(200,161,90,0.15) 0%, #0B1B33 65%)"
              : currentStep >= 2
                ? "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,161,90,0.07) 0%, #0B1B33 75%)"
                : "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(255,255,255,0.03) 0%, #0B1B33 85%)",
        }}
      />
      {/* ── TOP HEADER ───────────────────────────────────────────────── */}
      <div className="relative z-20 container mx-auto px-4 md:px-8 pt-28 sm:pt-32 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy-elevated border border-brand-gold/30 text-[10px] font-mono tracking-widest text-brand-gold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            <span>Cinematic Room Transformation · Live</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-light uppercase text-brand-ivory leading-[0.95] tracking-tight">
            {headlineLine1}
            <br />
            <span className="italic text-brand-gold">{headlineLine2}</span>
          </h1>

          <p className="text-sm font-sans text-brand-ivory/65 max-w-xl leading-relaxed">
            {subText}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <MagneticButton strength={0.4}>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 shadow-xl shadow-brand-gold/25 group"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </MagneticButton>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent("Hello MarvelRise Decor, I would like to design my room.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3.5 rounded-sm bg-brand-navy-card hover:bg-brand-navy-light text-brand-ivory border border-brand-gold/25 hover:border-brand-gold text-xs font-mono uppercase tracking-widest transition-all duration-300"
          >
            WhatsApp Estimate
          </a>
        </div>
      </div>

      {/* ── ROOM CANVAS ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-4 md:px-8 container mx-auto">
        <div
          className="relative w-full h-[300px] sm:h-[380px] md:h-[460px] rounded-sm overflow-hidden border border-brand-gold/20 shadow-2xl will-change-transform"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.y * 0.3}deg) rotateY(${tilt.x * 0.3}deg)`,
            transition: "transform 0.18s ease-out",
            background: "linear-gradient(180deg, #0B1222 0%, #101A2D 60%, #0D1620 100%)",
          }}
        >
          {/* ── BASE LAYER: Bare concrete walls always visible ── */}
          <div className="absolute inset-0 z-0">
            {/* Back wall — rough concrete texture via CSS */}
            <div
              className="absolute inset-x-0 top-0"
              style={{
                height: "72%",
                background:
                  "linear-gradient(180deg, #1A1F2B 0%, #141B28 60%, #0F1520 100%)",
                borderBottom: "1px solid rgba(200,161,90,0.08)",
              }}
            >
              {/* Concrete texture lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(200,161,90,0.12) 28px, rgba(200,161,90,0.12) 29px)",
                }}
              />
            </div>
            {/* Floor base — always visible dark concrete slab */}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "30%",
                background: "linear-gradient(180deg, #0A1018 0%, #060D16 100%)",
              }}
            >
              {/* Raw concrete texture on bare floor */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 40% 20% at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(ellipse 30% 15% at 70% 60%, rgba(255,255,255,0.03) 0%, transparent 50%)",
                }}
              />
            </div>
            {/* Ceiling line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
            {/* Floor/wall meeting line */}
            <div
              className="absolute inset-x-0 h-[1px] bg-brand-gold/10"
              style={{ top: "71%" }}
            />
            {/* Left corner shadow */}
            <div
              className="absolute top-0 bottom-0 left-0 w-16 opacity-60"
              style={{
                background: "linear-gradient(90deg, #060D16 0%, transparent 100%)",
              }}
            />
            {/* Right corner shadow */}
            <div
              className="absolute top-0 bottom-0 right-0 w-16 opacity-60"
              style={{
                background: "linear-gradient(270deg, #060D16 0%, transparent 100%)",
              }}
            />
            {/* Blueprint grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(200,161,90,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,161,90,1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
            {/* Top status bar */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="text-[9px] font-mono text-brand-gold/40 uppercase tracking-widest">
                AXIS X+4.82 · Y+2.90 · Z+0.00
              </span>
              <span className="text-[9px] font-mono text-brand-gold/40 uppercase tracking-widest">
                VOL 68.4 M³ · NAIROBI, KE
              </span>
            </div>
          </div>

          {/* ── LAYER 2: SPC FRENCH OAK FLOOR PLANKS ── */}
          <div
            ref={floorPlanksRef}
            className="absolute inset-x-0 bottom-0 z-20 transition-all duration-700"
            style={{
              height: "32%",
              opacity: currentStep >= 2 ? 1 : 0,
              transform: currentStep >= 2 ? "translateY(0px)" : "translateY(60px)",
            }}
          >
            <div
              className="w-full h-full relative overflow-hidden border-t border-brand-gold/50"
              style={{
                background:
                  "linear-gradient(180deg, #3D2512 0%, #2A180D 50%, #1C100A 100%)",
              }}
            >
              {/* Plank board rows */}
              {[...Array(4)].map((_, row) => (
                <div
                  key={row}
                  className="absolute flex gap-[2px]"
                  style={{
                    top: `${row * 25}%`,
                    left: 0,
                    right: 0,
                    height: "24%",
                  }}
                >
                  {[...Array(10)].map((_, col) => (
                    <div
                      key={col}
                      className="flex-1 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, 
                          hsl(${25 + (col * 3 + row * 7) % 15}, ${50 + (col + row) % 15}%, ${16 + (col + row * 2) % 10}%) 0%, 
                          hsl(${20 + (col * 5 + row * 3) % 12}, ${45 + (col + row) % 12}%, ${14 + col % 8}%) 100%)`,
                        borderRight: "1px solid rgba(0,0,0,0.5)",
                        borderBottom: "1px solid rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Wood grain lines */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255,255,255,0.025) 7px, rgba(255,255,255,0.025) 8px)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
              {/* Click-lock indicator badge */}
              <div className="absolute top-2 right-3 px-2 py-0.5 rounded-full bg-brand-gold/25 border border-brand-gold/50 text-[8px] font-mono text-brand-gold uppercase font-semibold tracking-wider">
                French Oak SPC · Click-Lock Engaged
              </div>
              {/* Perspective depth highlight */}
              <div
                className="absolute inset-x-0 top-0 h-4 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(200,161,90,0.15) 0%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* ── LAYER 3A: LEFT WALL — FLUTED ACOUSTIC TIMBER SLATS ── */}
          <div
            ref={wallPanelsRef}
            className="absolute left-0 top-0 z-30 transition-all duration-700"
            style={{
              width: "22%",
              bottom: "30%",
              opacity: currentStep >= 3 ? 1 : 0,
              transform: currentStep >= 3 ? "translateX(0px)" : "translateX(-80px)",
            }}
          >
            <div
              className="w-full h-full relative overflow-hidden border-r border-brand-gold/30 shadow-2xl"
              style={{
                background:
                  "linear-gradient(90deg, #100C07 0%, #1A1208 50%, #221508 100%)",
              }}
            >
              {/* Fluted slats */}
              <div className="flex h-full gap-[3px] p-2">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-xs"
                    style={{
                      background: `linear-gradient(90deg, 
                        hsl(${25 + (i * 2) % 10}, ${40 + i % 15}%, ${12 + (i * 2) % 8}%) 0%, 
                        hsl(${22 + (i * 3) % 8}, ${35 + i % 12}%, ${15 + i % 10}%) 50%,
                        hsl(${20 + (i) % 6}, ${30 + i % 10}%, ${10 + (i * 2) % 6}%) 100%)`,
                      boxShadow:
                        i % 2 === 0
                          ? "inset 1px 0 0 rgba(200,161,90,0.08)"
                          : "none",
                    }}
                  />
                ))}
              </div>
              {/* Label */}
              <div className="absolute bottom-3 left-2 right-2 text-center">
                <span className="text-[8px] font-mono text-brand-gold/70 uppercase tracking-wider bg-brand-navy-deep/80 px-2 py-0.5 rounded-xs">
                  Acoustic Slat · PET
                </span>
              </div>
            </div>
          </div>

          {/* ── LAYER 3B: RIGHT WALL — MONOLITHIC UV MARBLE SHEET ── */}
          <div
            ref={marbleSlabRef}
            className="absolute right-0 top-0 z-30 transition-all duration-700"
            style={{
              width: "22%",
              bottom: "30%",
              opacity: currentStep >= 3 ? 1 : 0,
              transform: currentStep >= 3 ? "translateX(0px)" : "translateX(80px)",
            }}
          >
            <div
              className="w-full h-full relative overflow-hidden border-l border-brand-gold/30 shadow-2xl"
              style={{
                background:
                  "linear-gradient(90deg, #E8E0D0 0%, #D4CAB8 30%, #E6DDD0 60%, #C8BEA8 100%)",
              }}
            >
              {/* Marble veining */}
              <svg
                className="absolute inset-0 w-full h-full opacity-70"
                viewBox="0 0 100 200"
                preserveAspectRatio="none"
              >
                <path
                  d="M20 0 Q35 40 25 80 Q15 120 30 160 Q40 190 35 200"
                  stroke="rgba(140,120,90,0.4)"
                  strokeWidth="0.8"
                  fill="none"
                />
                <path
                  d="M55 0 Q65 50 50 90 Q40 130 60 170 Q70 190 65 200"
                  stroke="rgba(100,85,65,0.3)"
                  strokeWidth="0.5"
                  fill="none"
                />
                <path
                  d="M80 10 Q70 50 85 90 Q95 130 75 160"
                  stroke="rgba(140,120,90,0.25)"
                  strokeWidth="0.6"
                  fill="none"
                />
                <path
                  d="M10 50 Q40 60 30 100 Q25 130 50 150"
                  stroke="rgba(180,160,120,0.2)"
                  strokeWidth="0.4"
                  fill="none"
                />
              </svg>
              {/* Dark overlay to blend with navy theme */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(16,25,38,0.5) 0%, rgba(16,25,38,0.2) 50%, rgba(16,25,38,0.4) 100%)",
                }}
              />
              {/* Label */}
              <div className="absolute bottom-3 left-2 right-2 text-center">
                <span className="text-[8px] font-mono text-brand-gold uppercase tracking-wider bg-brand-navy-deep/80 px-2 py-0.5 rounded-xs">
                  Calacatta UV Marble
                </span>
              </div>
              <div className="absolute top-3 right-2 text-[8px] font-mono text-brand-gold/80 font-bold">
                Nero &amp; Gold
              </div>
            </div>
          </div>

          {/* ── LAYER 4: PENDANT LAMP + WARM GLOW ── */}
          <div
            ref={lampFixtureRef}
            className="absolute left-1/2 top-0 z-40 pointer-events-none transition-all duration-700"
            style={{
              transform: currentStep >= 4 ? "translate(-50%, 0px)" : "translate(-50%, -50px)",
              opacity: currentStep >= 4 ? 1 : 0,
            }}
          >
            <div className="flex flex-col items-center">
              {/* Cord */}
              <div
                className="w-[1.5px] bg-gradient-to-b from-brand-gold/30 to-brand-gold"
                style={{ height: "clamp(40px, 8vh, 72px)" }}
              />
              {/* Canopy */}
              <div className="w-5 h-1.5 rounded-xs bg-brand-gold opacity-80" />
              {/* Shade body */}
              <div
                className="relative flex items-end justify-center pb-1"
                style={{
                  width: "clamp(80px, 10vw, 120px)",
                  height: "clamp(32px, 4vh, 48px)",
                  background:
                    "linear-gradient(180deg, #C8A15A 0%, #8F6E32 70%, #704F1E 100%)",
                  borderRadius: "50% 50% 10% 10% / 20% 20% 10% 10%",
                  border: "1px solid rgba(200,161,90,0.6)",
                  boxShadow: "0 4px 20px rgba(200,161,90,0.4)",
                }}
              >
                {/* Bulb glow dot */}
                <div
                  style={{
                    width: 20,
                    height: 10,
                    borderRadius: "50%",
                    background: "#FFF5D0",
                    boxShadow:
                      "0 0 18px 6px rgba(255,235,160,0.9), 0 0 40px 12px rgba(200,161,90,0.5)",
                  }}
                />
              </div>
              {/* Warm cone light spread */}
              <div
                ref={lampGlowRef}
                className="pointer-events-none transition-all duration-900"
                style={{
                  marginTop: -8,
                  width: "clamp(200px, 40vw, 440px)",
                  height: "clamp(180px, 32vh, 380px)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at top, rgba(255,220,100,0.35) 0%, rgba(200,161,90,0.2) 35%, transparent 70%)",
                  filter: "blur(28px)",
                  opacity: currentStep >= 4 ? 0.9 : 0,
                  transform: currentStep >= 4 ? "scale(1.1)" : "scale(0.4)",
                }}
              />
            </div>
          </div>

          {/* Chapter badge overlay — always visible in canvas */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-brand-navy-deep/80 border border-brand-gold/30 backdrop-blur-sm text-[9px] font-mono text-brand-gold uppercase tracking-widest font-semibold">
              {chapters[currentStep - 1]?.badge ?? "THE VOID"} · STAGE {currentStep} OF 5
            </div>
          </div>

          {/* Bottom vignette */}
          <div
            className="absolute inset-x-0 bottom-0 h-8 z-50 pointer-events-none"
            style={{
              background:
                "linear-gradient(0deg, rgba(11,27,51,0.6) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* ── STAGE CONTROLS & STATUS ─────────────────────────────────── */}
      <div className="relative z-20 container mx-auto px-4 md:px-8 pt-6 pb-14 space-y-4">
        {/* Stage pill buttons */}
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          {chapters.map((ch, idx) => (
            <button
              key={ch.num}
              type="button"
              onClick={() => setStepState(idx + 1)}
              className={cn(
                "px-3.5 py-1.5 rounded-xs text-[11px] font-mono uppercase tracking-wider transition-all duration-200 border",
                currentStep === idx + 1
                  ? "bg-brand-gold border-brand-gold text-brand-navy font-bold shadow-lg shadow-brand-gold/25"
                  : "bg-brand-navy-card border-brand-gold/20 text-brand-ivory/60 hover:border-brand-gold/50 hover:text-brand-ivory"
              )}
            >
              {ch.num} · {ch.label}
            </button>
          ))}
        </div>

        {/* Current step info card */}
        <div className="p-4 sm:p-5 rounded-sm bg-brand-navy-card/80 border border-brand-gold/20 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-brand-gold/15 border border-brand-gold/35 flex items-center justify-center font-display text-lg text-brand-gold font-bold shrink-0">
              {chapters[currentStep - 1]?.num ?? "01"}
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-semibold mb-0.5">
                {chapters[currentStep - 1]?.badge}
              </p>
              <h2 className="font-display text-sm sm:text-base text-brand-ivory uppercase leading-tight">
                {currentMeta.title}
              </h2>
            </div>
          </div>
          <p className="text-xs font-sans text-brand-ivory/70 max-w-sm leading-relaxed">
            {currentMeta.desc}
          </p>
        </div>
      </div>
    </section>
  );
}
