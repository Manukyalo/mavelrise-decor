"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

interface PageTransitionProps {
  children: React.ReactNode;
}

// Routes that render full-viewport app shells — skip the y-transform here
// because any CSS transform on a parent breaks `position: fixed` children.
// The planner shell uses height-based layout instead, so it doesn't need this.
const TRANSFORM_FREE_ROUTES = ["/planner"];

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const isTransformFree = TRANSFORM_FREE_ROUTES.some((r) => pathname.includes(r));

  useEffect(() => {
    if (isTransformFree) return; // planner: no transform — avoids fixed-position stacking context bug

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    gsap.fromTo(
      element,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
  }, [pathname, isTransformFree]);

  return <div ref={containerRef}>{children}</div>;
}

