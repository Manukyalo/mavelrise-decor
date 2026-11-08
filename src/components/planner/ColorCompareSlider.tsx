"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ColorCompareSlider — drag to compare 2–4 SPC colours on the same house view
// Uses canvas compositing to slice the full-house render at draggable positions
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useCallback, useEffect } from "react";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPC_COLORS, getColorById } from "@/lib/planner/colors";
import type { Room } from "@/lib/planner/types";

interface SliceConfig {
  colorId: string;
  /** 0–1 fraction where the right edge of this slice sits */
  boundary: number;
}

interface Props {
  rooms: Room[];
  className?: string;
}

/** Render a simple 2D floor-plan canvas for a given color configuration */
function renderColorSlice(
  canvas: HTMLCanvasElement,
  rooms: Room[],
  colorId: string,
  clipLeft: number,  // pixels
  clipRight: number  // pixels
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const color = getColorById(colorId);

  // Find bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of rooms) {
    minX = Math.min(minX, r.gridX);
    minY = Math.min(minY, r.gridY);
    maxX = Math.max(maxX, r.gridX + r.widthM);
    maxY = Math.max(maxY, r.gridY + r.lengthM);
  }
  const houseW = Math.max(maxX - minX, 1);
  const houseH = Math.max(maxY - minY, 1);
  const scale = Math.min((canvas.width * 0.82) / houseW, (canvas.height * 0.82) / houseH);

  const ox = (canvas.width - (maxX + minX) * scale) / 2;
  const oy = (canvas.height - (maxY + minY) * scale) / 2;

  ctx.save();
  // Clip to slice boundaries
  ctx.beginPath();
  ctx.rect(clipLeft, 0, clipRight - clipLeft, canvas.height);
  ctx.clip();

  // Background
  ctx.fillStyle = "#0B1B33";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const room of rooms) {
    const rx = ox + room.gridX * scale;
    const ry = oy + room.gridY * scale;
    const rw = room.widthM * scale;
    const rl = room.lengthM * scale;

    // Floor
    ctx.fillStyle = room.hasFlooring ? color.hex : "#1A1F2B";
    ctx.fillRect(rx, ry, rw, rl);

    if (room.hasFlooring) {
      // Draw plank lines
      const plankWPx = 0.18 * scale;
      const plankLPx = 1.22 * scale;
      ctx.strokeStyle = `${color.grainHex}88`;
      ctx.lineWidth = 0.5;

      // Rows of planks
      let sy = 0;
      let rowIdx = 0;
      while (sy < rl) {
        const stagger = rowIdx % 2 === 0 ? 0 : plankLPx / 2;
        let sx = -stagger;
        while (sx < rw) {
          ctx.strokeRect(rx + Math.max(0, sx), ry + sy, Math.min(plankLPx, rw - Math.max(0, sx)), plankWPx);
          sx += plankLPx;
        }
        sy += plankWPx;
        rowIdx++;
      }
    }

    // Room border
    ctx.strokeStyle = "rgba(200,161,90,0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(rx, ry, rw, rl);

    // Label
    ctx.fillStyle = "rgba(246,241,231,0.85)";
    ctx.font = `600 10px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(room.name.toUpperCase(), rx + rw / 2, ry + rl / 2 - 6);
    ctx.fillStyle = "rgba(200,161,90,0.8)";
    ctx.font = `9px 'JetBrains Mono', monospace`;
    ctx.fillText(`${(room.widthM * room.lengthM).toFixed(1)}m²`, rx + rw / 2, ry + rl / 2 + 8);
  }

  ctx.restore();
}

export function ColorCompareSlider({ rooms, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slices, setSlices] = useState<SliceConfig[]>([
    { colorId: "natural-french-oak", boundary: 0.5 },
    { colorId: "smoked-walnut", boundary: 1 },
  ]);
  const [dragging, setDragging] = useState<number | null>(null);

  const addSlice = () => {
    if (slices.length >= 4) return;
    const newBoundary = 1;
    // Even-distribute existing boundaries
    const updated = slices.map((s, i) => ({
      ...s,
      boundary: ((i + 1) / (slices.length + 1)),
    }));
    updated.push({ colorId: SPC_COLORS[slices.length % SPC_COLORS.length]!.id, boundary: 1 });
    setSlices(updated);
  };

  const removeSlice = (idx: number) => {
    if (slices.length <= 2) return;
    const updated = slices.filter((_, i) => i !== idx);
    // Fix last boundary
    updated[updated.length - 1]!.boundary = 1;
    setSlices(updated);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || rooms.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Draw each color slice
    let leftPx = 0;
    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i]!;
      const rightPx = Math.round(slice.boundary * W);
      renderColorSlice(canvas, rooms, slice.colorId, leftPx, rightPx);
      leftPx = rightPx;
    }

    // Draw divider lines + handles
    leftPx = 0;
    for (let i = 0; i < slices.length - 1; i++) {
      const divX = Math.round(slices[i]!.boundary * W);

      // Divider line
      ctx.strokeStyle = "rgba(200,161,90,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(divX, 0);
      ctx.lineTo(divX, H);
      ctx.stroke();

      // Color label above divider
      const color = getColorById(slices[i]!.colorId);
      ctx.fillStyle = "rgba(11,27,51,0.85)";
      ctx.fillRect(leftPx + 4, 8, 90, 20);
      ctx.fillStyle = "rgba(200,161,90,0.9)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(color.name.toUpperCase(), leftPx + 8, 22);

      leftPx = divX;
    }

    // Last slice label
    const lastColor = getColorById(slices[slices.length - 1]!.colorId);
    ctx.fillStyle = "rgba(11,27,51,0.85)";
    ctx.fillRect(leftPx + 4, 8, 90, 20);
    ctx.fillStyle = "rgba(200,161,90,0.9)";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(lastColor.name.toUpperCase(), leftPx + 8, 22);
  }, [rooms, slices]);

  useEffect(() => { draw(); }, [draw]);

  // ── Drag handling ──────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;

    // Find which divider we clicked (within 12px tolerance)
    const tolerance = 12 / rect.width;
    for (let i = 0; i < slices.length - 1; i++) {
      if (Math.abs(x - slices[i]!.boundary) < tolerance) {
        setDragging(i);
        return;
      }
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging === null) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width));

      setSlices((prev) => {
        const updated = [...prev];
        const leftBound = dragging > 0 ? updated[dragging - 1]!.boundary + 0.08 : 0.08;
        const rightBound = dragging < updated.length - 2
          ? updated[dragging + 1]!.boundary - 0.08
          : 0.92;
        updated[dragging] = { ...updated[dragging]!, boundary: Math.max(leftBound, Math.min(rightBound, x)) };
        return updated;
      });
    },
    [dragging]
  );

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    if (dragging !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ro = new ResizeObserver(() => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      draw();
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg text-brand-ivory uppercase tracking-wide">
            Colour Comparison
          </h3>
          <p className="text-xs font-sans text-brand-ivory/50 mt-0.5">
            Drag the gold dividers to compare colours side by side
          </p>
        </div>
        <button
          type="button"
          onClick={addSlice}
          disabled={slices.length >= 4}
          className={cn(
            "px-3 py-1.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border transition-all duration-200",
            slices.length < 4
              ? "border-brand-gold/40 text-brand-ivory/70 hover:border-brand-gold hover:text-brand-ivory"
              : "border-brand-gold/15 text-brand-ivory/30 cursor-not-allowed"
          )}
        >
          + Add Slice ({slices.length}/4)
        </button>
      </div>

      {/* Colour pickers for each slice */}
      <div className="flex gap-2 flex-wrap">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-1.5 p-2 rounded-xs bg-brand-navy border border-brand-gold/20">
            <select
              value={slice.colorId}
              onChange={(e) => {
                const updated = [...slices];
                updated[i] = { ...updated[i]!, colorId: e.target.value };
                setSlices(updated);
              }}
              className="text-[10px] font-mono text-brand-ivory bg-transparent border-none outline-none max-w-[130px]"
            >
              {SPC_COLORS.map((c) => (
                <option key={c.id} value={c.id} style={{ backgroundColor: "#0B1B33" }}>
                  {c.name}
                </option>
              ))}
            </select>
            <div
              className="w-4 h-4 rounded-xs border border-brand-gold/30 shrink-0"
              style={{ backgroundColor: getColorById(slice.colorId).hex }}
            />
            {slices.length > 2 && i < slices.length - 1 && (
              <button
                type="button"
                onClick={() => removeSlice(i)}
                className="text-brand-ivory/30 hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div
        className="relative w-full rounded-sm overflow-hidden border border-brand-gold/20 shadow-xl"
        style={{ height: 300 }}
      >
        {rooms.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-navy">
            <p className="text-xs font-mono text-brand-ivory/40 uppercase tracking-widest">
              Add rooms first to compare colours
            </p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className="block w-full h-full cursor-ew-resize"
              onMouseDown={handleMouseDown}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[9px] font-mono text-brand-gold/50">
              <GripVertical className="w-3 h-3" />
              Drag to compare
            </div>
          </>
        )}
      </div>
    </div>
  );
}

