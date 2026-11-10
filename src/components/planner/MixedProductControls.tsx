"use client";

import React, { useState } from "react";
import { Room } from "@/lib/planner/types";
import {
  WPC_OPTIONS,
  MARBLE_OPTIONS,
  LAMP_OPTIONS,
  DECOR_OPTIONS,
  getStylePairingForFloor,
  WpcPanelOption,
  MarbleOption,
  LampOption,
  DecorOption,
} from "@/lib/planner/pairings";
import {
  Layers,
  Sparkles,
  SunDim,
  Lightbulb,
  LightbulbOff,
  Wand2,
  Check,
  Palette,
  VolumeX,
  Compass,
} from "lucide-react";

interface MixedProductControlsProps {
  rooms: Room[];
  selectedRoomId: string | null;
  activeFloorCode: string;
  onUpdateRoom: (roomId: string, patch: Partial<Room>) => void;
  onApplyToAllRooms: (patch: Partial<Room>) => void;
  onApplyCompleteLook: (pairing: ReturnType<typeof getStylePairingForFloor>) => void;
  activeSubTab: "walls" | "lighting" | "decor" | "pairing";
}

export function MixedProductControls({
  rooms,
  selectedRoomId,
  activeFloorCode,
  onUpdateRoom,
  onApplyToAllRooms,
  onApplyCompleteLook,
  activeSubTab,
}: MixedProductControlsProps) {
  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  const pairing = getStylePairingForFloor(activeFloorCode);

  const [wallCategory, setWallCategory] = useState<"wpc" | "marble">("wpc");

  if (!currentRoom) return null;

  return (
    <div className="space-y-6">
      {/* Target Room Header Indicator */}
      <div className="flex items-center justify-between p-3 rounded-xs bg-[#03060c] border border-white/10 text-xs font-mono">
        <div>
          <span className="text-white/40 block text-[9px] uppercase">Styling Target</span>
          <span className="text-amber-400 font-semibold">{currentRoom.name}</span>
        </div>
        <span className="text-[10px] text-white/50">
          {(currentRoom.widthM * currentRoom.lengthM).toFixed(1)} m²
        </span>
      </div>

      {/* ── 1. WALL SELECTOR TAB ────────────────────────────────────────────── */}
      {activeSubTab === "walls" && (
        <div className="space-y-5">
          {/* Wall Category Pill Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 border border-white/10 rounded-xs">
            <button
              onClick={() => setWallCategory("wpc")}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${wallCategory === "wpc"
                  ? "bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/20"
                  : "text-white/60 hover:text-white"
                }`}
            >
              WPC Fluted Panels
            </button>
            <button
              onClick={() => setWallCategory("marble")}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${wallCategory === "marble"
                  ? "bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/20"
                  : "text-white/60 hover:text-white"
                }`}
            >
              UV Marble Sheets
            </button>
          </div>

          {/* None / Reset Option */}
          <button
            onClick={() => {
              onUpdateRoom(currentRoom.id, {
                wallFinishType: "none",
                wallFinishCode: undefined,
              });
            }}
            className={`w-full py-2 px-3 text-xs font-mono rounded-xs border text-center transition-all ${!currentRoom.wallFinishType || currentRoom.wallFinishType === "none"
                ? "bg-white/15 border-white/30 text-white font-medium"
                : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
              }`}
          >
            Plain Architectural Masonry (No Wall Finish)
          </button>

          {/* WPC Panel Swatches */}
          {wallCategory === "wpc" && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
                Acoustic Fluted Profiles (NRC 0.65)
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {WPC_OPTIONS.map((wpc) => {
                  const isSelected =
                    currentRoom.wallFinishType === "wpc" &&
                    currentRoom.wallFinishCode === wpc.code;

                  return (
                    <button
                      key={wpc.code}
                      onClick={() => {
                        onUpdateRoom(currentRoom.id, {
                          wallFinishType: "wpc",
                          wallFinishCode: wpc.code,
                        });
                      }}
                      className={`p-3 rounded-xs border text-left transition-all relative ${isSelected
                          ? "bg-amber-400/15 border-amber-400 text-white shadow-lg shadow-amber-400/10"
                          : "bg-black/30 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: wpc.colorHex }}
                        />
                        <span className="font-mono text-[10px] text-amber-300">
                          {wpc.code}
                        </span>
                      </div>
                      <div className="text-xs font-medium font-serif truncate">
                        {wpc.name}
                      </div>
                      <div className="text-[10px] font-mono text-white/40 mt-1">
                        KES {wpc.priceKesPerSqm.toLocaleString()} / m²
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Marble Sheet Swatches */}
          {wallCategory === "marble" && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
                UV Marble & Adhesive Slabs
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {MARBLE_OPTIONS.map((mrb) => {
                  const isSelected =
                    currentRoom.wallFinishType === "marble" &&
                    currentRoom.wallFinishCode === mrb.code;

                  return (
                    <button
                      key={mrb.code}
                      onClick={() => {
                        onUpdateRoom(currentRoom.id, {
                          wallFinishType: "marble",
                          wallFinishCode: mrb.code,
                        });
                      }}
                      className={`p-3 rounded-xs border text-left transition-all relative ${isSelected
                          ? "bg-amber-400/15 border-amber-400 text-white shadow-lg shadow-amber-400/10"
                          : "bg-black/30 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: mrb.bgHex }}
                        />
                        <span className="font-mono text-[10px] text-amber-300">
                          {mrb.code}
                        </span>
                      </div>
                      <div className="text-xs font-medium font-serif truncate">
                        {mrb.name}
                      </div>
                      <div className="text-[10px] font-mono text-white/40 mt-1">
                        KES {mrb.priceKesPerSqm.toLocaleString()} / m²
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Apply Wall to All Rooms Button */}
          {currentRoom.wallFinishType && currentRoom.wallFinishType !== "none" && (
            <button
              onClick={() => {
                onApplyToAllRooms({
                  wallFinishType: currentRoom.wallFinishType,
                  wallFinishCode: currentRoom.wallFinishCode,
                });
              }}
              className="w-full py-2.5 px-4 rounded-xs border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono uppercase tracking-wider transition-all"
            >
              Apply Wall Cladding to All Rooms
            </button>
          )}
        </div>
      )}

      {/* ── 2. CEILING LIGHTS / LAMPSHADES TAB ──────────────────────────────── */}
      {activeSubTab === "lighting" && (
        <div className="space-y-5">
          {/* Light Glow On/Off Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/10 rounded-xs">
            <div className="flex items-center gap-2.5">
              {currentRoom.lampLightOn !== false ? (
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-400/20">
                  <Lightbulb className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <LightbulbOff className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="text-xs font-mono text-white font-medium block">
                  Diurnal Illumination
                </span>
                <span className="text-[10px] text-white/40 block">
                  {currentRoom.lampLightOn !== false
                    ? "2700K Radiant Floor Pools"
                    : "Pendants Off (Daylight Mode)"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const nextState = currentRoom.lampLightOn === false;
                onUpdateRoom(currentRoom.id, { lampLightOn: nextState });
              }}
              className={`px-3 py-1.5 rounded-xs text-xs font-mono font-semibold uppercase tracking-wider transition-all ${currentRoom.lampLightOn !== false
                  ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                  : "bg-white/10 text-white/60 hover:text-white"
                }`}
            >
              {currentRoom.lampLightOn !== false ? "Lights On" : "Lights Off"}
            </button>
          </div>

          {/* Remove Lamp Button */}
          <button
            onClick={() => {
              onUpdateRoom(currentRoom.id, { lampCode: undefined });
            }}
            className={`w-full py-2 px-3 text-xs font-mono rounded-xs border text-center transition-all ${!currentRoom.lampCode
                ? "bg-white/15 border-white/30 text-white font-medium"
                : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
              }`}
          >
            No Ceiling Pendant
          </button>

          {/* MRDP Series Lampshade Grid */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
              MRDP Artisanal Pendant Luminaires
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {LAMP_OPTIONS.map((lamp) => {
                const isSelected = currentRoom.lampCode === lamp.code;

                return (
                  <button
                    key={lamp.code}
                    onClick={() => {
                      onUpdateRoom(currentRoom.id, {
                        lampCode: lamp.code,
                        lampLightOn: true,
                      });
                    }}
                    className={`p-3 rounded-xs border text-left transition-all relative ${isSelected
                        ? "bg-amber-400/15 border-amber-400 text-white shadow-lg shadow-amber-400/10"
                        : "bg-black/30 border-white/10 text-white/70 hover:border-white/30"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: lamp.shadeHex }}
                      />
                      <span className="font-mono text-[10px] text-amber-300">
                        {lamp.code}
                      </span>
                    </div>
                    <div className="text-xs font-medium font-serif truncate">
                      {lamp.name}
                    </div>
                    <div className="text-[10px] font-mono text-white/40 mt-1">
                      KES {lamp.priceKesPerPiece.toLocaleString()}
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apply Lamp to All Rooms Button */}
          {currentRoom.lampCode && (
            <button
              onClick={() => {
                onApplyToAllRooms({
                  lampCode: currentRoom.lampCode,
                  lampLightOn: currentRoom.lampLightOn !== false,
                });
              }}
              className="w-full py-2.5 px-4 rounded-xs border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono uppercase tracking-wider transition-all"
            >
              Hang This Luminaire in All Rooms
            </button>
          )}
        </div>
      )}

      {/* ── 3. DECOR LAYER TAB ─────────────────────────────────────────────── */}
      {activeSubTab === "decor" && (
        <div className="space-y-5">
          {/* Clear Decor */}
          <button
            onClick={() => {
              onUpdateRoom(currentRoom.id, { decorCode: undefined });
            }}
            className={`w-full py-2 px-3 text-xs font-mono rounded-xs border text-center transition-all ${!currentRoom.decorCode
                ? "bg-white/15 border-white/30 text-white font-medium"
                : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
              }`}
          >
            No Accent Decor Item
          </button>

          <div className="space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
              Curated Tactile Artifacts
            </span>

            <div className="space-y-2">
              {DECOR_OPTIONS.map((decor) => {
                const isSelected = currentRoom.decorCode === decor.code;

                return (
                  <button
                    key={decor.code}
                    onClick={() => {
                      onUpdateRoom(currentRoom.id, { decorCode: decor.code });
                    }}
                    className={`w-full p-3.5 rounded-xs border text-left transition-all flex items-center justify-between ${isSelected
                        ? "bg-amber-400/15 border-amber-400 text-white shadow-lg shadow-amber-400/10"
                        : "bg-black/30 border-white/10 text-white/70 hover:border-white/30"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: decor.colorHex }}
                      />
                      <div>
                        <div className="text-xs font-medium font-serif">
                          {decor.name}
                        </div>
                        <div className="text-[10px] font-mono text-amber-300/80">
                          {decor.code}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono text-white/80">
                        KES {decor.priceKesPerPiece.toLocaleString()}
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">
                          Placed ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. COMPLETE THE LOOK TAB ───────────────────────────────────────── */}
      {activeSubTab === "pairing" && (
        <div className="space-y-6">
          <div className="p-4 rounded-sm bg-gradient-to-br from-[#0c1422] to-[#040810] border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Architectural Harmony Engine</span>
            </div>

            <div>
              <h3 className="font-serif text-lg text-white font-medium">
                {pairing.styleTitle}
              </h3>
              <p className="text-[11px] font-mono text-amber-200/80 mt-0.5">
                {pairing.styleSubtitle}
              </p>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-light">
              {pairing.narrative}
            </p>

            {/* Curated Swatch Strip */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                Harmonized Ensemble:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 bg-black/40 border border-white/5 rounded-xs">
                  <span className="text-white/40 block text-[8px] uppercase">Floor</span>
                  <span className="text-amber-300 truncate block">{pairing.floorCode}</span>
                </div>
                <div className="p-2 bg-black/40 border border-white/5 rounded-xs">
                  <span className="text-white/40 block text-[8px] uppercase">WPC Wall</span>
                  <span className="text-amber-300 truncate block">{pairing.wpcCode}</span>
                </div>
                <div className="p-2 bg-black/40 border border-white/5 rounded-xs">
                  <span className="text-white/40 block text-[8px] uppercase">Marble</span>
                  <span className="text-amber-300 truncate block">{pairing.marbleCode}</span>
                </div>
                <div className="p-2 bg-black/40 border border-white/5 rounded-xs">
                  <span className="text-white/40 block text-[8px] uppercase">Lampshade</span>
                  <span className="text-amber-300 truncate block">{pairing.lampCode}</span>
                </div>
              </div>
            </div>

            {/* One-Click Apply Button */}
            <button
              onClick={() => onApplyCompleteLook(pairing)}
              className="w-full py-3.5 px-4 rounded-xs bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-400/20"
            >
              <Wand2 className="w-4 h-4" />
              <span>Apply Complete Designer Look</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

