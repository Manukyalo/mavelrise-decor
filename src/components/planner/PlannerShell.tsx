"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PlannerShell — master state manager for the isometric house planner
// Coordinates: RoomSetup → CanvasView → ColorPicker → Quote → Share
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  RotateCcw,
  Map,
  Layers,
  Calculator,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  Play,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Room, PlannerDesign, MeasurementUnit, QualityTier } from "@/lib/planner/types";
import { calculateQuote } from "@/lib/planner/geometry";
import { getColorById, SPC_COLORS } from "@/lib/planner/colors";
import { nanoid } from "@/lib/planner/nanoid";
import { DEFAULT_COLOR_ID } from "@/lib/planner/colors";
import { RoomSetupPanel } from "./RoomSetupPanel";
import { SpcColorPicker } from "./SpcColorPicker";
import { PlankQuotePanel } from "./PlankQuotePanel";
import { ColorCompareSlider } from "./ColorCompareSlider";
import { IsometricHouseCanvas, type IsometricCanvasRef } from "./IsometricHouseCanvas";

type PlannerTab = "rooms" | "colours" | "quote" | "compare";
type ViewMode = "iso" | "top";

/** Detect device quality tier */
function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const cores = navigator.hardwareConcurrency ?? 2;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 2;
  if (cores >= 8 && memory >= 4) return "high";
  if (cores >= 4 && memory >= 2) return "medium";
  return "low";
}

