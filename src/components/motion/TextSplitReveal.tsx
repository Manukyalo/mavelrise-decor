"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface TextSplitRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  wordClassName?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function TextSplitReveal({
  text,
  as: Component = "h2",
  className,
  wordClassName,
  delay = 0,
  duration = 0.9,
  stagger = 0.04,
}: TextSplitRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const targets = container.querySelectorAll(".split-word-inner");

      gsap.fromTo(
        targets,
        {
          yPercent: 110,
          rotateZ: 2,
          opacity: 0,
        },
        {
          yPercent: 0,
          rotateZ: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration, stagger]);

  return (
    <div ref={containerRef} className={cn("inline-block overflow-hidden", className)}>
      <Component className="flex flex-wrap gap-x-[0.25em] gap-y-1">
        {words.map((word, idx) => (
          <span key={idx} className="inline-block overflow-hidden pb-1">
            <span
              className={cn(
                "split-word-inner inline-block will-change-transform",
                wordClassName
              )}
            >
              {word}
            </span>
          </span>
        ))}
      </Component>
    </div>
  );
}
