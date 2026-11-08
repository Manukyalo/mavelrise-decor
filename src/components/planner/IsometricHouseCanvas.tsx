"use client";

// ─────────────────────────────────────────────────────────────────────────────
// IsometricHouseCanvas — Canvas 2D isometric renderer
//
// Architecture:
//   - Pure Canvas 2D, no WebGL dependency → works on all devices
//   - Isometric projection: (x,y,z) → (screen_x, screen_y) via standard iso math
//   - Plank animation: RAF loop, row-by-row reveal per room, staggered joints
//   - Quality tiers: "high" = all effects | "medium" = no shadows | "low" = flat 2D
//   - 2D fallback: orthographic top-down view on the same canvas
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { Room, SpcColor, QualityTier, PlankLayout } from "@/lib/planner/types";

// ── Isometric projection constants ───────────────────────────────────────────
const ISO_ANGLE = 30; // degrees from horizontal
const ISO_X_RATIO = Math.cos((ISO_ANGLE * Math.PI) / 180);
const ISO_Y_RATIO = Math.sin((ISO_ANGLE * Math.PI) / 180);
const WALL_HEIGHT_U = 0.22; // Low sleek architectural curb (avoids blocking rooms)
const PLINTH_DEPTH_U = 0.35; // Architectural foundation podium depth

// ── Room label font ───────────────────────────────────────────────────────────
const LABEL_FONT = "'Cormorant Garamond', serif";
const MONO_FONT = "'JetBrains Mono', monospace";

export interface IsometricCanvasRef {
  triggerPlankAnimation(layouts: PlankLayout[], colorMap: Record<string, SpcColor>): void;
  skipAnimation(): void;
  replayAnimation(): void;
  setView(mode: "iso" | "top"): void;
  exportPng(): string;
}

interface Props {
  rooms: Room[];
  colorMap: Record<string, SpcColor>; // roomId → SpcColor
  qualityTier: QualityTier;
  viewMode?: "iso" | "top";
  zoom?: number;
  onPlankProgress?: (laid: number, total: number) => void;
  onAnimationComplete?: () => void;
  className?: string;
}

function isoProject(
  worldX: number,
  worldY: number,
  worldZ: number,
  scale: number,
  offsetX: number,
  offsetY: number
): [number, number] {
  const sx = (worldX - worldY) * ISO_X_RATIO * scale + offsetX;
  const sy = (worldX + worldY) * ISO_Y_RATIO * scale - worldZ * scale + offsetY;
  return [sx, sy];
}

