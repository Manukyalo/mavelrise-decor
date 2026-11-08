"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only run on non-touch desktop devices and when reduced motion is not preferred
    if (typeof window === "undefined") return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || isReduced) return;

    setIsVisible(true);

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;

      gsap.to(cursor, {
        x: mousePos.x,
        y: mousePos.y,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const updateRing = () => {
      cursorPos.x += (mousePos.x - cursorPos.x) * 0.15;
      cursorPos.y += (mousePos.y - cursorPos.y) * 0.15;

      if (ring) {
        ring.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
      }

      requestAnimationFrame(updateRing);
    };

    const animFrame = requestAnimationFrame(updateRing);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle interactive hover targets
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, input, textarea, [data-cursor-hover]");
      if (interactive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, input, textarea, [data-cursor-hover]");
      if (interactive) {
        setIsHovered(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Precision Core Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-brand-orange will-change-transform shadow-[0_0_10px_rgba(242,92,5,0.8)]"
      />

      {/* Floating Outer Architectural Reticle */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full border will-change-transform transition-all duration-300 ease-luxury ${
          isHovered
            ? "w-14 h-14 -ml-7 -mt-7 border-brand-orange bg-brand-orange/10 scale-110"
            : "w-10 h-10 border-white/30"
        }`}
      />
    </div>
  );
}

