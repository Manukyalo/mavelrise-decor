"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PlannerShell — Master state & view controller for the Isometric House Planner
//
// Follows the architectural dollhouse reference (WhatsApp inspo) in luxury
// deep navy & champagne gold.
//
// Features:
//   - Architectural Layout Presets: Single Room (Bedsitter), Studio, 1BR, 2BR,
//     3BR, 4BR Villa, Office, and Custom.
//   - Instant 3D dollhouse cutaway model adaptation to the chosen layout.
//   - Room-by-room SPC floor styling: style the whole house at once, or click
//     any room in 3D or in the sidebar to assign a distinct colour & direction.
//   - Animated staggered click-lock plank laying.
//   - Exact box & waste calculations for instant contractor-grade quoting.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
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
  Sparkles,
  Building,
  Lightbulb,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Room, PlannerDesign, MeasurementUnit, QualityTier, TemplateType, StylePairing } from "@/lib/planner/types";
import { calculateQuote } from "@/lib/planner/geometry";
import { getColorById, SPC_COLORS } from "@/lib/planner/colors";
import { nanoid } from "@/lib/planner/nanoid";
import { DEFAULT_COLOR_ID } from "@/lib/planner/colors";
import { RoomSetupPanel } from "./RoomSetupPanel";
import { SpcColorPicker } from "./SpcColorPicker";
import { MixedProductControls } from "./MixedProductControls";
import { PlankQuotePanel } from "./PlankQuotePanel";
import { ColorCompareSlider } from "./ColorCompareSlider";
import { IsometricHouseCanvas, type IsometricCanvasRef } from "./IsometricHouseCanvas";
import { TEMPLATES } from "@/lib/planner/templates";

type PlannerStep = "setup" | "design";
type PlannerTab = "colours" | "walls" | "lighting" | "decor" | "pairing" | "quote" | "rooms" | "compare";
type ViewMode = "iso" | "top";

/** Detect device hardware tier for smooth 60fps operation */
function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const cores = navigator.hardwareConcurrency ?? 2;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 2;
  if (cores >= 8 && memory >= 4) return "high";
  if (cores >= 4 && memory >= 2) return "medium";
  return "low";
}

