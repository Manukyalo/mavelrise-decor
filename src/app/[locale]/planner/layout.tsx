import React from "react";

/**
 * Planner route layout segment.
 *
 * The global locale layout wraps every page in <PageTransition> which applies
 * a GSAP translateY transform on mount. Any element with `position: fixed`
 * inside a transformed ancestor is positioned relative to THAT ancestor, not
 * the viewport — so the planner shell becomes invisible / clipped to 0 height.
 *
 * This segment layout prevents that by:
 *   1. Wrapping children in a plain div with `overflow-hidden` so the shell's
 *      height-based layout works without fighting the page flow.
 *   2. The shell itself will use `h-[calc(100dvh-72px)]` (relative, not fixed)
 *      so transform on the PageTransition wrapper doesn't break it.
 *
 * We deliberately DO NOT render <Footer> here — the planner fills the viewport
 * and a footer below it makes no sense.
 */
export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // overflow-hidden prevents any stray scrollbar from the full-viewport shell
    <div className="overflow-hidden">
      {children}
    </div>
  );
}

