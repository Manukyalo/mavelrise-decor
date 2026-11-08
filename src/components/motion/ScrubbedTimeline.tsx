"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface ScrubbedTimelineProps {
  children: React.ReactNode;
  className?: string;
  setupTimeline?: (tl: gsap.core.Timeline, container: HTMLElement) => void;
  start?: string;
  end?: string;
  scrub?: number | boolean;
}

export function ScrubbedTimeline({
  children,
  className,
  setupTimeline,
  start = "top 80%",
  end = "bottom 20%",
  scrub = 1,
}: ScrubbedTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub,
        },
      });

      if (setupTimeline) {
        setupTimeline(tl, container);
      } else {
        // Default architectural progression: fades and slides child items
        const items = container.querySelectorAll(".scrub-item");
        if (items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0.2, y: 30, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.2, ease: "power1.out" }
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [setupTimeline, start, end, scrub]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {children}
    </div>
  );
}