export function PlannerShell() {
  // ── Step 1 (Setup Measurements) vs Step 2 (3D Design & Finishing) ─────────
  const [step, setStep] = useState<PlannerStep>("setup");

  // Active template preset (defaults to 2-Bedroom)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("2bed");

  // Preload with 2-Bedroom architectural layout for the setup form
  const [rooms, setRooms] = useState<Room[]>(() =>
    TEMPLATES["2bed"].map((r) => ({ ...r, id: nanoid() }))
  );

  // Active selected room for individual colour/direction styling
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [globalColorId, setGlobalColorId] = useState(DEFAULT_COLOR_ID);
  const [perRoomColors, setPerRoomColors] = useState(false);
  const [tab, setTab] = useState<PlannerTab>("colours");
  const [viewMode, setViewMode] = useState<ViewMode>("iso");
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [showFurniture, setShowFurniture] = useState<boolean>(true);
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

  // Read ?color=... from Catalogue "Add to Design" button
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const colorParam = params.get("color");
    if (colorParam) {
      const match = getColorById(colorParam);
      if (match) {
        setGlobalColorId(match.id);
        setStep("design");
      }
    }
  }, []);

  const canvasRef = useRef<IsometricCanvasRef>(null);

  // ── Template Switch Handler (Replaces entire house layout) ───────────────
  const handleTemplateChange = useCallback((tmpl: TemplateType) => {
    setSelectedTemplate(tmpl);
    const templateRooms = TEMPLATES[tmpl];
    const newRooms = templateRooms.map((r) => ({ ...r, id: nanoid() }));
    setRooms(newRooms);
    setSelectedRoomId(null);
  }, []);

  // ── Build colorMap from rooms + global default ───────────────────────────
  const colorMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof getColorById>> = {};
    for (const c of SPC_COLORS) map[c.id] = c;
    return map;
  }, []);

  // Effective per-room color resolution
  const resolvedColorMap = useMemo(() => {
    const result: Record<string, ReturnType<typeof getColorById>> = {};
    for (const room of rooms) {
      const colorId = perRoomColors ? room.colorId : globalColorId;
      result[room.colorId] = getColorById(colorId);
      result[colorId] = getColorById(colorId);
    }
    return { ...colorMap, ...result };
  }, [rooms, globalColorId, perRoomColors, colorMap]);

  // Effective rooms with resolved colors
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

  // ── Lay planks animation trigger ─────────────────────────────────────────
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

  // ── Transition from Setup Screen to 3D Isometric View ────────────────────
  const handleConfirmRooms = useCallback(() => {
    if (rooms.length === 0) return;
    setStep("design");
    setTab("colours");
    setTimeout(() => {
      canvasRef.current?.setView("iso");
    }, 250);
  }, [rooms]);

  // ── 90° Snap Rotation ────────────────────────────────────────────────────
  const handleRotate = useCallback(() => {
    setRotation((prev) => {
      const next = ((prev + 90) % 360) as 0 | 90 | 180 | 270;
      canvasRef.current?.setRotation(next);
      return next;
    });
  }, []);

  // ── Toggle ISO / 2D View ─────────────────────────────────────────────────
  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      const next = prev === "iso" ? "top" : "iso";
      canvasRef.current?.setView(next);
      return next;
    });
  }, []);

  // ── Share / Save Design ──────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!quote) return;
    const design: PlannerDesign = {
      templateType: selectedTemplate,
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
      setShareCode(nanoid().slice(0, 6).toUpperCase());
    }
  }, [quote, effectiveRooms, globalColorId, perRoomColors, selectedTemplate]);

  const handleWhatsApp = useCallback(() => {
    if (!quote) return;
    const color = getColorById(globalColorId);
    const msg = encodeURIComponent(
      `Hello MarvelRise Decor,\n\nI have designed my space using your planner:\n` +
      `• ${rooms.length} rooms · ${quote.totalAreaSqm.toFixed(1)} m² total area\n` +
      `• Layout: ${selectedTemplate.toUpperCase()}\n` +
      `• Primary SPC Colour: ${color.name}\n` +
      `• Estimated boxes: ${quote.totalBoxes}\n\n` +
      `Please confirm the quote and arrange a site consultation.` +
      (shareCode ? `\n\nDesign code: ${shareCode}` : "")
    );
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "254712345678"}?text=${msg}`, "_blank");
  }, [quote, rooms, globalColorId, shareCode, selectedTemplate]);

  const handleUpdateRoom = useCallback((roomId: string, patch: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, ...patch } : r))
    );
  }, []);

  const handleApplyToAllRooms = useCallback((patch: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => ({ ...r, ...patch })));
  }, []);

  const handleApplyCompleteLook = useCallback((pairing: StylePairing) => {
    const matchedColor = getColorById(pairing.floorCode);
    setGlobalColorId(matchedColor.id);
    setPerRoomColors(false);

    setRooms((prev) =>
      prev.map((r, idx) => ({
        ...r,
        colorId: matchedColor.id,
        wallFinishType: "wpc",
        wallFinishCode: pairing.wpcCode,
        lampCode: pairing.lampCode,
        lampLightOn: true,
        decorCode: idx === 0 ? pairing.decorCode : undefined,
      }))
    );
  }, []);

  // ── Sidebar tabs config ──────────────────────────────────────────────────
  const sidebarTabs: Array<{ id: PlannerTab; icon: React.ReactNode; label: string }> = [
    { id: "colours", icon: <Layers className="w-3.5 h-3.5" />, label: "Floor" },
    { id: "walls", icon: <Building className="w-3.5 h-3.5" />, label: "Walls" },
    { id: "lighting", icon: <Lightbulb className="w-3.5 h-3.5" />, label: "Lights" },
    { id: "decor", icon: <Sparkles className="w-3.5 h-3.5" />, label: "Decor" },
    { id: "pairing", icon: <Wand2 className="w-3.5 h-3.5" />, label: "Curated" },
    { id: "quote", icon: <Calculator className="w-3.5 h-3.5" />, label: "Quote" },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 1: INITIAL ROOM MEASUREMENT & TEMPLATE SELECTION SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "setup") {
    return (
      <div className="min-h-screen bg-brand-navy pt-28 sm:pt-36 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 space-y-2.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy-card border border-brand-gold/30 text-[10px] font-mono tracking-widest text-brand-gold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              <span>Architectural Room Planner · Step 1 of 2</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-brand-ivory uppercase leading-tight">
              Select Your <span className="italic text-brand-gold">House Layout</span>
            </h1>
            <p className="text-xs sm:text-sm font-sans text-brand-ivory/70 max-w-xl leading-relaxed">
              Choose from Single Room, Studio, 1BR, 2BR, 3BR, 4BR Villa or Custom.
              Adjust room dimensions to your architectural plan, then preview your house
              as an interactive 3D dollhouse cutaway.
            </p>
          </div>

          {/* Room setup card with layout selector */}
          <div className="p-5 sm:p-8 rounded-xs bg-brand-navy-card border border-brand-gold/20 shadow-2xl">
            <RoomSetupPanel
              rooms={rooms}
              onRoomsChange={setRooms}
              onConfirm={handleConfirmRooms}
              unit={unit}
              onUnitChange={setUnit}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateChange}
            />
          </div>

          <p className="mt-6 text-[11px] font-mono text-brand-ivory/40 text-center leading-relaxed">
            Schematic generated from entered dimensions. Final measurements verified during the MarvelRise site consultation.
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STEP 2: 3D ISOMETRIC DOLLHOUSE CUTAWAY & FLOORING FINISHES STUDIO
  // ══════════════════════════════════════════════════════════════════════════
  return (
    // Note: pt-[72px] sm:pt-[80px] clears the fixed navbar completely so top controls are never covered!
    <div className="w-full bg-brand-navy flex flex-col overflow-hidden h-[100dvh] pt-[72px] sm:pt-[80px]">
      {/* Top bar — 100% visible, unobstructed, and clickable */}
      <div className="border-b border-brand-gold/15 bg-brand-navy-deep px-4 py-2.5 flex items-center justify-between gap-4 shrink-0 z-30 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep("setup")}
            className="text-[11px] font-mono text-brand-gold hover:text-brand-gold-light uppercase tracking-wider transition-colors flex items-center gap-1.5 font-semibold bg-brand-navy px-2.5 py-1 rounded-xs border border-brand-gold/25 cursor-pointer"
          >
            <span>← Edit Measurements &amp; Layout</span>
          </button>

          {/* Quick House Template Switcher in 3D Mode */}
          <div className="hidden md:flex items-center gap-1.5 bg-brand-navy px-2 py-0.5 rounded-xs border border-brand-gold/25">
            <Building className="w-3 h-3 text-brand-gold/80" />
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value as TemplateType)}
              className="bg-transparent text-brand-gold font-mono text-[10px] uppercase font-semibold focus:outline-none cursor-pointer"
              title="Switch house layout template"
            >
              <option value="single" className="bg-brand-navy text-brand-ivory">Single Room (Bedsitter)</option>
              <option value="studio" className="bg-brand-navy text-brand-ivory">Studio Apartment</option>
              <option value="1bed" className="bg-brand-navy text-brand-ivory">1 Bedroom (1BR)</option>
              <option value="2bed" className="bg-brand-navy text-brand-ivory">2 Bedrooms (2BR)</option>
              <option value="3bed" className="bg-brand-navy text-brand-ivory">3 Bedrooms (3BR)</option>
              <option value="4bed" className="bg-brand-navy text-brand-ivory">4 Bedrooms (4BR Villa)</option>
              <option value="office" className="bg-brand-navy text-brand-ivory">Commercial Office</option>
              <option value="custom" className="bg-brand-navy text-brand-ivory">Custom Layout</option>
            </select>
          </div>

          <div className="w-px h-4 bg-brand-gold/20 hidden sm:block" />
          <span className="text-[11px] font-mono text-brand-ivory/70 uppercase tracking-wider hidden sm:inline-block">
            {rooms.length} room{rooms.length !== 1 ? "s" : ""} ·{" "}
            {rooms.reduce((s, r) => s + r.widthM * r.lengthM, 0).toFixed(1)} m²
          </span>
        </div>

        {/* View controls */}
        <div className="flex items-center gap-2">
          {/* View toggle (ISO vs 2D) */}
          <div className="flex rounded-xs overflow-hidden border border-brand-gold/20">
            <button
              type="button"
              title="Isometric dollhouse cutaway"
              onClick={() => { setViewMode("iso"); canvasRef.current?.setView("iso"); }}
              className={cn(
                "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer",
                viewMode === "iso"
                  ? "bg-brand-gold text-brand-navy font-bold"
                  : "bg-brand-navy text-brand-ivory/60 hover:text-brand-ivory"
              )}
            >
              <Eye className="w-3 h-3" /> ISO
            </button>
            <button
              type="button"
              title="Top-down 2D architectural schematic"
              onClick={() => { setViewMode("top"); canvasRef.current?.setView("top"); }}
              className={cn(
                "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer",
                viewMode === "top"
                  ? "bg-brand-gold text-brand-navy font-bold"
                  : "bg-brand-navy text-brand-ivory/60 hover:text-brand-ivory"
              )}
            >
              <Map className="w-3 h-3" /> 2D
            </button>
          </div>

          {/* Rotate 90° button (in ISO mode) */}
          {viewMode === "iso" && (
            <button
              type="button"
              title="Rotate dollhouse 90°"
              onClick={handleRotate}
              className="px-2.5 py-1.5 rounded-xs border border-brand-gold/25 bg-brand-navy hover:bg-brand-navy-light text-brand-gold hover:text-brand-gold-light transition-colors flex items-center gap-1.5 text-[10px] font-mono cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{rotation}°</span>
            </button>
          )}

          {/* Furniture silhouettes toggle */}
          {viewMode === "iso" && (
            <button
              type="button"
              title="Toggle architectural furniture silhouettes"
              onClick={() => setShowFurniture((f) => !f)}
              className={cn(
                "px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs border transition-colors flex items-center gap-1 cursor-pointer",
                showFurniture
                  ? "bg-brand-gold/20 border-brand-gold/50 text-brand-gold font-semibold"
                  : "bg-brand-navy border-brand-gold/20 text-brand-ivory/50 hover:text-brand-ivory"
              )}
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Decor</span> {showFurniture ? "ON" : "OFF"}
            </button>
          )}

          {/* Metric / Imperial Unit Toggle */}
          <button
            type="button"
            title="Toggle measurement units (metres / feet)"
            onClick={() => setUnit((u) => (u === "m" ? "ft" : "m"))}
            className="px-2.5 py-1.5 rounded-xs border border-brand-gold/25 bg-brand-navy text-[10px] font-mono text-brand-gold/80 hover:text-brand-gold uppercase font-semibold transition-colors cursor-pointer"
          >
            {unit === "m" ? "M²" : "SQ FT"}
          </button>

          {/* Zoom controls */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            className="p-1.5 text-brand-ivory/60 hover:text-brand-ivory transition-colors cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-brand-ivory/50 w-9 text-center hidden sm:inline-block">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            className="p-1.5 text-brand-ivory/60 hover:text-brand-ivory transition-colors cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Quality badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-navy border border-brand-gold/15 text-[9px] font-mono text-brand-gold/50 uppercase tracking-wider">
            {qualityTier} quality
          </div>
        </div>
      </div>

      {/* Main layout: canvas viewport + sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── 3D Dollhouse Canvas Viewport ── */}
        <div className="flex-1 relative min-h-[400px] overflow-hidden bg-brand-navy-deep">
          <IsometricHouseCanvas
            ref={canvasRef}
            rooms={effectiveRooms}
            colorMap={resolvedColorMap}
            qualityTier={qualityTier}
            viewMode={viewMode}
            zoom={zoom}
            rotation={rotation}
            showFurniture={showFurniture}
            unit={unit}
            selectedRoomId={selectedRoomId}
            onSelectRoom={(id) => {
              setSelectedRoomId(id);
              setTab("colours");
            }}
            onPlankProgress={(laid, total) => setPlankProgress({ laid, total })}
            onAnimationComplete={() => setIsAnimating(false)}
            onToggleViewMode={toggleViewMode}
            className="w-full h-full"
          />

          {/* Animation controls overlay */}
          {isAnimating && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={() => { canvasRef.current?.skipAnimation(); setIsAnimating(false); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xs bg-brand-navy-deep/95 border border-brand-gold/50 text-brand-ivory text-xs font-mono uppercase tracking-wider backdrop-blur-md shadow-xl"
              >
                <SkipForward className="w-3.5 h-3.5 text-brand-gold" />
                Skip Animation
              </button>
            </div>
          )}

          {/* Replay button after animation completes */}
          {!isAnimating && plankProgress.total > 0 && plankProgress.laid >= plankProgress.total && (
            <div className="absolute bottom-5 right-5 z-20">
              <button
                type="button"
                onClick={() => {
                  setIsAnimating(true);
                  canvasRef.current?.replayAnimation();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-brand-navy-deep/90 border border-brand-gold/30 text-brand-ivory/80 hover:text-brand-ivory text-[10px] font-mono uppercase tracking-wider backdrop-blur-md transition-colors shadow-lg"
              >
                <Play className="w-3 h-3 text-brand-gold" />
                Replay Animation
              </button>
            </div>
          )}
        </div>

        {/* ── Right Control Sidebar ── */}
        <div className="w-[320px] xl:w-[370px] shrink-0 border-l border-brand-gold/15 flex flex-col bg-brand-navy overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-brand-gold/15 shrink-0 bg-brand-navy-deep/60">
            {sidebarTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 text-[9px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer",
                  tab === t.id
                    ? "text-brand-gold border-b-2 border-brand-gold bg-brand-navy-card font-semibold"
                    : "text-brand-ivory/40 hover:text-brand-ivory/70 border-b-2 border-transparent"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content area with ample bottom clearance (pb-24) so nothing cuts off */}
          <div className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-luxury">
            {tab === "colours" && (
              <SpcColorPicker
                rooms={rooms}
                globalColorId={globalColorId}
                perRoomColors={perRoomColors}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
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

            {(tab === "walls" || tab === "lighting" || tab === "decor" || tab === "pairing") && (
              <MixedProductControls
                rooms={rooms}
                selectedRoomId={selectedRoomId}
                activeFloorCode={getColorById(globalColorId).code || "GJ6345-3"}
                onUpdateRoom={handleUpdateRoom}
                onApplyToAllRooms={handleApplyToAllRooms}
                onApplyCompleteLook={handleApplyCompleteLook}
                activeSubTab={tab}
              />
            )}

            {tab === "rooms" && (
              <RoomSetupPanel
                rooms={rooms}
                onRoomsChange={setRooms}
                onConfirm={() => setTab("colours")}
                unit={unit}
                onUnitChange={setUnit}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateChange}
              />
            )}

            {tab === "quote" && (
              <PlankQuotePanel
                quote={quote}
                rooms={effectiveRooms}
                globalColorId={globalColorId}
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
