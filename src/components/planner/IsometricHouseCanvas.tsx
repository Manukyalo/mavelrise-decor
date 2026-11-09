"use client";

// ─────────────────────────────────────────────────────────────────────────────
// IsometricHouseCanvas — Architectural Dollhouse Cutaway 2D Canvas Engine
//
// Inspired by luxury architectural dollhouses & MarvelRise interior references:
//   - 30° Orthographic isometric cutaway of the full house layout
//   - Low-cut interior walls with champagne gold architectural coping
//   - Full-height back & side framing walls with dark charcoal cladding
//   - Warm incandescent floor illumination pools (2700K ambient lighting)
//   - Low-poly architectural furniture silhouettes (beds, sofas, tables, counters)
//   - Natural wood/SPC plank texture with micro-bevels & click-lock animation
//   - Floating hairline leader labels with room dimensions
//   - Interactive 90° snap rotation & mini top-down schematic toggle
//   - Pure Canvas 2D: smooth 60fps on mobile/Android with zero heavy WebGL traps
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { Room, SpcColor, QualityTier, PlankLayout, MeasurementUnit } from "@/lib/planner/types";

// ── Projection Constants ──────────────────────────────────────────────────────
const ISO_ANGLE = 30; // degrees from horizontal
const ISO_X_RATIO = Math.cos((ISO_ANGLE * Math.PI) / 180);
const ISO_Y_RATIO = Math.sin((ISO_ANGLE * Math.PI) / 180);

const WALL_HEIGHT_LOW = 0.22;  // Low front and interior partition walls
const WALL_HEIGHT_TALL = 0.78; // Tall back/side framing exterior walls
const PLINTH_DEPTH = 0.42;     // Foundation podium depth

// ── Typography ────────────────────────────────────────────────────────────────
const LABEL_FONT = "'Cormorant Garamond', Georgia, serif";
const MONO_FONT = "'JetBrains Mono', monospace";

export interface IsometricCanvasRef {
  triggerPlankAnimation(layouts: PlankLayout[], colorMap: Record<string, SpcColor>): void;
  skipAnimation(): void;
  replayAnimation(): void;
  setView(mode: "iso" | "top"): void;
  setRotation(angle: 0 | 90 | 180 | 270): void;
  exportPng(): string;
}

interface Props {
  rooms: Room[];
  colorMap: Record<string, SpcColor>;
  qualityTier: QualityTier;
  viewMode?: "iso" | "top";
  zoom?: number;
  rotation?: 0 | 90 | 180 | 270;
  showFurniture?: boolean;
  unit?: MeasurementUnit;
  onPlankProgress?: (laid: number, total: number) => void;
  onAnimationComplete?: () => void;
  onToggleViewMode?: () => void;
  className?: string;
}

// ── Color Utilities ───────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  return [r, g, b];
}

function darken(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
}

function lighten(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const lr = Math.min(255, Math.round(r + (255 - r) * factor));
  const lg = Math.min(255, Math.round(g + (255 - g) * factor));
  const lb = Math.min(255, Math.round(b + (255 - b) * factor));
  return `rgb(${lr},${lg},${lb})`;
}

// ── 3D Projection with Centered 90° Rotation ──────────────────────────────────
function projectPoint(
  worldX: number,
  worldY: number,
  worldZ: number,
  scale: number,
  ox: number,
  oy: number,
  mode: "iso" | "top",
  rotation: 0 | 90 | 180 | 270,
  cx: number,
  cy: number
): [number, number] {
  // Rotate around house center (cx, cy)
  let rx = worldX;
  let ry = worldY;

  if (rotation === 90) {
    rx = cx + (worldY - cy);
    ry = cy - (worldX - cx);
  } else if (rotation === 180) {
    rx = cx - (worldX - cx);
    ry = cy - (worldY - cy);
  } else if (rotation === 270) {
    rx = cx - (worldY - cy);
    ry = cy + (worldX - cx);
  }

  if (mode === "top") {
    return [rx * scale + ox, ry * scale + oy];
  }

  // Standard 30° orthographic isometric
  const sx = (rx - ry) * ISO_X_RATIO * scale + ox;
  const sy = (rx + ry) * ISO_Y_RATIO * scale - worldZ * scale + oy;
  return [sx, sy];
}

