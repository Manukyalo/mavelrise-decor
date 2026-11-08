"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface MultiLayerParallaxProps {
  className?: string;
  backgroundContent: React.ReactNode;
  midgroundContent: React.ReactNode;
  foregroundContent?: React.ReactNode;
  bgSpeed?: number; // e.g. -100 to 100 px or percent
  midSpeed?: number;
  fgSpeed?: number;
}

export function MultiLayerParallax({
  className,
  backgroundContent,
  midgroundContent,
  foregroundContent,
  bgSpeed = -60,
  midSpeed = 40,
  fgSpeed = 90,
}: MultiLayerParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Parallax timeline bound to scroll scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Smooth lag scrub
        },
      });

      if (bgRef.current) {
        tl.to(bgRef.current, { y: bgSpeed, ease: "none" }, 0);
      }
      if (midRef.current) {
        tl.to(midRef.current, { y: midSpeed, ease: "none" }, 0);
      }
      if (fgRef.current) {
        tl.to(fgRef.current, { y: fgSpeed, ease: "none" }, 0);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [bgSpeed, midSpeed, fgSpeed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden w-full will-change-transform", className)}
    >
      {/* Background Layer (deepest, moves slowest) */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none will-change-transform z-0">
        {backgroundContent}
      </div>

      {/* Midground Layer (structural content) */}
      <div ref={midRef} className="relative z-10 will-change-transform">
        {midgroundContent}
      </div>

      {/* Foreground Layer (closest, floats fastest) */}
      {foregroundContent && (
        <div
          ref={fgRef}
          className="absolute inset-0 pointer-events-none z-20 will-change-transform"
        >
          {foregroundContent}
        </div>
      )}
    </div>
  );
}
