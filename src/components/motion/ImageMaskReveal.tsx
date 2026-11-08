"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface ImageMaskRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left-to-right" | "bottom-to-top" | "center-expand";
  curtainColor?: string;
  duration?: number;
  delay?: number;
}

export function ImageMaskReveal({
  children,
  className,
  direction = "left-to-right",
  curtainColor = "#0F4C3A", // Architectural emerald accent
  duration = 1.1,
  delay = 0,
}: ImageMaskRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    const curtain = curtainRef.current;
    const media = mediaRef.current;
    if (!container || !curtain || !media) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      if (direction === "left-to-right") {
        tl.fromTo(
          curtain,
          { scaleX: 1, transformOrigin: "right center" },
          { scaleX: 0, duration, delay, ease: "power4.inOut" }
        ).fromTo(
          media,
          { scale: 1.15, filter: "brightness(0.7)" },
          { scale: 1, filter: "brightness(1)", duration: duration * 1.2, ease: "power3.out" },
          `-=${duration * 0.9}`
        );
      } else if (direction === "bottom-to-top") {
        tl.fromTo(
          curtain,
          { scaleY: 1, transformOrigin: "center top" },
          { scaleY: 0, duration, delay, ease: "power4.inOut" }
        ).fromTo(
          media,
          { scale: 1.15 },
          { scale: 1, duration: duration * 1.2, ease: "power3.out" },
          `-=${duration * 0.9}`
        );
      } else {
        tl.fromTo(
          container,
          { clipPath: "inset(20% 20% 20% 20%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration, delay, ease: "power4.inOut" }
        ).fromTo(
          media,
          { scale: 1.12 },
          { scale: 1, duration: duration * 1.2, ease: "power3.out" },
          `-=${duration}`
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [direction, duration, delay]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden w-full h-full", className)}
    >
      <div ref={mediaRef} className="w-full h-full will-change-transform">
        {children}
      </div>

      {direction !== "center-expand" && (
        <div
          ref={curtainRef}
          className="absolute inset-0 z-20 pointer-events-none will-change-transform"
          style={{ backgroundColor: curtainColor }}
        />
      )}
    </div>
  );
}

