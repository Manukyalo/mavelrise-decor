"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface PinnedSceneProps {
  children: React.ReactNode;
  pinSpacing?: boolean;
  pinDuration?: string; // e.g. "+=100%" or "+=800px"
  className?: string;
  onProgress?: (progress: number) => void;
}

export function PinnedScene({
  children,
  pinSpacing = true,
  pinDuration = "+=100%",
  className,
  onProgress,
}: PinnedSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    const pinElement = pinRef.current;
    if (!container || !pinElement) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: pinDuration,
        pin: pinElement,
        pinSpacing,
        scrub: true,
        onUpdate: (self) => {
          onProgress?.(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [pinSpacing, pinDuration, onProgress]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div ref={pinRef} className="w-full">
        {children}
      </div>
    </div>
  );
}

