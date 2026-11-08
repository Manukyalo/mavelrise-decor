"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface BrandedLoaderProps {
  onComplete?: () => void;
}

export function BrandedLoader({ onComplete }: BrandedLoaderProps) {
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show once per session; skip if already seen or reduced motion preferred
    if (typeof window !== "undefined") {
      if (
        sessionStorage.getItem("mrd_loader_seen") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setIsDone(true);
        onComplete?.();
        return;
      }
      sessionStorage.setItem("mrd_loader_seen", "1");
    }

    // Safety failsafe: never leave the screen blank if GSAP or asset loading stalls
    const failsafe = setTimeout(() => {
      document.body.style.overflow = "";
      setIsDone(true);
      onComplete?.();
    }, 1200);

    // Lock body scroll during initial brand reveal
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(failsafe);
          document.body.style.overflow = "";
          setIsDone(true);
          onComplete?.();
        },
      });

      // SVG path line drawing - refined high-impact timing
      tl.fromTo(
        ".mrd-path",
        { strokeDashoffset: 400, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      )
        .fromTo(
          ".mrd-accent",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, stagger: 0.04, ease: "back.out(2)" },
          "-=0.2"
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          "-=0.15"
        )
        .to(
          [svgRef.current, textRef.current],
          { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" },
          "+=0.2"
        )
        .to(curtainRef.current, {
          yPercent: -100,
          duration: 0.6,
          ease: "power3.inOut",
        });
    }, containerRef);

    return () => {
      clearTimeout(failsafe);
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
      aria-hidden="true"
    >
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-brand-navy-deep flex flex-col items-center justify-center border-b border-brand-gold/30"
      >
        {/* Subtle architectural grid coordinates */}
        <div className="absolute top-8 left-8 text-[11px] font-mono tracking-widest text-brand-gold uppercase flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          <span>MARVELRISE STUDIO • 01°17′S 36°49′E</span>
        </div>

        <div className="flex flex-col items-center text-center px-6">
          {/* Architectural MRD Monogram SVG (Logo as supplied with signature orange & green focal accents) */}
          <svg
            ref={svgRef}
            className="w-28 h-28 md:w-36 md:h-36 overflow-visible mb-6"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Architectural Precision Diamond in Champagne Gold */}
            <path
              className="mrd-path"
              d="M 80 10 L 150 80 L 80 150 L 10 80 Z"
              stroke="#C8A15A"
              strokeWidth="1.5"
              strokeDasharray="400"
            />
            {/* Structural Inner Framing */}
            <path
              className="mrd-path"
              d="M 80 24 L 136 80 L 80 136 L 24 80 Z"
              stroke="rgba(200, 161, 90, 0.3)"
              strokeWidth="1"
              strokeDasharray="400"
            />

            {/* 'M' Architectural Gypsum Chevron */}
            <path
              className="mrd-path"
              d="M 44 104 L 44 56 L 62 82 L 80 56 L 98 82 L 116 56 L 116 104"
              stroke="#F6F1E7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="400"
            />

            {/* Official Logo Accents (Supplied: Orange & Green) */}
            <circle className="mrd-accent" cx="80" cy="56" r="3.5" fill="#F25C05" />
            <circle className="mrd-accent" cx="44" cy="56" r="2.5" fill="#0F4C3A" />
            <circle className="mrd-accent" cx="116" cy="56" r="2.5" fill="#0F4C3A" />
            <circle className="mrd-accent" cx="80" cy="10" r="2" fill="#C8A15A" />
            <circle className="mrd-accent" cx="80" cy="150" r="2" fill="#C8A15A" />
          </svg>

          {/* Brand Typography */}
          <div ref={textRef} className="space-y-1.5">
            <h1 className="font-display text-2xl md:text-3xl tracking-[0.2em] font-light text-brand-ivory uppercase">
              MarvelRise
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-brand-gold uppercase">
              Decor & Architectural Ceilings
            </p>
          </div>
        </div>

        {/* Bottom subtle status */}
        <div className="absolute bottom-8 right-8 text-[10px] font-mono tracking-widest text-brand-gold/60 uppercase">
          Nairobi • Kenya
        </div>
      </div>
    </div>
  );
}

