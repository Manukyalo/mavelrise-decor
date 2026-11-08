"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const span = spanRef.current;
    if (!span) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      span.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      return;
    }

    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: value,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: span,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (span) {
            span.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
          }
        },
      });
    }, spanRef);

    return () => ctx.revert();
  }, [value, decimals, prefix, suffix, duration]);

  return (
    <span ref={spanRef} className={cn("tabular-nums inline-block font-mono", className)}>
      {prefix}0{suffix}
    </span>
  );
}
