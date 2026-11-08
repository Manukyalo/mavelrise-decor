"use client";

import { useEffect, useState, useRef } from "react";

interface TiltValues {
  x: number;
  y: number;
}

export function useTilt(intensity: number = 15) {
  const [tilt, setTilt] = useState<TiltValues>({ x: 0, y: 0 });
  const isReducedMotion = useRef(false);

  useEffect(() => {
    // Respect user reduced-motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotion.current = mediaQuery.matches;

    if (mediaQuery.matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    // Smoothly animate towards target tilt
    const tick = () => {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);

      setTilt({
        x: Math.round(currentX * 100) / 100,
        y: Math.round(currentY * 100) / 100,
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Desktop: Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / innerHeight) * 2 - 1;

      targetX = normalizedX * intensity;
      targetY = normalizedY * intensity;
    };

    // Mobile: Device gyroscope tilt where supported
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right [-90, 90], beta: front-to-back [-180, 180]
        const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
        const clampedBeta = Math.max(-30, Math.min(30, e.beta - 45)); // assume holding phone at ~45 deg

        targetX = (clampedGamma / 30) * intensity;
        targetY = (clampedBeta / 30) * intensity;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleDeviceOrientation, {
        passive: true,
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if ("DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
    };
  }, [intensity]);

  return tilt;
}
