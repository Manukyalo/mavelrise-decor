"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SpcColorPicker — Luxury swatch strip with room-by-room or global selection
//
// Allows client to:
//   1. Style the whole house with one click
//   2. Or click any room (e.g. Living Room, Master Bedroom) to assign a distinct
//      SPC colour and plank direction to that specific room.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Check, ChevronDown, Sparkles, Sliders, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPC_COLORS, getColorById } from "@/lib/planner/colors";
import type { Room, PlankDirection } from "@/lib/planner/types";

interface Props {
  rooms: Room[];
  globalColorId: string;
  perRoomColors: boolean;
  selectedRoomId?: string | null;
  onSelectRoom?: (id: string | null) => void;
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
  selectedRoomId,
  onSelectRoom,
  onGlobalColorChange,
  onRoomColorChange,
  onPerRoomToggle,
  onDirectionChange,
  onLayPlanks,
  isAnimating,
}: Props) {
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  const flooringRooms = rooms.filter((r) => r.hasFlooring);
  const activeRoom = selectedRoomId ? rooms.find((r) => r.id === selectedRoomId) : null;

  // Active color for the current selection
  const activeColorId = activeRoom
    ? (perRoomColors ? activeRoom.colorId : globalColorId)
    : globalColorId;

  function handleColorClick(colorId: string) {
    if (activeRoom) {
      // User is customizing a specific room
      if (!perRoomColors) onPerRoomToggle(true);
      onRoomColorChange(activeRoom.id, colorId);
    } else {
      // User is applying globally to all rooms
      onGlobalColorChange(colorId);
      if (perRoomColors) {
        // Also update all individual rooms to match
        for (const r of rooms) {
          onRoomColorChange(r.id, colorId);
        }
      }
    }
  }

  function handleDirectionClick(dir: PlankDirection) {
    if (activeRoom) {
      onDirectionChange(activeRoom.id, dir);
    } else {
      onDirectionChange("all", dir);
    }
  }

  return (
    <div className="space-y-5 pb-16">
      {/* ── Title ── */}
      <div>
        <h2 className="font-display text-xl text-brand-ivory uppercase tracking-wide">
          Floor Colour &amp; Finishes
        </h2>
        <p className="text-xs font-sans text-brand-ivory/60 mt-1">
          Select an SPC style for the entire house, or choose individual rooms to combine different finishes.
        </p>
      </div>

      {/* ── Room Target Selector (Whole House vs Individual Rooms) ── */}
      <div className="space-y-2">
        <p className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-semibold flex items-center justify-between">
          <span>Apply Colour To:</span>
          {activeRoom && (
            <button
              type="button"
              onClick={() => onSelectRoom?.(null)}
              className="text-[9px] text-brand-gold/70 hover:text-brand-gold underline uppercase cursor-pointer"
            >
              Reset to Whole House
            </button>
          )}
        </p>

        {/* Horizontal Room Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onSelectRoom?.(null)}
            className={cn(
              "px-2.5 py-1.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5",
              !activeRoom
                ? "bg-brand-gold text-brand-navy border-brand-gold font-bold shadow-md shadow-brand-gold/20"
                : "bg-brand-navy border-brand-gold/20 text-brand-ivory/70 hover:border-brand-gold/50"
            )}
          >
            <Sparkles className="w-3 h-3" />
            <span>Whole House</span>
          </button>

          {flooringRooms.map((room) => {
            const isSelected = activeRoom?.id === room.id;
            const roomColor = getColorById(perRoomColors ? room.colorId : globalColorId);
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectRoom?.(isSelected ? null : room.id)}
                className={cn(
                  "px-2.5 py-1.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5",
                  isSelected
                    ? "bg-brand-gold text-brand-navy border-brand-gold font-bold shadow-md shadow-brand-gold/20"
                    : "bg-brand-navy border-brand-gold/20 text-brand-ivory/70 hover:border-brand-gold/50"
                )}
              >
                <span
                  className="w-2.5 h-2.5 rounded-xs border border-white/20 shrink-0"
                  style={{ backgroundColor: roomColor.hex }}
                />
                <span className="truncate max-w-[110px]">{room.name}</span>
              </button>
            );
          })}
        </div>

        {/* Status Callout */}
        <div className="p-2 rounded-xs bg-brand-navy-deep border border-brand-gold/20 flex items-center justify-between">
          <span className="text-[10px] font-mono text-brand-ivory/70">
            Target:{" "}
            <strong className="text-brand-gold">
              {activeRoom ? activeRoom.name : "Entire House"}
            </strong>
          </span>
          <span className="text-[10px] font-mono text-brand-ivory/50">
            {getColorById(activeColorId).name}
          </span>
        </div>
      </div>

      {/* ── SPC Color Swatches ── */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-semibold">
          SPC Collection ({SPC_COLORS.length} Colours)
        </p>

        <div className="grid grid-cols-4 gap-2">
          {SPC_COLORS.map((color) => {
            const isActive = activeColorId === color.id;
            return (
              <button
                key={color.id}
                type="button"
                title={`${color.name} — ${color.collection}`}
                onClick={() => handleColorClick(color.id)}
                className={cn(
                  "relative group flex flex-col items-center gap-1.5 p-2 rounded-xs border transition-all duration-200 cursor-pointer",
                  isActive
                    ? "border-brand-gold bg-brand-gold/15 shadow-md shadow-brand-gold/15 ring-1 ring-brand-gold"
                    : "border-brand-gold/15 hover:border-brand-gold/50 bg-brand-navy hover:bg-brand-navy-light"
                )}
              >
                {/* Wood Swatch Preview */}
                <div
                  className="w-full aspect-[2/1] rounded-xs shadow-inner relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 7px, ${color.grainHex}44 7px, ${color.grainHex}44 8px)`,
                    }}
                  />
                  <div
                    className="absolute inset-x-0 top-0 h-1/3"
                    style={{
                      background: `linear-gradient(180deg, ${color.highlightHex}30 0%, transparent 100%)`,
                    }}
                  />
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/35">
                      <Check className="w-3.5 h-3.5 text-brand-gold" />
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-mono text-brand-ivory/80 group-hover:text-brand-ivory text-center leading-tight truncate w-full">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Plank Direction Controls ── */}
      <div className="space-y-2">
        <p className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-semibold flex items-center justify-between">
          <span>Plank Direction</span>
          <span className="text-[9px] font-mono text-brand-ivory/40">
            {activeRoom ? `For ${activeRoom.name}` : "For All Rooms"}
          </span>
        </p>

        <div className="flex gap-2">
          {DIRECTION_OPTIONS.map((d) => {
            const isDirActive = activeRoom
              ? activeRoom.plankDirection === d.value
              : flooringRooms.every((r) => r.plankDirection === d.value);

            return (
              <button
                key={d.value}
                type="button"
                onClick={() => handleDirectionClick(d.value)}
                className={cn(
                  "flex-1 py-1.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border transition-all duration-200 cursor-pointer",
                  isDirActive
                    ? "bg-brand-gold border-brand-gold text-brand-navy font-bold shadow-md shadow-brand-gold/15"
                    : "bg-brand-navy border-brand-gold/20 text-brand-ivory/60 hover:border-brand-gold/40 hover:text-brand-ivory"
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Room-by-Room Finishes Accordion ── */}
      <div className="space-y-2 pt-2 border-t border-brand-gold/15">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-mono text-brand-ivory uppercase tracking-wider font-semibold">
            Room Finishes Summary
          </p>
          <span className="text-[10px] font-mono text-brand-gold/70">
            {flooringRooms.length} styled spaces
          </span>
        </div>

        <div className="space-y-1.5">
          {flooringRooms.map((room) => {
            const color = getColorById(perRoomColors ? room.colorId : globalColorId);
            const isExpanded = expandedRoom === room.id;
            const isTarget = activeRoom?.id === room.id;

            return (
              <div
                key={room.id}
                className={cn(
                  "rounded-xs border transition-all duration-150 overflow-hidden",
                  isTarget
                    ? "border-brand-gold bg-brand-gold/5 shadow-sm"
                    : "border-brand-gold/15 bg-brand-navy"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setExpandedRoom(isExpanded ? null : room.id);
                    onSelectRoom?.(room.id);
                  }}
                  className="w-full flex items-center justify-between gap-3 p-2.5 hover:bg-brand-navy-card transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-5 h-5 rounded-xs border border-brand-gold/30 shadow-inner shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="text-left truncate">
                      <p className="text-[11px] font-mono text-brand-ivory font-semibold truncate">
                        {room.name}
                      </p>
                      <p className="text-[9px] font-mono text-brand-gold/70">
                        {color.name} · {room.plankDirection}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-brand-ivory/40 transition-transform duration-200 shrink-0",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="p-3 bg-brand-navy-card border-t border-brand-gold/10 space-y-2.5">
                    <p className="text-[9px] font-mono text-brand-gold uppercase tracking-wider">
                      Pick colour for {room.name}:
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {SPC_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          title={c.name}
                          onClick={() => {
                            if (!perRoomColors) onPerRoomToggle(true);
                            onRoomColorChange(room.id, c.id);
                          }}
                          className={cn(
                            "relative rounded-xs border overflow-hidden transition-all duration-150 cursor-pointer",
                            room.colorId === c.id
                              ? "border-brand-gold ring-1 ring-brand-gold"
                              : "border-brand-gold/15 hover:border-brand-gold/50"
                          )}
                        >
                          <div
                            className="w-full aspect-square relative"
                            style={{ backgroundColor: c.hex }}
                          >
                            {room.colorId === c.id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/30">
                                <Check className="w-2.5 h-2.5 text-brand-gold" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      {DIRECTION_OPTIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => onDirectionChange(room.id, d.value)}
                          className={cn(
                            "flex-1 py-1 rounded-xs text-[9px] font-mono uppercase tracking-wider border transition-all duration-150 cursor-pointer",
                            room.plankDirection === d.value
                              ? "bg-brand-gold border-brand-gold text-brand-navy font-bold"
                              : "bg-brand-navy border-brand-gold/20 text-brand-ivory/50 hover:border-brand-gold/40"
                          )}
                        >
                          {d.value === "diagonal" ? "×45°" : d.label.replace("wise", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Primary Action: Lay Planks ── */}
      <button
        type="button"
        onClick={onLayPlanks}
        disabled={isAnimating}
        className={cn(
          "w-full py-3.5 rounded-xs text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer",
          isAnimating
            ? "bg-brand-navy border border-brand-gold/20 text-brand-ivory/40 cursor-wait"
            : "bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-xl shadow-brand-gold/25"
        )}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{isAnimating ? "Laying Planks..." : "Lay Planks Animation"}</span>
      </button>
    </div>
  );
}