function topProject(
  worldX: number,
  worldY: number,
  _worldZ: number,
  scale: number,
  offsetX: number,
  offsetY: number
): [number, number] {
  return [worldX * scale + offsetX, worldY * scale + offsetY];
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
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

export const IsometricHouseCanvas = forwardRef<IsometricCanvasRef, Props>(
  function IsometricHouseCanvas(
    {
      rooms,
      colorMap,
      qualityTier,
      viewMode = "iso",
      zoom = 1,
      onPlankProgress,
      onAnimationComplete,
      className = "",
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewModeRef = useRef<"iso" | "top">(viewMode);
    const zoomRef = useRef(zoom);
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

    // ── Auto-fit scale & centering offsets (pure CSS-pixel space) ───────────
    const getFitParams = useCallback(
      (canvas: HTMLCanvasElement): { scale: number; ox: number; oy: number } => {
        // Use client dimensions so devicePixelRatio doesn't displace the view
        const cssWidth = canvas.clientWidth || 800;
        const cssHeight = canvas.clientHeight || 600;

        if (rooms.length === 0) {
          return { scale: 32 * zoomRef.current, ox: cssWidth / 2, oy: cssHeight / 2 };
        }

        // Bounding box of all rooms in world space (metres)
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const r of rooms) {
          minX = Math.min(minX, r.gridX);
          minY = Math.min(minY, r.gridY);
          maxX = Math.max(maxX, r.gridX + r.widthM);
          maxY = Math.max(maxY, r.gridY + r.lengthM);
        }

        if (viewModeRef.current === "top") {
          const houseW = Math.max(maxX - minX, 1);
          const houseH = Math.max(maxY - minY, 1);
          const baseScale = Math.min(
            (cssWidth * 0.8) / houseW,
            (cssHeight * 0.8) / houseH
          );
          const effectiveScale = baseScale * zoomRef.current;
          const ox = cssWidth / 2 - ((minX + maxX) / 2) * effectiveScale;
          const oy = cssHeight / 2 - ((minY + maxY) / 2) * effectiveScale;
          return { scale: effectiveScale, ox, oy };
        }

        // Iso: project all corners of bounding box at scale = 1
        const h = WALL_HEIGHT_U;
        const corners: Array<[number, number]> = [
          isoProject(minX, minY, 0, 1, 0, 0),
          isoProject(maxX, minY, 0, 1, 0, 0),
          isoProject(maxX, maxY, 0, 1, 0, 0),
          isoProject(minX, maxY, 0, 1, 0, 0),
          isoProject(minX, minY, h, 1, 0, 0),
          isoProject(maxX, maxY, h, 1, 0, 0),
        ];

        const minSX = Math.min(...corners.map(([x]) => x));
        const maxSX = Math.max(...corners.map(([x]) => x));
        const minSY = Math.min(...corners.map(([_, y]) => y));
        const maxSY = Math.max(...corners.map(([_, y]) => y));

        const houseSpanX = Math.max(maxSX - minSX, 1);
        const houseSpanY = Math.max(maxSY - minSY, 1);

        // Auto-scale: fits the entire house inside 78% of the viewport with breathing room
        const autoScale = Math.min(
          (cssWidth * 0.78) / houseSpanX,
          (cssHeight * 0.78) / houseSpanY
        );
        const effectiveScale = autoScale * zoomRef.current;

        // Projected center of the house at effectiveScale
        const houseCenterSX = ((minSX + maxSX) / 2) * effectiveScale;
        const houseCenterSY = ((minSY + maxSY) / 2) * effectiveScale;

        // Offset places house center exactly at (cssWidth / 2, cssHeight / 2)
        const ox = cssWidth / 2 - houseCenterSX;
        const oy = cssHeight / 2 - houseCenterSY;

        return { scale: effectiveScale, ox, oy };
      },
      [rooms]
    );

    // ── Draw floor texture lines (static non-animated) ──────────────────────
    const drawFloorTexture = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        room: Room,
        color: SpcColor,
        scale: number,
        ox: number,
        oy: number,
        project: typeof isoProject
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

              // Map to world coords
              const ax = isLengthwise ? room.gridX + startRun : room.gridX + startSpan;
              const ay = isLengthwise ? room.gridY + startSpan : room.gridY + startRun;
              const bx = isLengthwise ? room.gridX + endRun : room.gridX + endSpan;
              const by = isLengthwise ? room.gridY + startSpan : room.gridY + startRun;
              const cx2 = isLengthwise ? room.gridX + endRun : room.gridX + endSpan;
              const cy2 = isLengthwise ? room.gridY + endSpan : room.gridY + endRun;
              const dx = isLengthwise ? room.gridX + startRun : room.gridX + startSpan;
              const dy = isLengthwise ? room.gridY + endSpan : room.gridY + endRun;

              const [sax, say] = project(ax, ay, 0.01, scale, ox, oy);
              const [sbx, sby] = project(bx, by, 0.01, scale, ox, oy);
              const [scx, scy] = project(cx2, cy2, 0.01, scale, ox, oy);
              const [sdx, sdy] = project(dx, dy, 0.01, scale, ox, oy);

              ctx.beginPath();
              ctx.moveTo(sax, say);
              ctx.lineTo(sbx, sby);
              ctx.lineTo(scx, scy);
              ctx.lineTo(sdx, sdy);
              ctx.closePath();

              const toneVariation = (rowIdx + Math.floor(runCursor)) % 3;
              const toneColor =
                toneVariation === 0
                  ? color.hex
                  : toneVariation === 1
                    ? darken(color.hex, 0.88)
                    : lighten(color.hex, 0.08);

              ctx.fillStyle = toneColor;
              ctx.fill();
              ctx.strokeStyle = darken(color.hex, 0.7);
              ctx.lineWidth = 0.4;
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

    // ── Draw a subset of planks (animation path) ─────────────────────────────
    const drawPlanksOnFloor = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        room: Room,
        planks: Array<{ x: number; y: number; width: number; length: number; row: number; col: number }>,
        color: SpcColor,
        scale: number,
        ox: number,
        oy: number,
        project: typeof isoProject
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

          const [sax, say] = project(ax, ay, 0.01, scale, ox, oy);
          const [sbx, sby] = project(bx, by, 0.01, scale, ox, oy);
          const [scx, scy] = project(cx2, cy2, 0.01, scale, ox, oy);
          const [sdx, sdy] = project(dx, dy, 0.01, scale, ox, oy);

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
                : lighten(color.hex, 0.08);

          ctx.fillStyle = toneColor;
          ctx.fill();
          ctx.strokeStyle = darken(color.hex, 0.7);
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      },
      []
    );

    // ── Draw a single room (walls + floor) ──────────────────────────────────
    const drawRoom = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        room: Room,
        color: SpcColor,
        scale: number,
        ox: number,
        oy: number,
        project: typeof isoProject,
        drawnPlanks?: Array<{ roomId: string; plankIndex: number }>,
        allLayouts?: PlankLayout[]
      ) => {
        const x0 = room.gridX;
        const y0 = room.gridY;
        const x1 = x0 + room.widthM;
        const y1 = y0 + room.lengthM;
        const h = WALL_HEIGHT_U;

        const p = (x: number, y: number, z: number) => project(x, y, z, scale, ox, oy);

        // ── Floor face ──
        const [flx0, fly0] = p(x0, y0, 0);
        const [flx1, fly1] = p(x1, y0, 0);
        const [flx2, fly2] = p(x1, y1, 0);
        const [flx3, fly3] = p(x0, y1, 0);

        ctx.beginPath();
        ctx.moveTo(flx0, fly0);
        ctx.lineTo(flx1, fly1);
        ctx.lineTo(flx2, fly2);
        ctx.lineTo(flx3, fly3);
        ctx.closePath();

        const floorColor = room.hasFlooring ? color.hex : "#1A1F2B";
        ctx.fillStyle = floorColor;
        ctx.fill();

        // If we have plank layout, draw visible planks
        if (room.hasFlooring && drawnPlanks && allLayouts) {
          const layout = allLayouts.find((l) => l.roomId === room.id);
          if (layout) {
            const relevantPlanks = drawnPlanks
              .filter((dp) => dp.roomId === room.id)
              .map((dp) => layout.plankPositions[dp.plankIndex])
              .filter(Boolean);

            drawPlanksOnFloor(
              ctx,
              room,
              relevantPlanks,
              color,
              scale,
              ox,
              oy,
              project
            );
          }
        } else if (room.hasFlooring) {
          // Static render: draw all planks
          drawFloorTexture(ctx, room, color, scale, ox, oy, project);
        }

        // ── Floor border ──
        ctx.beginPath();
        ctx.moveTo(flx0, fly0);
        ctx.lineTo(flx1, fly1);
        ctx.lineTo(flx2, fly2);
        ctx.lineTo(flx3, fly3);
        ctx.closePath();
        ctx.strokeStyle = "rgba(200,161,90,0.3)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (project === isoProject) {
          // ── Sleek low architectural curb (gives 3D depth without obscuring floors) ──
          // Left curb face
          const [wlx0, wly0] = p(x0, y1, 0);
          const [wlx1, wly1] = p(x0, y1, h);
          const [wlx2, wly2] = p(x0, y0, h);
          const [wlx3, wly3] = p(x0, y0, 0);

          ctx.beginPath();
          ctx.moveTo(wlx0, wly0);
          ctx.lineTo(wlx1, wly1);
          ctx.lineTo(wlx2, wly2);
          ctx.lineTo(wlx3, wly3);
          ctx.closePath();
          ctx.fillStyle = "rgba(11, 27, 51, 0.45)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.35)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Right curb face
          const [wrx0, wry0] = p(x1, y0, 0);
          const [wrx1, wry1] = p(x1, y0, h);
          const [wrx2, wry2] = p(x1, y1, h);
          const [wrx3, wry3] = p(x1, y1, 0);

          ctx.beginPath();
          ctx.moveTo(wrx0, wry0);
          ctx.lineTo(wrx1, wry1);
          ctx.lineTo(wrx2, wry2);
          ctx.lineTo(wrx3, wry3);
          ctx.closePath();
          ctx.fillStyle = "rgba(11, 27, 51, 0.35)";
          ctx.fill();
          ctx.strokeStyle = "rgba(200, 161, 90, 0.35)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Delicate gold rim on top of curb
          ctx.beginPath();
          ctx.moveTo(wlx2, wly2);
          ctx.lineTo(wlx1, wly1);
          ctx.lineTo(wrx2, wry2);
          ctx.strokeStyle = "rgba(200, 161, 90, 0.55)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // ── Room label badge with glass pill backdrop ──
        const [labelX, labelY] = p(
          x0 + room.widthM / 2,
          y0 + room.lengthM / 2,
          project === isoProject ? 0.05 : 0
        );

        ctx.save();
        const roomName = room.name.toUpperCase();
        const areaText = `${(room.widthM * room.lengthM).toFixed(1)} M²`;
        const fontSize = Math.max(9, Math.min(12, scale * 0.3));

        ctx.font = `600 ${fontSize}px ${MONO_FONT}`;
        const nameW = ctx.measureText(roomName).width;
        const pillW = Math.max(nameW + 16, 68);
        const pillH = fontSize * 2.3;

        // Frosted glass pill backdrop
        ctx.fillStyle = "rgba(11, 27, 51, 0.85)";
        ctx.strokeStyle = "rgba(200, 161, 90, 0.4)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(labelX - pillW / 2, labelY - pillH / 2, pillW, pillH, 3);
        } else {
          ctx.rect(labelX - pillW / 2, labelY - pillH / 2, pillW, pillH);
        }
        ctx.fill();
        ctx.stroke();

        // Room name in ivory
        ctx.fillStyle = "#F6F1E7";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(roomName, labelX, labelY - fontSize * 0.45);

        // Area in champagne gold
        ctx.font = `500 ${Math.max(7.5, fontSize * 0.82)}px ${MONO_FONT}`;
        ctx.fillStyle = "#C8A15A";
        ctx.fillText(areaText, labelX, labelY + fontSize * 0.55);
        ctx.restore();
      },
      [drawFloorTexture, drawPlanksOnFloor]
    );

    // ── Full scene render ────────────────────────────────────────────────────
    const render = useCallback(
      (
        drawnPlanks?: Array<{ roomId: string; plankIndex: number }>,
        layouts?: PlankLayout[]
      ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { scale, ox, oy } = getFitParams(canvas);
        const project = viewModeRef.current === "iso" ? isoProject : topProject;

        const dpr = Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
          qualityTier === "low" ? 1 : 2
        );

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fill background
        ctx.fillStyle = "#0B1B33";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reset transform to CSS pixels with DPR scale
        ctx.scale(dpr, dpr);

        const cssWidth = canvas.clientWidth || canvas.width / dpr;
        const cssHeight = canvas.clientHeight || canvas.height / dpr;

        // Subtle architectural grid dots in background
        if (qualityTier !== "low") {
          ctx.fillStyle = "rgba(200, 161, 90, 0.05)";
          for (let gx = 12; gx < cssWidth; gx += 28) {
            for (let gy = 12; gy < cssHeight; gy += 28) {
              ctx.beginPath();
              ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Sort rooms: in iso view, back rooms first (painter's algorithm)
        const sortedRooms = [...rooms].sort((a, b) => {
          if (viewModeRef.current === "iso") {
            return a.gridX + a.gridY - (b.gridX + b.gridY);
          }
          return 0;
        });

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
            project,
            drawnPlanks,
            layouts
          );
        }

        // HUD view mode badge in top-left
        ctx.save();
        ctx.font = `600 10px ${MONO_FONT}`;
        ctx.fillStyle = "rgba(200, 161, 90, 0.7)";
        ctx.textAlign = "left";
        ctx.fillText(
          viewModeRef.current === "iso"
            ? "ISOMETRIC CUTAWAY · 30° ORTHOGRAPHIC"
            : "FLOOR PLAN · 2D TOP-DOWN SCHEMATIC",
          14,
          22
        );
        ctx.restore();

        ctx.restore();
      },
      [rooms, colorMap, qualityTier, getFitParams, drawRoom]
    );

    // ── Animation loop ───────────────────────────────────────────────────────
    const startAnimLoop = useCallback(() => {
      const anim = animStateRef.current;
      if (!anim || !anim.active) return;

      const PLANKS_PER_FRAME = qualityTier === "low" ? 999999 : qualityTier === "medium" ? 6 : 3;

      let added = 0;
      while (added < PLANKS_PER_FRAME) {
        if (anim.roomIndex >= anim.layouts.length) {
          anim.active = false;
          render(anim.drawnPlanks, anim.layouts);
          onAnimationComplete?.();
          return;
        }

        const currentLayout = anim.layouts[anim.roomIndex];
        if (!currentLayout) { anim.roomIndex++; continue; }

        if (anim.plankIndex >= currentLayout.plankPositions.length) {
          anim.roomIndex++;
          anim.plankIndex = 0;
          added = 0; // pause one frame between rooms for effect
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

    // ── Exposed API ──────────────────────────────────────────────────────────
    useImperativeHandle(
      ref,
      () => ({
        triggerPlankAnimation(layouts, cMap) {
          if (animRef.current) cancelAnimationFrame(animRef.current);
          const total = layouts.reduce(
            (s, l) => s + l.plankPositions.length,
            0
          );
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
          // Fill all planks instantly
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
          render(
            animStateRef.current?.drawnPlanks,
            animStateRef.current?.layouts
          );
        },
        exportPng() {
          return canvasRef.current?.toDataURL("image/png") ?? "";
        },
      }),
      [render, startAnimLoop, onAnimationComplete]
    );

    // ── Resize + initial render ──────────────────────────────────────────────
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const ro = new ResizeObserver(() => {
        const { width, height } = parent.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        const dpr = Math.min(window.devicePixelRatio ?? 1, qualityTier === "low" ? 1 : 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        render();
      });

      ro.observe(parent);
      return () => ro.disconnect();
    }, [render, qualityTier]);

    useEffect(() => {
      viewModeRef.current = viewMode;
      render(
        animStateRef.current?.drawnPlanks,
        animStateRef.current?.layouts
      );
    }, [viewMode, render]);

    useEffect(() => {
      zoomRef.current = zoom;
      render(
        animStateRef.current?.drawnPlanks,
        animStateRef.current?.layouts
      );
    }, [zoom, render]);

    useEffect(() => {
      render();
    }, [render]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className={`block w-full h-full ${className}`}
        aria-label="Isometric floor plan visualiser"
      />
    );
  }
);

