"use client";

import React from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, size = 48, strokeWidth = 3.5 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let tierColor = "#10b981"; // 80+ Emerald
  let bgTrackColor = "rgba(16, 185, 129, 0.15)";
  let textColor = "text-emerald-400";
  let tierLabel = "Hot";

  if (score < 50) {
    tierColor = "#94a3b8"; // Cold
    bgTrackColor = "rgba(148, 163, 184, 0.15)";
    textColor = "text-slate-400";
    tierLabel = "Cold";
  } else if (score < 80) {
    tierColor = "#f59e0b"; // Warm
    bgTrackColor = "rgba(245, 158, 11, 0.15)";
    textColor = "text-amber-400";
    tierLabel = "Warm";
  }

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      title={`Lead Score: ${score}/100 (${tierLabel})`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgTrackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Active progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={tierColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`font-mono text-xs font-bold leading-none tabular-nums ${textColor}`}>
          {score}
        </span>
      </div>
    </div>
  );
}