export const IsometricHouseCanvas = forwardRef<IsometricCanvasRef, Props>(
  function IsometricHouseCanvas(
    {
      rooms,
      colorMap,
      qualityTier,
      viewMode = "iso",
      zoom = 1,
      rotation = 0,
      showFurniture = true,
      unit = "m",
      onPlankProgress,
      onAnimationComplete,
      onToggleViewMode,
      className = "",
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewModeRef = useRef<"iso" | "top">(viewMode);
    const zoomRef = useRef(zoom);
    const rotationRef = useRef<0 | 90 | 180 | 270>(rotation);
    const showFurnitureRef = useRef(showFurniture);

    const animRef = useRef<number | null>(null);
    const animStateRef = useRef<{
      active: boolean;
      layouts: PlankLayout[];
      colorMap: Record<string, SpcColor>;
      roomIndex: number;
      plankIndex: number;
      laid: number;
      total: number;
      drawnPlanks: Array<{ roomId: string; plankIndex: number }>;
    } | null>(null);

    // ── Calculate House Center & Bounding Box ────────────────────────────────
    const getHouseBounds = useCallback(() => {
      if (rooms.length === 0) {
        return { minX: 0, minY: 0, maxX: 10, maxY: 10, cx: 5, cy: 5, spanX: 10, spanY: 10 };
      }
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const r of rooms) {
        minX = Math.min(minX, r.gridX);
        minY = Math.min(minY, r.gridY);
        maxX = Math.max(maxX, r.gridX + r.widthM);
        maxY = Math.max(maxY, r.gridY + r.lengthM);
      }
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      return { minX, minY, maxX, maxY, cx, cy, spanX: maxX - minX, spanY: maxY - minY };
    }, [rooms]);

    // ── Fit Params (Auto-center & Scale) ─────────────────────────────────────
    const getFitParams = useCallback(
      (canvas: HTMLCanvasElement): { scale: number; ox: number; oy: number; cx: number; cy: number } => {
        const cssWidth = canvas.clientWidth || 800;
        const cssHeight = canvas.clientHeight || 600;
        const { minX, minY, maxX, maxY, cx, cy, spanX, spanY } = getHouseBounds();

        const currentRot = rotationRef.current;
        const isRotated90or270 = currentRot === 90 || currentRot === 270;
        const effectiveSpanX = isRotated90or270 ? spanY : spanX;
        const effectiveSpanY = isRotated90or270 ? spanX : spanY;

        if (viewModeRef.current === "top") {
          const baseScale = Math.min(
            (cssWidth * 0.74) / Math.max(effectiveSpanX, 1),
            (cssHeight * 0.74) / Math.max(effectiveSpanY, 1)
          );
          const effectiveScale = baseScale * zoomRef.current;
          const ox = cssWidth / 2 - cx * effectiveScale;
          const oy = cssHeight / 2 - cy * effectiveScale;
          return { scale: effectiveScale, ox, oy, cx, cy };
        }

        // Iso: project corners around center
        const corners: Array<[number, number]> = [
          projectPoint(minX, minY, 0, 1, 0, 0, "iso", currentRot, cx, cy),
          projectPoint(maxX, minY, 0, 1, 0, 0, "iso", currentRot, cx, cy),
          projectPoint(maxX, maxY, 0, 1, 0, 0, "iso", currentRot, cx, cy),
          projectPoint(minX, maxY, 0, 1, 0, 0, "iso", currentRot, cx, cy),
          projectPoint(minX, minY, WALL_HEIGHT_TALL, 1, 0, 0, "iso", currentRot, cx, cy),
          projectPoint(maxX, maxY, WALL_HEIGHT_TALL, 1, 0, 0, "iso", currentRot, cx, cy),
        ];

        const minSX = Math.min(...corners.map(([x]) => x));
        const maxSX = Math.max(...corners.map(([x]) => x));
        const minSY = Math.min(...corners.map(([_, y]) => y));
        const maxSY = Math.max(...corners.map(([_, y]) => y));

        const houseSpanX = Math.max(maxSX - minSX, 1);
        const houseSpanY = Math.max(maxSY - minSY, 1);

        // Auto-scale to fill 76% of viewport with ample breathing room
        const autoScale = Math.min(
          (cssWidth * 0.76) / houseSpanX,
          (cssHeight * 0.76) / houseSpanY
        );
        const effectiveScale = autoScale * zoomRef.current;

        const houseCenterSX = ((minSX + maxSX) / 2) * effectiveScale;
        const houseCenterSY = ((minSY + maxSY) / 2) * effectiveScale;

        // Perfect viewport centering
        const ox = cssWidth / 2 - houseCenterSX;
        const oy = cssHeight / 2 - houseCenterSY;

        return { scale: effectiveScale, ox, oy, cx, cy };
      },
      [getHouseBounds]
    );

    // ── Draw Planks & Wood Grain ─────────────────────────────────────────────
    const drawPlankRow = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        room: Room,
        color: SpcColor,
        scale: number,
        ox: number,
        oy: number,
        cx: number,
        cy: number,
        mode: "iso" | "top",
        rot: 0 | 90 | 180 | 270
      ) => {
        const PLANK_W_M = 0.18; // 180mm
        const PLANK_L_M = 1.22; // 1220mm
        const isLengthwise = room.plankDirection !== "crosswise";
        const runDir = isLengthwise ? room.widthM : room.lengthM;
        const spanDir = isLengthwise ? room.lengthM : room.widthM;

        const spanStep = PLANK_W_M;
        let spanCursor = 0;
        let rowIdx = 0;

        ctx.save();
        while (spanCursor < spanDir) {
          const stagger = rowIdx % 2 === 0 ? 0 : PLANK_L_M / 2;
          let runCursor = -stagger;

          while (runCursor < runDir) {
            const pLen = Math.min(PLANK_L_M, runDir - Math.max(0, runCursor));
            if (pLen > 0.01) {
              const startRun = Math.max(0, runCursor);
              const endRun = startRun + pLen;
              const startSpan = spanCursor;
              const endSpan = Math.min(spanDir, spanCursor + spanStep);

              const ax = isLengthwise ? room.gridX + startRun : room.gridX + startSpan;
              const ay = isLengthwise ? room.gridY + startSpan : room.gridY + startRun;
              const bx = isLengthwise ? room.gridX + endRun : room.gridX + endSpan;
              const by = isLengthwise ? room.gridY + startSpan : room.gridY + startRun;
              const cx2 = isLengthwise ? room.gridX + endRun : room.gridX + endSpan;
              const cy2 = isLengthwise ? room.gridY + endSpan : room.gridY + endRun;
              const dx = isLengthwise ? room.gridX + startRun : room.gridX + startSpan;
              const dy = isLengthwise ? room.gridY + endSpan : room.gridY + endRun;

              const [sax, say] = projectPoint(ax, ay, 0.01, scale, ox, oy, mode, rot, cx, cy);
              const [sbx, sby] = projectPoint(bx, by, 0.01, scale, ox, oy, mode, rot, cx, cy);
              const [scx, scy] = projectPoint(cx2, cy2, 0.01, scale, ox, oy, mode, rot, cx, cy);
              const [sdx, sdy] = projectPoint(dx, dy, 0.01, scale, ox, oy, mode, rot, cx, cy);

              ctx.beginPath();
              ctx.moveTo(sax, say);
              ctx.lineTo(sbx, sby);
              ctx.lineTo(scx, scy);
              ctx.lineTo(sdx, sdy);
              ctx.closePath();

              // Subtle natural timber tone variation
              const toneVariation = (rowIdx * 3 + Math.floor(runCursor * 2)) % 5;
              let toneColor = color.hex;
              if (toneVariation === 1) toneColor = darken(color.hex, 0.92);
              else if (toneVariation === 2) toneColor = lighten(color.hex, 0.06);
              else if (toneVariation === 3) toneColor = darken(color.hex, 0.85);

              ctx.fillStyle = toneColor;
              ctx.fill();

              // Micro-bevel plank seam line
              ctx.strokeStyle = darken(color.hex, 0.65);
              ctx.lineWidth = 0.45;
              ctx.stroke();
            }
            runCursor += PLANK_L_M;
          }
          spanCursor += spanStep;
          rowIdx++;
        }
        ctx.restore();
      },
      []
    );

    // ── Draw Animated Planks ─────────────────────────────────────────────────
    const drawAnimatedPlanks = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        room: Room,
        planks: Array<{ x: number; y: number; width: number; length: number; row: number; col: number }>,
        color: SpcColor,
        scale: number,
        ox: number,
        oy: number,
        cx: number,
        cy: number,
        mode: "iso" | "top",
        rot: 0 | 90 | 180 | 270
      ) => {
        const isLengthwise = room.plankDirection !== "crosswise";
        const mmToM = 1 / 1000;

        for (const plank of planks) {
          const startRunM = plank.x * mmToM;
          const startSpanM = plank.y * mmToM;
          const endRunM = startRunM + plank.width * mmToM;
          const endSpanM = startSpanM + plank.length * mmToM;

          const ax = room.gridX + (isLengthwise ? startRunM : startSpanM);
          const ay = room.gridY + (isLengthwise ? startSpanM : startRunM);
          const bx = room.gridX + (isLengthwise ? endRunM : startSpanM);
          const by = room.gridY + (isLengthwise ? startSpanM : endRunM);
          const cx2 = room.gridX + (isLengthwise ? endRunM : endSpanM);
          const cy2 = room.gridY + (isLengthwise ? endSpanM : endRunM);
          const dx = room.gridX + (isLengthwise ? startRunM : endSpanM);
          const dy = room.gridY + (isLengthwise ? endSpanM : startRunM);

          const [sax, say] = projectPoint(ax, ay, 0.01, scale, ox, oy, mode, rot, cx, cy);
          const [sbx, sby] = projectPoint(bx, by, 0.01, scale, ox, oy, mode, rot, cx, cy);
          const [scx, scy] = projectPoint(cx2, cy2, 0.01, scale, ox, oy, mode, rot, cx, cy);
          const [sdx, sdy] = projectPoint(dx, dy, 0.01, scale, ox, oy, mode, rot, cx, cy);

          ctx.beginPath();
          ctx.moveTo(sax, say);
          ctx.lineTo(sbx, sby);
          ctx.lineTo(scx, scy);
          ctx.lineTo(sdx, sdy);
          ctx.closePath();

          const toneVariation = (plank.row + plank.col) % 3;
          const toneColor =
            toneVariation === 0
              ? color.hex
              : toneVariation === 1
                ? darken(color.hex, 0.88)
                : lighten(color.hex, 0.07);

          ctx.fillStyle = toneColor;
          ctx.fill();
          ctx.strokeStyle = darken(color.hex, 0.7);
          ctx.lineWidth = 0.45;
          ctx.stroke();
        }
      },
      []
    );

    // ── Architectural Low-Poly Furniture Silhouettes ─────────────────────────
    const drawFurnitureSilhouette = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        room: Room,
        scale: number,
        ox: number,
        oy: number,
        cx: number,
        cy: number,
        mode: "iso" | "top",
        rot: 0 | 90 | 180 | 270
      ) => {
        if (!showFurnitureRef.current) return;

        const p = (wx: number, wy: number, wz: number) =>
          projectPoint(wx, wy, wz, scale, ox, oy, mode, rot, cx, cy);

        const rx = room.gridX;
        const ry = room.gridY;
        const rw = room.widthM;
        const rl = room.lengthM;

        ctx.save();

        if (room.type === "master" || room.type === "bedroom") {
          // ── Modern Master / Bedroom Bed Silhouette ──
          const bedW = Math.min(rw * 0.5, 1.8);
          const bedL = Math.min(rl * 0.55, 2.1);
          const bedX = rx + (rw - bedW) / 2;
          const bedY = ry + 0.3;

          // Bed base
          const [b0x, b0y] = p(bedX, bedY, 0.03);
          const [b1x, b1y] = p(bedX + bedW, bedY, 0.03);
          const [b2x, b2y] = p(bedX + bedW, bedY + bedL, 0.03);
          const [b3x, b3y] = p(bedX, bedY + bedL, 0.03);

          ctx.beginPath();
          ctx.moveTo(b0x, b0y);
          ctx.lineTo(b1x, b1y);
          ctx.lineTo(b2x, b2y);
          ctx.lineTo(b3x, b3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(246, 241, 231, 0.16)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.4)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Pillows
          const pillW = bedW * 0.38;
          const pillL = bedL * 0.22;
          const [p0x, p0y] = p(bedX + 0.1, bedY + 0.1, 0.06);
          const [p1x, p1y] = p(bedX + 0.1 + pillW, bedY + 0.1, 0.06);
          const [p2x, p2y] = p(bedX + 0.1 + pillW, bedY + 0.1 + pillL, 0.06);
          const [p3x, p3y] = p(bedX + 0.1, bedY + 0.1 + pillL, 0.06);
          ctx.beginPath();
          ctx.moveTo(p0x, p0y);
          ctx.lineTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.lineTo(p3x, p3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.fill();

          const [p4x, p4y] = p(bedX + bedW - 0.1 - pillW, bedY + 0.1, 0.06);
          const [p5x, p5y] = p(bedX + bedW - 0.1, bedY + 0.1, 0.06);
          const [p6x, p6y] = p(bedX + bedW - 0.1, bedY + 0.1 + pillL, 0.06);
          const [p7x, p7y] = p(bedX + bedW - 0.1 - pillW, bedY + 0.1 + pillL, 0.06);
          ctx.beginPath();
          ctx.moveTo(p4x, p4y);
          ctx.lineTo(p5x, p5y);
          ctx.lineTo(p6x, p6y);
          ctx.lineTo(p7x, p7y);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.fill();

          // Small warm bedside lamp points
          const [l1x, l1y] = p(bedX - 0.2, bedY + 0.2, 0.04);
          ctx.beginPath();
          ctx.arc(l1x, l1y, Math.max(3, scale * 0.08), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 215, 140, 0.85)";
          ctx.fill();

          const [l2x, l2y] = p(bedX + bedW + 0.2, bedY + 0.2, 0.04);
          ctx.beginPath();
          ctx.arc(l2x, l2y, Math.max(3, scale * 0.08), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 215, 140, 0.85)";
          ctx.fill();
        } else if (room.type === "living") {
          // ── Architectural L-Sofa & Coffee Table ──
          const sofaW = Math.min(rw * 0.55, 2.6);
          const sofaL = Math.min(rl * 0.55, 2.4);
          const sx = rx + 0.5;
          const sy = ry + 0.5;

          // Main sofa section
          const [s0x, s0y] = p(sx, sy, 0.04);
          const [s1x, s1y] = p(sx + sofaW, sy, 0.04);
          const [s2x, s2y] = p(sx + sofaW, sy + 0.8, 0.04);
          const [s3x, s3y] = p(sx, sy + 0.8, 0.04);
          ctx.beginPath();
          ctx.moveTo(s0x, s0y);
          ctx.lineTo(s1x, s1y);
          ctx.lineTo(s2x, s2y);
          ctx.lineTo(s3x, s3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(18, 28, 45, 0.7)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.35)";
          ctx.stroke();

          // Chaise return
          const [c0x, c0y] = p(sx, sy + 0.8, 0.04);
          const [c1x, c1y] = p(sx + 0.85, sy + 0.8, 0.04);
          const [c2x, c2y] = p(sx + 0.85, sy + sofaL, 0.04);
          const [c3x, c3y] = p(sx, sy + sofaL, 0.04);
          ctx.beginPath();
          ctx.moveTo(c0x, c0y);
          ctx.lineTo(c1x, c1y);
          ctx.lineTo(c2x, c2y);
          ctx.lineTo(c3x, c3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(18, 28, 45, 0.7)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.35)";
          ctx.stroke();

          // Coffee table
          const [t0x, t0y] = p(sx + 1.1, sy + 1.1, 0.03);
          const [t1x, t1y] = p(sx + 2.0, sy + 1.1, 0.03);
          const [t2x, t2y] = p(sx + 2.0, sy + 1.7, 0.03);
          const [t3x, t3y] = p(sx + 1.1, sy + 1.7, 0.03);
          ctx.beginPath();
          ctx.moveTo(t0x, t0y);
          ctx.lineTo(t1x, t1y);
          ctx.lineTo(t2x, t2y);
          ctx.lineTo(t3x, t3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(200, 161, 90, 0.22)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.5)";
          ctx.stroke();
        } else if (room.type === "dining") {
          // ── Dining Table & 4 Chairs ──
          const dtW = Math.min(rw * 0.5, 1.8);
          const dtL = Math.min(rl * 0.45, 1.0);
          const dx = rx + (rw - dtW) / 2;
          const dy = ry + (rl - dtL) / 2;

          const [d0x, d0y] = p(dx, dy, 0.04);
          const [d1x, d1y] = p(dx + dtW, dy, 0.04);
          const [d2x, d2y] = p(dx + dtW, dy + dtL, 0.04);
          const [d3x, d3y] = p(dx, dy + dtL, 0.04);
          ctx.beginPath();
          ctx.moveTo(d0x, d0y);
          ctx.lineTo(d1x, d1y);
          ctx.lineTo(d2x, d2y);
          ctx.lineTo(d3x, d3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(246, 241, 231, 0.18)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.45)";
          ctx.stroke();
        } else if (room.type === "kitchen") {
          // ── Kitchen Island Counter ──
          const kw = Math.min(rw * 0.6, 2.2);
          const kl = 0.65;
          const kx = rx + (rw - kw) / 2;
          const ky = ry + rl * 0.4;

          const [k0x, k0y] = p(kx, ky, 0.04);
          const [k1x, k1y] = p(kx + kw, ky, 0.04);
          const [k2x, k2y] = p(kx + kw, ky + kl, 0.04);
          const [k3x, k3y] = p(kx, ky + kl, 0.04);
          ctx.beginPath();
          ctx.moveTo(k0x, k0y);
          ctx.lineTo(k1x, k1y);
          ctx.lineTo(k2x, k2y);
          ctx.lineTo(k3x, k3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(15, 23, 38, 0.75)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.35)";
          ctx.stroke();
        }

        ctx.restore();
      },
      []
    );

    // ── Draw Single Room ─────────────────────────────────────────────────────
    const drawRoom = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        room: Room,
        color: SpcColor,
        scale: number,
        ox: number,
        oy: number,
        cx: number,
        cy: number,
        mode: "iso" | "top",
        rot: 0 | 90 | 180 | 270,
        drawnPlanks?: Array<{ roomId: string; plankIndex: number }>,
        allLayouts?: PlankLayout[]
      ) => {
        const x0 = room.gridX;
        const y0 = room.gridY;
        const x1 = x0 + room.widthM;
        const y1 = y0 + room.lengthM;

        const p = (wx: number, wy: number, wz: number) =>
          projectPoint(wx, wy, wz, scale, ox, oy, mode, rot, cx, cy);

        // ── 1. Floor Polygon ──
        const [fl0x, fl0y] = p(x0, y0, 0);
        const [fl1x, fl1y] = p(x1, y0, 0);
        const [fl2x, fl2y] = p(x1, y1, 0);
        const [fl3x, fl3y] = p(x0, y1, 0);

        ctx.beginPath();
        ctx.moveTo(fl0x, fl0y);
        ctx.lineTo(fl1x, fl1y);
        ctx.lineTo(fl2x, fl2y);
        ctx.lineTo(fl3x, fl3y);
        ctx.closePath();

        const baseFloorColor = room.hasFlooring ? color.hex : "#131A26";
        ctx.fillStyle = baseFloorColor;
        ctx.fill();

        // ── 2. Planks / Floor Surface ──
        if (room.hasFlooring && drawnPlanks && allLayouts) {
          const layout = allLayouts.find((l) => l.roomId === room.id);
          if (layout) {
            const relevant = drawnPlanks
              .filter((dp) => dp.roomId === room.id)
              .map((dp) => layout.plankPositions[dp.plankIndex])
              .filter(Boolean);

            drawAnimatedPlanks(
              ctx,
              room,
              relevant,
              color,
              scale,
              ox,
              oy,
              cx,
              cy,
              mode,
              rot
            );
          }
        } else if (room.hasFlooring) {
          drawPlankRow(ctx, room, color, scale, ox, oy, cx, cy, mode, rot);
        }

        // ── 3. Warm Ambient Lighting Pools (Reference Inspo) ──
        if (mode === "iso" && room.hasFlooring && qualityTier !== "low") {
          const [lightX, lightY] = p(
            x0 + room.widthM / 2,
            y0 + room.lengthM / 2,
            0.02
          );
          const lightRadius = Math.max(room.widthM, room.lengthM) * scale * 0.48;

          ctx.save();
          const radialGlow = ctx.createRadialGradient(
            lightX,
            lightY,
            4,
            lightX,
            lightY,
            lightRadius
          );
          radialGlow.addColorStop(0, "rgba(255, 215, 140, 0.15)");
          radialGlow.addColorStop(0.45, "rgba(200, 161, 90, 0.06)");
          radialGlow.addColorStop(1, "rgba(200, 161, 90, 0)");

          ctx.beginPath();
          ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
          ctx.fillStyle = radialGlow;
          ctx.fill();
          ctx.restore();
        }

        // ── 4. Furniture Silhouettes ──
        drawFurnitureSilhouette(ctx, room, scale, ox, oy, cx, cy, mode, rot);

        // ── 5. Floor Perimeter Border ──
        ctx.beginPath();
        ctx.moveTo(fl0x, fl0y);
        ctx.lineTo(fl1x, fl1y);
        ctx.lineTo(fl2x, fl2y);
        ctx.lineTo(fl3x, fl3y);
        ctx.closePath();
        ctx.strokeStyle = "rgba(200, 161, 90, 0.35)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // ── 6. Low Interior Partition Curb (Dollhouse Cutaway) ──
        if (mode === "iso") {
          const h = WALL_HEIGHT_LOW;

          // Left interior curb
          const [cl0x, cl0y] = p(x0, y1, 0);
          const [cl1x, cl1y] = p(x0, y1, h);
          const [cl2x, cl2y] = p(x0, y0, h);
          const [cl3x, cl3y] = p(x0, y0, 0);

          ctx.beginPath();
          ctx.moveTo(cl0x, cl0y);
          ctx.lineTo(cl1x, cl1y);
          ctx.lineTo(cl2x, cl2y);
          ctx.lineTo(cl3x, cl3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(10, 18, 30, 0.65)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.35)";
          ctx.lineWidth = 0.7;
          ctx.stroke();

          // Right interior curb
          const [cr0x, cr0y] = p(x1, y0, 0);
          const [cr1x, cr1y] = p(x1, y0, h);
          const [cr2x, cr2y] = p(x1, y1, h);
          const [cr3x, cr3y] = p(x1, y1, 0);

          ctx.beginPath();
          ctx.moveTo(cr0x, cr0y);
          ctx.lineTo(cr1x, cr1y);
          ctx.lineTo(cr2x, cr2y);
          ctx.lineTo(cr3x, cr3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(10, 18, 30, 0.55)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.35)";
          ctx.lineWidth = 0.7;
          ctx.stroke();

          // Polished champagne gold top coping
          ctx.beginPath();
          ctx.moveTo(cl2x, cl2y);
          ctx.lineTo(cl1x, cl1y);
          ctx.lineTo(cr2x, cr2y);
          ctx.strokeStyle = "rgba(200, 161, 90, 0.7)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // ── 7. Architectural Hairline Leader Labels (Inspo Reference) ──
        const [anchorX, anchorY] = p(
          x0 + room.widthM / 2,
          y0 + room.lengthM / 2,
          0.02
        );

        ctx.save();
        const roomName = room.name.toUpperCase();
        const areaVal = room.widthM * room.lengthM;
        const areaStr = unit === "ft"
          ? `${Math.round(areaVal * 10.7639)} SQ FT`
          : `${areaVal.toFixed(1)} M²`;

        const fontSize = Math.max(9, Math.min(11.5, scale * 0.28));
        ctx.font = `600 ${fontSize}px ${MONO_FONT}`;

        const nameWidth = ctx.measureText(roomName).width;
        const pillWidth = Math.max(nameWidth + 18, 70);
        const pillHeight = fontSize * 2.2;

        const labelYOffset = mode === "iso" ? -28 : -18;
        const labelCenterY = anchorY + labelYOffset;

        // Hairline leader line & center anchor dot
        if (mode === "iso" && qualityTier !== "low") {
          ctx.beginPath();
          ctx.arc(anchorX, anchorY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "#C8A15A";
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(anchorX, anchorY);
          ctx.lineTo(anchorX, labelCenterY + pillHeight / 2);
          ctx.strokeStyle = "rgba(200, 161, 90, 0.45)";
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Frosted glass luxury pill badge
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(
            anchorX - pillWidth / 2,
            labelCenterY - pillHeight / 2,
            pillWidth,
            pillHeight,
            3
          );
        } else {
          ctx.rect(
            anchorX - pillWidth / 2,
            labelCenterY - pillHeight / 2,
            pillWidth,
            pillHeight
          );
        }
        ctx.fillStyle = "rgba(9, 17, 30, 0.88)";
        ctx.fill();
        ctx.strokeStyle = "rgba(200, 161, 90, 0.4)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Room name in ivory
        ctx.fillStyle = "#F6F1E7";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(roomName, anchorX, labelCenterY - fontSize * 0.42);

        // Square footage/meterage in champagne gold
        ctx.font = `500 ${Math.max(7.5, fontSize * 0.8)}px ${MONO_FONT}`;
        ctx.fillStyle = "#C8A15A";
        ctx.fillText(areaStr, anchorX, labelCenterY + fontSize * 0.52);

        ctx.restore();
      },
      [drawPlankRow, drawAnimatedPlanks, drawFurnitureSilhouette, unit, qualityTier]
    );

    // ── Draw Dollhouse Perimeter Podium & Back Walls ─────────────────────────
    const drawDollhouseFraming = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        scale: number,
        ox: number,
        oy: number,
        cx: number,
        cy: number,
        mode: "iso" | "top",
        rot: 0 | 90 | 180 | 270
      ) => {
        if (mode !== "iso" || rooms.length === 0) return;

        const { minX, minY, maxX, maxY } = getHouseBounds();
        const p = (wx: number, wy: number, wz: number) =>
          projectPoint(wx, wy, wz, scale, ox, oy, mode, rot, cx, cy);

        const pad = 0.35;
        const bx0 = minX - pad;
        const by0 = minY - pad;
        const bx1 = maxX + pad;
        const by1 = maxY + pad;

        ctx.save();

        // ── 1. Soft Ambient Drop Shadow under foundation ──
        if (qualityTier !== "low") {
          const [sh0x, sh0y] = p(bx0, by0, -PLINTH_DEPTH);
          const [sh1x, sh1y] = p(bx1, by0, -PLINTH_DEPTH);
          const [sh2x, sh2y] = p(bx1, by1, -PLINTH_DEPTH);
          const [sh3x, sh3y] = p(bx0, by1, -PLINTH_DEPTH);

          ctx.beginPath();
          ctx.moveTo(sh0x, sh0y);
          ctx.lineTo(sh1x, sh1y);
          ctx.lineTo(sh2x, sh2y);
          ctx.lineTo(sh3x, sh3y);
          ctx.closePath();
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
          ctx.shadowBlur = 32;
          ctx.shadowOffsetY = 16;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
        }

        // ── 2. Solid Architectural Foundation Podium ──
        const [f0x, f0y] = p(bx0, by1, 0);
        const [f1x, f1y] = p(bx1, by1, 0);
        const [f2x, f2y] = p(bx1, by1, -PLINTH_DEPTH);
        const [f3x, f3y] = p(bx0, by1, -PLINTH_DEPTH);

        ctx.beginPath();
        ctx.moveTo(f0x, f0y);
        ctx.lineTo(f1x, f1y);
        ctx.lineTo(f2x, f2y);
        ctx.lineTo(f3x, f3y);
        ctx.closePath();
        ctx.fillStyle = "rgba(8, 14, 24, 0.95)";
        ctx.fill();
        ctx.strokeStyle = "rgba(200, 161, 90, 0.25)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const [r0x, r0y] = p(bx1, by0, 0);
        const [r1x, r1y] = p(bx1, by1, 0);
        const [r2x, r2y] = p(bx1, by1, -PLINTH_DEPTH);
        const [r3x, r3y] = p(bx1, by0, -PLINTH_DEPTH);

        ctx.beginPath();
        ctx.moveTo(r0x, r0y);
        ctx.lineTo(r1x, r1y);
        ctx.lineTo(r2x, r2y);
        ctx.lineTo(r3x, r3y);
        ctx.closePath();
        ctx.fillStyle = "rgba(12, 20, 34, 0.95)";
        ctx.fill();
        ctx.strokeStyle = "rgba(200, 161, 90, 0.25)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // ── 3. High Framing Back Walls (Dollhouse Look) ──
        const ht = WALL_HEIGHT_TALL;

        // Back wall (top-left)
        const [bw0x, bw0y] = p(bx0, by0, 0);
        const [bw1x, bw1y] = p(bx1, by0, 0);
        const [bw2x, bw2y] = p(bx1, by0, ht);
        const [bw3x, bw3y] = p(bx0, by0, ht);

        ctx.beginPath();
        ctx.moveTo(bw0x, bw0y);
        ctx.lineTo(bw1x, bw1y);
        ctx.lineTo(bw2x, bw2y);
        ctx.lineTo(bw3x, bw3y);
        ctx.closePath();
        ctx.fillStyle = "rgba(14, 22, 36, 0.9)";
        ctx.fill();
        ctx.strokeStyle = "rgba(200, 161, 90, 0.4)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Champagne gold top crown header
        ctx.beginPath();
        ctx.moveTo(bw3x, bw3y);
        ctx.lineTo(bw2x, bw2y);
        ctx.strokeStyle = "rgba(200, 161, 90, 0.85)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      },
      [rooms, getHouseBounds, qualityTier]
    );

    // ── Full Scene Render ────────────────────────────────────────────────────
    const render = useCallback(
      (
        drawnPlanks?: Array<{ roomId: string; plankIndex: number }>,
        layouts?: PlankLayout[]
      ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { scale, ox, oy, cx, cy } = getFitParams(canvas);
        const mode = viewModeRef.current;
        const rot = rotationRef.current;

        const dpr = Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
          qualityTier === "low" ? 1 : 2
        );

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ── Background: Smooth Luxury Moody Navy Vignette ──
        const bgGrad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.1,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.7
        );
        bgGrad.addColorStop(0, "#0C182A");
        bgGrad.addColorStop(1, "#070E1A");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply DPR scaling
        ctx.scale(dpr, dpr);

        const cssWidth = canvas.clientWidth || canvas.width / dpr;
        const cssHeight = canvas.clientHeight || canvas.height / dpr;

        // Subtle architectural blueprint dot grid
        if (qualityTier !== "low") {
          ctx.fillStyle = "rgba(200, 161, 90, 0.04)";
          for (let gx = 16; gx < cssWidth; gx += 32) {
            for (let gy = 16; gy < cssHeight; gy += 32) {
              ctx.beginPath();
              ctx.arc(gx, gy, 0.75, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // ── 1. Draw Dollhouse Foundation & Exterior Framing ──
        drawDollhouseFraming(ctx, scale, ox, oy, cx, cy, mode, rot);

        // ── 2. Sort Rooms: Back-to-Front Painter's Algorithm ──
        const sortedRooms = [...rooms].sort((a, b) => {
          if (mode === "iso") {
            const rotFactor =
              rot === 0
                ? (a.gridX + a.gridY) - (b.gridX + b.gridY)
                : rot === 90
                  ? (a.gridY - a.gridX) - (b.gridY - b.gridX)
                  : rot === 180
                    ? -(a.gridX + a.gridY) + (b.gridX + b.gridY)
                    : -(a.gridY - a.gridX) + (b.gridY - b.gridX);
            return rotFactor;
          }
          return 0;
        });

        // ── 3. Draw All Rooms ──
        for (const room of sortedRooms) {
          const color = colorMap[room.colorId] ?? colorMap["natural-french-oak"];
          if (!color) continue;

          drawRoom(
            ctx,
            room,
            color,
            scale,
            ox,
            oy,
            cx,
            cy,
            mode,
            rot,
            drawnPlanks,
            layouts
          );
        }

        // ── 4. HUD View Mode Indicator (Top Left) ──
        ctx.save();
        ctx.font = `600 10px ${MONO_FONT}`;
        ctx.fillStyle = "rgba(200, 161, 90, 0.75)";
        ctx.textAlign = "left";
        ctx.fillText(
          mode === "iso"
            ? `ISOMETRIC DOLLHOUSE · 30° ORTHOGRAPHIC · ${rot}° ROTATION`
            : "ARCHITECTURAL FLOOR PLAN · 2D SCHEMATIC",
          16,
          24
        );

        ctx.font = `400 9px ${MONO_FONT}`;
        ctx.fillStyle = "rgba(246, 241, 231, 0.4)";
        ctx.fillText(
          "Schematic layout · Site survey will confirm exact architectural bounds",
          16,
          38
        );
        ctx.restore();

        ctx.restore();
      },
      [
        rooms,
        colorMap,
        qualityTier,
        getFitParams,
        drawDollhouseFraming,
        drawRoom,
      ]
    );

    // ── Animation Loop ───────────────────────────────────────────────────────
    const startAnimLoop = useCallback(() => {
      const anim = animStateRef.current;
      if (!anim || !anim.active) return;

      const PLANKS_PER_FRAME =
        qualityTier === "low" ? 999999 : qualityTier === "medium" ? 6 : 3;

      let added = 0;
      while (added < PLANKS_PER_FRAME) {
        if (anim.roomIndex >= anim.layouts.length) {
          anim.active = false;
          render(anim.drawnPlanks, anim.layouts);
          onAnimationComplete?.();
          return;
        }

        const currentLayout = anim.layouts[anim.roomIndex];
        if (!currentLayout) {
          anim.roomIndex++;
          continue;
        }

        if (anim.plankIndex >= currentLayout.plankPositions.length) {
          anim.roomIndex++;
          anim.plankIndex = 0;
          added = 0; // Brief frame pause between rooms for natural click sequence
          break;
        }

        anim.drawnPlanks.push({
          roomId: currentLayout.roomId,
          plankIndex: anim.plankIndex,
        });
        anim.plankIndex++;
        anim.laid++;
        added++;
      }

      onPlankProgress?.(anim.laid, anim.total);
      render(anim.drawnPlanks, anim.layouts);
      animRef.current = requestAnimationFrame(startAnimLoop);
    }, [qualityTier, render, onPlankProgress, onAnimationComplete]);

    // ── Exposed Imperative Ref API ───────────────────────────────────────────
    useImperativeHandle(
      ref,
      () => ({
        triggerPlankAnimation(layouts, cMap) {
          if (animRef.current) cancelAnimationFrame(animRef.current);
          const total = layouts.reduce((s, l) => s + l.plankPositions.length, 0);
          animStateRef.current = {
            active: true,
            layouts,
            colorMap: cMap,
            roomIndex: 0,
            plankIndex: 0,
            laid: 0,
            total,
            drawnPlanks: [],
          };
          animRef.current = requestAnimationFrame(startAnimLoop);
        },
        skipAnimation() {
          if (animRef.current) cancelAnimationFrame(animRef.current);
          const anim = animStateRef.current;
          if (!anim) return;
          anim.drawnPlanks = anim.layouts.flatMap((l) =>
            l.plankPositions.map((_, i) => ({ roomId: l.roomId, plankIndex: i }))
          );
          anim.laid = anim.total;
          anim.active = false;
          render(anim.drawnPlanks, anim.layouts);
          onAnimationComplete?.();
        },
        replayAnimation() {
          const anim = animStateRef.current;
          if (!anim) return;
          if (animRef.current) cancelAnimationFrame(animRef.current);
          anim.drawnPlanks = [];
          anim.roomIndex = 0;
          anim.plankIndex = 0;
          anim.laid = 0;
          anim.active = true;
          animRef.current = requestAnimationFrame(startAnimLoop);
        },
        setView(mode) {
          viewModeRef.current = mode;
          render(animStateRef.current?.drawnPlanks, animStateRef.current?.layouts);
        },
        setRotation(angle) {
          rotationRef.current = angle;
          render(animStateRef.current?.drawnPlanks, animStateRef.current?.layouts);
        },
        exportPng() {
          return canvasRef.current?.toDataURL("image/png") ?? "";
        },
      }),
      [render, startAnimLoop, onAnimationComplete]
    );

    // ── Resize Observer & Sync ───────────────────────────────────────────────
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const updateSize = () => {
        const { width, height } = parent.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        const dpr = Math.min(window.devicePixelRatio ?? 1, qualityTier === "low" ? 1 : 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        render();
      };

      updateSize();
      const ro = new ResizeObserver(updateSize);
      ro.observe(parent);
      return () => ro.disconnect();
    }, [render, qualityTier]);

    useEffect(() => {
      viewModeRef.current = viewMode;
      render(animStateRef.current?.drawnPlanks, animStateRef.current?.layouts);
    }, [viewMode, render]);

    useEffect(() => {
      zoomRef.current = zoom;
      render(animStateRef.current?.drawnPlanks, animStateRef.current?.layouts);
    }, [zoom, render]);

    useEffect(() => {
      rotationRef.current = rotation;
      render(animStateRef.current?.drawnPlanks, animStateRef.current?.layouts);
    }, [rotation, render]);

    useEffect(() => {
      showFurnitureRef.current = showFurniture;
      render(animStateRef.current?.drawnPlanks, animStateRef.current?.layouts);
    }, [showFurniture, render]);

    useEffect(() => {
      render();
    }, [render]);

    useEffect(() => {
      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    }, []);

    const { spanX, spanY } = getHouseBounds();

    return (
      <div className="relative w-full h-full select-none">
        <canvas
          ref={canvasRef}
          className={`block w-full h-full ${className}`}
          aria-label="Isometric architectural floor plan visualiser"
        />

        {/* ── Mini "View Floor plan ↗" Card (Inspired by Reference Image) ── */}
        <div className="absolute top-4 right-4 z-30">
          <button
            type="button"
            onClick={onToggleViewMode}
            className="group flex items-center gap-3 p-2.5 pr-3.5 rounded-sm bg-brand-navy-card/90 hover:bg-brand-navy-light/95 border border-brand-gold/30 hover:border-brand-gold backdrop-blur-md shadow-xl transition-all duration-300"
            title="Toggle between 3D Dollhouse cutaway and 2D floor plan schematic"
          >
            {/* Mini Wireframe Schematic Icon */}
            <div className="w-10 h-10 rounded-xs bg-brand-navy border border-brand-gold/25 p-1 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-full h-full text-brand-gold">
                <rect
                  x="4"
                  y="4"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="2 1"
                />
                <rect x="7" y="7" width="10" height="9" fill="rgba(200,161,90,0.2)" stroke="currentColor" strokeWidth="0.8" />
                <rect x="19" y="7" width="6" height="9" fill="rgba(200,161,90,0.15)" stroke="currentColor" strokeWidth="0.8" />
                <rect x="7" y="18" width="18" height="7" fill="rgba(200,161,90,0.15)" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">
                  {viewMode === "iso" ? "2D Floor Plan" : "3D Dollhouse"}
                </span>
                <span className="text-[10px] font-mono text-brand-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </div>
              <p className="text-[9px] font-sans text-brand-ivory/60">
                {viewMode === "iso" ? "Switch to schematic" : "Switch to 3D cutaway"}
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }
);
