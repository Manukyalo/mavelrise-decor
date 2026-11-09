"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SpcColorPicker — luxury swatch strip with per-room or global selection
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPC_COLORS, getColorById } from "@/lib/planner/colors";
import type { Room, PlankDirection } from "@/lib/planner/types";

interface Props {
  rooms: Room[];
  globalColorId: string;
  perRoomColors: boolean;
  onGlobalColorChange: (id: string) => void;
  onRoomColorChange: (roomId: string, colorId: string) => void;
  onPerRoomToggle: (val: boolean) => void;
  onDirectionChange: (roomId: string | "all", dir: PlankDirection) => void;
  onLayPlanks: () => void;
  isAnimating: boolean;
}

const DIRECTION_OPTIONS: Array<{ value: PlankDirection; label: string }> = [
  { value: "lengthwise", label: "Lengthwise" },
  { value: "crosswise", label: "Crosswise" },
  { value: "diagonal", label: "Diagonal ×45°" },
];

export function SpcColorPicker({
  rooms,
  globalColorId,
  perRoomColors,
  onGlobalColorChange,
  onRoomColorChange,
  onPerRoomToggle,
  onDirectionChange,
  onLayPlanks,
  isAnimating,
}: Props) {
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  const flooringRooms = rooms.filter((r) => r.hasFlooring);

  return (
    <div className="space-y-5 pb-14">
      <div>
        <h2 className="font-display text-xl text-brand-ivory uppercase tracking-wide">
          Floor Colour &amp; Direction
        </h2>
        <p className="text-xs font-sans text-brand-ivory/60 mt-1">
          Choose your SPC style. Applying a colour will lay the planks room by room.
        </p>
      </div>

      {/* Global swatches */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-semibold">
          Colour Collection
        </p>
        <div className="grid grid-cols-4 gap-2">
          {SPC_COLORS.map((color) => {
            const isActive = !perRoomColors && globalColorId === color.id;
            return (
              <button
                key={color.id}
                type="button"
                title={`${color.name} — ${color.collection}`}
                onClick={() => {
                  onGlobalColorChange(color.id);
                  if (perRoomColors) onPerRoomToggle(false);
                }}
                className={cn(
                  "relative group flex flex-col items-center gap-1.5 p-2 rounded-xs border transition-all duration-200",
                  isActive
                    ? "border-brand-gold bg-brand-gold/10"
                    : "border-brand-gold/15 hover:border-brand-gold/40 bg-brand-navy"
                )}
              >
                {/* Swatch */}
                <div
                  className="w-full aspect-[2/1] rounded-xs shadow-inner relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Grain lines */}
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 7px, ${color.grainHex}44 7px, ${color.grainHex}44 8px)`,
                    }}
                  />
                  {/* Highlight */}
                  <div
                    className="absolute inset-x-0 top-0 h-1/3"
                    style={{
                      background: `linear-gradient(180deg, ${color.highlightHex}30 0%, transparent 100%)`,
                    }}
                  />
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/30">
                      <Check className="w-3 h-3 text-brand-ivory" />
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-brand-ivory/70 group-hover:text-brand-ivory text-center leading-tight truncate w-full">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global plank direction */}
      <div className="space-y-2">
        <p className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-semibold">
          Plank Direction
        </p>
        <div className="flex gap-2">
          {DIRECTION_OPTIONS.map((d) => {
            const allSame = flooringRooms.every((r) => r.plankDirection === d.value);
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => onDirectionChange("all", d.value)}
                className={cn(
                  "flex-1 py-1.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border transition-all duration-200",
                  allSame && !perRoomColors
                    ? "bg-brand-gold border-brand-gold text-brand-navy font-bold"
                    : "bg-brand-navy border-brand-gold/20 text-brand-ivory/60 hover:border-brand-gold/40 hover:text-brand-ivory"
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Per-room toggle */}
      <div className="flex items-center justify-between py-2 border-t border-brand-gold/10">
        <div>
          <p className="text-[11px] font-mono text-brand-ivory uppercase tracking-wider">
            Per-Room Colours
          </p>
          <p className="text-[10px] font-sans text-brand-ivory/40 mt-0.5">
            Set a different SPC style for each room
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={perRoomColors}
          onClick={() => onPerRoomToggle(!perRoomColors)}
          className={cn(
            "relative w-10 h-5 rounded-full border transition-all duration-300",
            perRoomColors
              ? "bg-brand-gold border-brand-gold"
              : "bg-brand-navy border-brand-gold/30"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-brand-ivory shadow transition-all duration-300",
              perRoomColors ? "left-5" : "left-0.5"
            )}
          />
        </button>
      </div>

      {/* Per-room colour/direction panels */}
      {perRoomColors && (
        <div className="space-y-2">
          {flooringRooms.map((room) => {
            const color = getColorById(room.colorId);
            const isExpanded = expandedRoom === room.id;
            return (
              <div
                key={room.id}
                className="rounded-xs border border-brand-gold/15 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedRoom(isExpanded ? null : room.id)}
                  className="w-full flex items-center justify-between gap-3 p-3 bg-brand-navy hover:bg-brand-navy-card transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-xs border border-brand-gold/30 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-mono text-brand-ivory font-semibold">
                        {room.name}
                      </p>
                      <p className="text-[9px] font-mono text-brand-gold/60">
                        {color.name} · {room.plankDirection}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-brand-ivory/40 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="p-3 bg-brand-navy-card border-t border-brand-gold/10 space-y-3">
                    <div className="grid grid-cols-4 gap-1.5">
                      {SPC_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          title={c.name}
                          onClick={() => onRoomColorChange(room.id, c.id)}
                          className={cn(
                            "relative rounded-xs border overflow-hidden transition-all duration-150",
                            room.colorId === c.id
                              ? "border-brand-gold ring-1 ring-brand-gold"
                              : "border-brand-gold/15 hover:border-brand-gold/40"
                          )}
                        >
                          <div
                            className="w-full aspect-square"
                            style={{ backgroundColor: c.hex }}
                          >
                            <div
                              className="absolute inset-0 opacity-40"
                              style={{
                                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 5px, ${c.grainHex}44 5px, ${c.grainHex}44 6px)`,
                              }}
                            />
                            {room.colorId === c.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/20">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-1.5">
                      {DIRECTION_OPTIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => onDirectionChange(room.id, d.value)}
                          className={cn(
                            "flex-1 py-1 rounded-xs text-[9px] font-mono uppercase tracking-wider border transition-all duration-150",
                            room.plankDirection === d.value
                              ? "bg-brand-gold border-brand-gold text-brand-navy font-bold"
                              : "bg-brand-navy border-brand-gold/20 text-brand-ivory/50 hover:border-brand-gold/40"
                          )}
                        >
                          {d.value === "diagonal" ? "×45°" : d.label.split("wise")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lay planks CTA */}
      <button
        type="button"
        onClick={onLayPlanks}
        disabled={isAnimating}
        className={cn(
          "w-full py-3.5 rounded-sm text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300",
          isAnimating
            ? "bg-brand-navy border border-brand-gold/20 text-brand-ivory/40 cursor-wait"
            : "bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-xl shadow-brand-gold/30"
        )}
      >
        {isAnimating ? "Laying Planks…" : "Lay Planks"}
      </button>
    </div>
  );
}