export function PlannerShell() {
  // ── State ────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<"setup" | "design">("setup");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [globalColorId, setGlobalColorId] = useState(DEFAULT_COLOR_ID);
  const [perRoomColors, setPerRoomColors] = useState(false);
  const [tab, setTab] = useState<PlannerTab>("rooms");
  const [viewMode, setViewMode] = useState<ViewMode>("iso");
  const [zoom, setZoom] = useState(1);
  const [unit, setUnit] = useState<MeasurementUnit>("m");
  const [qualityTier] = useState<QualityTier>(detectQualityTier);
  const [isAnimating, setIsAnimating] = useState(false);
  const [plankProgress, setPlankProgress] = useState({ laid: 0, total: 0 });
  const [quote, setQuote] = useState<ReturnType<typeof calculateQuote> | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const canvasRef = useRef<IsometricCanvasRef>(null);

  // ── Build colorMap from rooms + global default ───────────────────────────
  const colorMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof getColorById>> = {};
    // Always include all SPC colors by ID
    for (const c of SPC_COLORS) map[c.id] = c;
    return map;
  }, []);

  // Effective per-room color resolution
  const resolvedColorMap = useMemo(() => {
    const result: Record<string, ReturnType<typeof getColorById>> = {};
    for (const room of rooms) {
      const colorId = perRoomColors ? room.colorId : globalColorId;
      result[room.colorId] = getColorById(colorId);
      // Override: map room's colorId to whatever it should be
      result[colorId] = getColorById(colorId);
    }
    return { ...colorMap, ...result };
  }, [rooms, globalColorId, perRoomColors, colorMap]);

  // ── Effective rooms with resolved colors ─────────────────────────────────
  const effectiveRooms = useMemo(() => {
    if (perRoomColors) return rooms;
    return rooms.map((r) => ({ ...r, colorId: globalColorId }));
  }, [rooms, globalColorId, perRoomColors]);

  // ── Handle direction change ──────────────────────────────────────────────
  const handleDirectionChange = useCallback(
    (roomId: string | "all", dir: Room["plankDirection"]) => {
      setRooms((prev) =>
        prev.map((r) =>
          roomId === "all" || r.id === roomId ? { ...r, plankDirection: dir } : r
        )
      );
    },
    []
  );

  // ── Lay planks ───────────────────────────────────────────────────────────
  const layPlanks = useCallback(() => {
    const layouts = calculateQuote(effectiveRooms).layouts;
    setQuote(calculateQuote(effectiveRooms));
    setPlankProgress({ laid: 0, total: layouts.reduce((s, l) => s + l.plankPositions.length, 0) });
    setIsAnimating(true);
    setTab("quote");

    if (reducedMotion) {
      canvasRef.current?.skipAnimation();
      setIsAnimating(false);
    } else {
      canvasRef.current?.triggerPlankAnimation(layouts, resolvedColorMap);
    }
  }, [effectiveRooms, resolvedColorMap, reducedMotion]);

  // ── Confirm room setup and move to design ────────────────────────────────
  const handleConfirmRooms = useCallback(() => {
    if (rooms.length === 0) return;
    setStep("design");
    setTab("colours");
    // After short delay, trigger cinematic entry — scroll canvas into view
    setTimeout(() => {
      canvasRef.current?.setView("iso");
    }, 300);
  }, [rooms]);

  // ── Share / save (Supabase) ──────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!quote) return;
    const design: PlannerDesign = {
      templateType: "custom",
      rooms: effectiveRooms,
      globalColorId,
      perRoomColors,
      plankDirection: effectiveRooms[0]?.plankDirection ?? "lengthwise",
    };

    try {
      const res = await fetch("/api/planner/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
      });
      if (res.ok) {
        const data = await res.json() as { shareCode: string };
        setShareCode(data.shareCode);
        await navigator.clipboard.writeText(
          `${window.location.origin}/planner?code=${data.shareCode}`
        );
      }
    } catch {
      // Fallback: generate a local code
      setShareCode(nanoid().slice(0, 6).toUpperCase());
    }
  }, [quote, effectiveRooms, globalColorId, perRoomColors]);

  const handleWhatsApp = useCallback(() => {
    if (!quote) return;
    const color = getColorById(globalColorId);
    const msg = encodeURIComponent(
      `Hello MarvelRise Decor,\n\nI have designed my space using your planner:\n` +
      `• ${rooms.length} rooms · ${quote.totalAreaSqm.toFixed(1)} m² total area\n` +
      `• SPC Colour: ${color.name}\n` +
      `• Estimated boxes: ${quote.totalBoxes}\n\n` +
      `Please confirm the quote and arrange a site visit.` +
      (shareCode ? `\n\nDesign code: ${shareCode}` : "")
    );
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "254712345678"}?text=${msg}`, "_blank");
  }, [quote, rooms, globalColorId, shareCode]);

  // ── Sidebar tabs config ──────────────────────────────────────────────────
  const sidebarTabs: Array<{ id: PlannerTab; icon: React.ReactNode; label: string }> = [
    { id: "rooms", icon: <Map className="w-4 h-4" />, label: "Rooms" },
    { id: "colours", icon: <Layers className="w-4 h-4" />, label: "Colour" },
    { id: "quote", icon: <Calculator className="w-4 h-4" />, label: "Quote" },
    { id: "compare", icon: <SlidersHorizontal className="w-4 h-4" />, label: "Compare" },
  ];

  // ── Setup screen ─────────────────────────────────────────────────────────
  if (step === "setup") {
    return (
      <div className="min-h-screen bg-brand-navy pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Page header */}
          <div className="mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy-elevated border border-brand-gold/30 text-[10px] font-mono tracking-widest text-brand-gold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              <span>Isometric Room Planner · Beta</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-light text-brand-ivory uppercase leading-tight">
              Design Your <span className="italic text-brand-gold">Space</span>
            </h1>
            <p className="text-sm font-sans text-brand-ivory/60 max-w-lg leading-relaxed">
              Enter your room measurements and watch your house come to life as an
              architectural cutaway. Pick SPC colours, see planks laid in real time,
              and get an instant box count — ready for the site survey.
            </p>
          </div>

          {/* Room setup card */}
          <div className="p-6 sm:p-8 rounded-sm bg-brand-navy-card border border-brand-gold/20 shadow-2xl">
            <RoomSetupPanel
              rooms={rooms}
              onRoomsChange={setRooms}
              onConfirm={handleConfirmRooms}
              unit={unit}
              onUnitChange={setUnit}
            />
          </div>

          <p className="mt-6 text-[11px] font-mono text-brand-ivory/30 text-center leading-relaxed">
            This is a schematic planner — not a surveyed architectural drawing.
            All dimensions are confirmed at the site visit.
          </p>
        </div>
      </div>
    );
  }

  // ── Design screen ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-navy flex flex-col pt-20">
      {/* Top bar */}
      <div className="border-b border-brand-gold/15 bg-brand-navy-deep px-4 py-2 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setStep("setup"); setTab("rooms"); }}
            className="text-[11px] font-mono text-brand-ivory/50 hover:text-brand-ivory uppercase tracking-wider transition-colors"
          >
            ← Edit Rooms
          </button>
          <div className="w-px h-4 bg-brand-gold/20" />
          <span className="text-[11px] font-mono text-brand-gold/70 uppercase tracking-wider">
            {rooms.length} room{rooms.length !== 1 ? "s" : ""} ·{" "}
            {rooms.reduce((s, r) => s + r.widthM * r.lengthM, 0).toFixed(1)} m²
          </span>
        </div>

        {/* View controls */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xs overflow-hidden border border-brand-gold/20">
            <button
              type="button"
              title="Isometric view"
              onClick={() => { setViewMode("iso"); canvasRef.current?.setView("iso"); }}
              className={cn(
                "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1",
                viewMode === "iso"
                  ? "bg-brand-gold text-brand-navy font-bold"
                  : "bg-brand-navy text-brand-ivory/60 hover:text-brand-ivory"
              )}
            >
              <Eye className="w-3 h-3" /> ISO
            </button>
            <button
              type="button"
              title="Top-down floor plan"
              onClick={() => { setViewMode("top"); canvasRef.current?.setView("top"); }}
              className={cn(
                "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1",
                viewMode === "top"
                  ? "bg-brand-gold text-brand-navy font-bold"
                  : "bg-brand-navy text-brand-ivory/60 hover:text-brand-ivory"
              )}
            >
              <Map className="w-3 h-3" /> 2D
            </button>
          </div>

          {/* Zoom */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            className="p-1.5 text-brand-ivory/60 hover:text-brand-ivory transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-brand-ivory/50 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            className="p-1.5 text-brand-ivory/60 hover:text-brand-ivory transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Quality badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-navy border border-brand-gold/15 text-[9px] font-mono text-brand-gold/50 uppercase tracking-wider">
            {qualityTier} quality
          </div>
        </div>
      </div>

      {/* Main layout: canvas + sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Canvas ── */}
        <div className="flex-1 relative min-h-[400px] overflow-hidden bg-brand-navy-deep">
          <IsometricHouseCanvas
            ref={canvasRef}
            rooms={effectiveRooms}
            colorMap={resolvedColorMap}
            qualityTier={qualityTier}
            viewMode={viewMode}
            zoom={zoom}
            onPlankProgress={(laid, total) =>
              setPlankProgress({ laid, total })
            }
            onAnimationComplete={() => setIsAnimating(false)}
            className="w-full h-full"
          />

          {/* Animation controls overlay */}
          {isAnimating && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => { canvasRef.current?.skipAnimation(); setIsAnimating(false); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xs bg-brand-navy-deep/90 border border-brand-gold/40 text-brand-ivory text-xs font-mono uppercase tracking-wider backdrop-blur-sm"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Skip
              </button>
            </div>
          )}

          {/* Replay button after animation completes */}
          {!isAnimating && plankProgress.total > 0 && plankProgress.laid >= plankProgress.total && (
            <div className="absolute bottom-4 right-4">
              <button
                type="button"
                onClick={() => {
                  setIsAnimating(true);
                  canvasRef.current?.replayAnimation();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-brand-navy-deep/90 border border-brand-gold/30 text-brand-ivory/70 hover:text-brand-ivory text-[10px] font-mono uppercase tracking-wider backdrop-blur-sm transition-colors"
              >
                <Play className="w-3 h-3" />
                Replay
              </button>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="w-[320px] xl:w-[360px] shrink-0 border-l border-brand-gold/15 flex flex-col bg-brand-navy overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-brand-gold/15 shrink-0">
            {sidebarTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-3 text-[9px] font-mono uppercase tracking-wider transition-all duration-200",
                  tab === t.id
                    ? "text-brand-gold border-b-2 border-brand-gold bg-brand-navy-card"
                    : "text-brand-ivory/40 hover:text-brand-ivory/70 border-b-2 border-transparent"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-luxury">
            {tab === "rooms" && (
              <RoomSetupPanel
                rooms={rooms}
                onRoomsChange={setRooms}
                onConfirm={() => setTab("colours")}
                unit={unit}
                onUnitChange={setUnit}
              />
            )}

            {tab === "colours" && (
              <SpcColorPicker
                rooms={rooms}
                globalColorId={globalColorId}
                perRoomColors={perRoomColors}
                onGlobalColorChange={(id) => { setGlobalColorId(id); }}
                onRoomColorChange={(roomId, colorId) =>
                  setRooms((prev) =>
                    prev.map((r) => (r.id === roomId ? { ...r, colorId } : r))
                  )
                }
                onPerRoomToggle={setPerRoomColors}
                onDirectionChange={handleDirectionChange}
                onLayPlanks={layPlanks}
                isAnimating={isAnimating}
              />
            )}

            {tab === "quote" && (
              <PlankQuotePanel
                quote={quote}
                laid={plankProgress.laid}
                total={plankProgress.total}
                isAnimating={isAnimating}
                shareCode={shareCode}
                onShare={handleShare}
                onWhatsApp={handleWhatsApp}
                whatsAppPhone={process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "254712345678"}
              />
            )}

            {tab === "compare" && (
              <ColorCompareSlider rooms={effectiveRooms} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

