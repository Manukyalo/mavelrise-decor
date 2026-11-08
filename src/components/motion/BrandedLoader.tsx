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
    // Check reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDone(true);
      onComplete?.();
      return;
    }

    // Lock body scroll during initial brand reveal
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setIsDone(true);
          onComplete?.();
        },
      });

      // SVG path line drawing
      tl.fromTo(
        ".mrd-path",
        { strokeDashoffset: 400, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: "power3.inOut" }
      )
        .fromTo(
          ".mrd-accent",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2)" },
          "-=0.4"
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        )
        .to(
          [svgRef.current, textRef.current],
          { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" },
          "+=0.4"
        )
        .to(curtainRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        });
    }, containerRef);

    return () => {
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
        className="absolute inset-0 bg-brand-black flex flex-col items-center justify-center border-b border-brand-orange/20"
      >
        {/* Subtle architectural grid coordinates */}
        <div className="absolute top-8 left-8 text-[11px] font-mono tracking-widest text-brand-black-muted uppercase flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span>MARVELRISE STUDIO • 01°17′S 36°49′E</span>
        </div>

        <div className="flex flex-col items-center text-center px-6">
          {/* Architectural MRD Monogram SVG */}
          <svg
            ref={svgRef}
            className="w-28 h-28 md:w-36 md:h-36 overflow-visible mb-6"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Architectural Precision Diamond */}
            <path
              className="mrd-path"
              d="M 80 10 L 150 80 L 80 150 L 10 80 Z"
              stroke="#23272E"
              strokeWidth="1.5"
              strokeDasharray="400"
            />
            {/* Structural Inner Framing */}
            <path
              className="mrd-path"
              d="M 80 24 L 136 80 L 80 136 L 24 80 Z"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
              strokeDasharray="400"
            />

            {/* 'M' Architectural Gypsum Chevron */}
            <path
              className="mrd-path"
              d="M 44 104 L 44 56 L 62 82 L 80 56 L 98 82 L 116 56 L 116 104"
              stroke="#FAF9F5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="400"
            />

            {/* Precision Focal Accents */}
            <circle className="mrd-accent" cx="80" cy="56" r="3.5" fill="#F25C05" />
            <circle className="mrd-accent" cx="44" cy="56" r="2.5" fill="#0F4C3A" />
            <circle className="mrd-accent" cx="116" cy="56" r="2.5" fill="#0F4C3A" />
            <circle className="mrd-accent" cx="80" cy="10" r="2" fill="#FAF9F5" />
            <circle className="mrd-accent" cx="80" cy="150" r="2" fill="#FAF9F5" />
          </svg>

          {/* Brand Typography */}
          <div ref={textRef} className="space-y-1.5">
            <h1 className="font-display text-2xl md:text-3xl tracking-[0.2em] font-light text-brand-white uppercase">
              MarvelRise
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-brand-sand-300 uppercase">
              Decor & Architectural Ceilings
            </p>
          </div>
        </div>

        {/* Bottom subtle status */}
        <div className="absolute bottom-8 right-8 text-[10px] font-mono tracking-widest text-brand-black-muted uppercase">
          Nairobi • Kenya
        </div>
      </div>
    </div>
  );
}
