"use client";

// ─────────────────────────────────────────────────────────────────────────────
// RoomSetupPanel — Architectural layout template selector & room dimensions form
//
// Supports Single Room, Studio, 1BR, 2BR, 3BR, 4BR, Office, and Custom layouts.
// Changes immediately recompute the 3D dollhouse cutaway model.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Plus, Trash2, ArrowRight, Home, Building2, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Room, TemplateType, MeasurementUnit } from "@/lib/planner/types";
import { TEMPLATES } from "@/lib/planner/templates";
import { nanoid } from "@/lib/planner/nanoid";
import { DEFAULT_COLOR_ID } from "@/lib/planner/colors";

interface Props {
  rooms: Room[];
  onRoomsChange: (rooms: Room[]) => void;
  onConfirm: () => void;
  unit: MeasurementUnit;
  onUnitChange: (u: MeasurementUnit) => void;
  selectedTemplate?: TemplateType;
  onTemplateSelect?: (t: TemplateType) => void;
}

const TEMPLATE_PRESETS: Array<{
  id: TemplateType;
  label: string;
  badge: string;
  desc: string;
  icon?: typeof Home;
}> = [
  { id: "single", label: "Single Room", badge: "Suite", desc: "1 Room · 1 Bath · ~26 m²" },
  { id: "studio", label: "Studio", badge: "Open Plan", desc: "Studio · Kitchenette · ~45 m²" },
  { id: "1bed", label: "1 Bedroom", badge: "1BR", desc: "1 Bed · 1 Bath · ~52 m²" },
  { id: "2bed", label: "2 Bedrooms", badge: "2BR", desc: "2 Beds · 2 Baths · ~98 m²" },
  { id: "3bed", label: "3 Bedrooms", badge: "3BR", desc: "3 Beds · 2 Baths · ~144 m²" },
  { id: "4bed", label: "4 Bedrooms", badge: "4BR Villa", desc: "4 Beds · 3 Baths · ~210 m²" },
  { id: "office", label: "Office", badge: "Commercial", desc: "Open Plan · Boardroom · ~110 m²" },
  { id: "custom", label: "Custom", badge: "Blank", desc: "Build room by room" },
];

const ROOM_TYPE_OPTIONS: Array<{ value: Room["type"]; label: string }> = [
  { value: "living", label: "Living Room" },
  { value: "master", label: "Master Bedroom" },
  { value: "bedroom", label: "Bedroom" },
  { value: "bathroom", label: "Bathroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "dining", label: "Dining Room" },
  { value: "office", label: "Office / Study" },
  { value: "hallway", label: "Hallway" },
  { value: "other", label: "Other" },
];

function ftToM(ft: number) { return parseFloat((ft * 0.3048).toFixed(2)); }
function mToFt(m: number) { return parseFloat((m * 3.28084).toFixed(2)); }

export function RoomSetupPanel({
  rooms,
  onRoomsChange,
  onConfirm,
  unit,
  onUnitChange,
  selectedTemplate = "2bed",
  onTemplateSelect,
}: Props) {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(selectedTemplate);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    type: "bedroom" as Room["type"],
    width: "",
    length: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const totalAreaSqm = rooms.reduce((s, r) => s + r.widthM * r.lengthM, 0);

  function handleSelectTemplate(id: TemplateType) {
    setActiveTemplate(id);
    onTemplateSelect?.(id);
    const template = TEMPLATES[id];
    onRoomsChange(template.map((r) => ({ ...r, id: nanoid() })));
  }

  function display(metres: number) {
    return unit === "m"
      ? `${metres.toFixed(2)} m`
      : `${mToFt(metres).toFixed(2)} ft`;
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const rawW = parseFloat(addForm.width);
    const rawL = parseFloat(addForm.length);
    if (!addForm.name.trim()) { setFormError("Room name is required."); return; }
    if (isNaN(rawW) || rawW <= 0) { setFormError("Enter a valid width."); return; }
    if (isNaN(rawL) || rawL <= 0) { setFormError("Enter a valid length."); return; }

    const widthM = unit === "m" ? rawW : ftToM(rawW);
    const lengthM = unit === "m" ? rawL : ftToM(rawL);

    if (widthM > 50 || lengthM > 50) { setFormError("Maximum room dimension is 50m."); return; }

    // Auto-position to the right or below
    const maxY = rooms.reduce((s, r) => Math.max(s, r.gridY + r.lengthM), 0);

    const newRoom: Room = {
      id: nanoid(),
      name: addForm.name.trim(),
      type: addForm.type,
      widthM,
      lengthM,
      gridX: 0,
      gridY: maxY,
      colorId: DEFAULT_COLOR_ID,
      plankDirection: "lengthwise",
      hasFlooring: addForm.type !== "bathroom",
    };

    onRoomsChange([...rooms, newRoom]);
    setAddForm({ name: "", type: "bedroom", width: "", length: "" });
    setShowAddForm(false);
  }

  function removeRoom(id: string) {
    onRoomsChange(rooms.filter((r) => r.id !== id));
  }

  function updateRoom(id: string, patch: Partial<Room>) {
    onRoomsChange(rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div className="space-y-6">
      {/* ── 1. Architectural Layout Presets (Studio, Single, 1BR, 2BR, 3BR, 4BR, etc.) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-mono text-brand-gold uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select House Layout Template</span>
          </p>
          <span className="text-[10px] font-mono text-brand-ivory/50 uppercase">
            Click to auto-adjust 3D layout
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEMPLATE_PRESETS.map((t) => {
            const isSelected = activeTemplate === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTemplate(t.id)}
                className={cn(
                  "p-3 rounded-xs border text-left transition-all duration-200 group relative flex flex-col justify-between cursor-pointer",
                  isSelected
                    ? "bg-brand-gold/15 border-brand-gold shadow-lg shadow-brand-gold/10 ring-1 ring-brand-gold"
                    : "bg-brand-navy border-brand-gold/15 hover:border-brand-gold/50 hover:bg-brand-navy-light"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={cn(
                        "text-xs font-display uppercase tracking-wider font-semibold",
                        isSelected ? "text-brand-gold" : "text-brand-ivory group-hover:text-brand-gold transition-colors"
                      )}
                    >
                      {t.label}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-brand-gold" />}
                  </div>
                  <p className="text-[10px] font-mono text-brand-ivory/50 leading-tight">
                    {t.desc}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-xs bg-brand-navy-deep border border-brand-gold/20 text-brand-gold/70">
                    {t.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Room List & Measurements ── */}
      <div className="space-y-3 pt-2 border-t border-brand-gold/15">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg text-brand-ivory uppercase tracking-wide">
              Room Dimensions
            </h3>
            <p className="text-[11px] font-mono text-brand-ivory/60">
              {rooms.length} rooms · {totalAreaSqm.toFixed(1)} m² ({Math.round(totalAreaSqm * 10.764)} sq ft) total area
            </p>
          </div>

          {/* Unit Toggle (Metres vs Feet) */}
          <div className="flex rounded-xs overflow-hidden border border-brand-gold/25">
            <button
              type="button"
              onClick={() => onUnitChange("m")}
              className={cn(
                "px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer",
                unit === "m"
                  ? "bg-brand-gold text-brand-navy font-bold"
                  : "bg-brand-navy text-brand-ivory/60 hover:text-brand-ivory"
              )}
            >
              M
            </button>
            <button
              type="button"
              onClick={() => onUnitChange("ft")}
              className={cn(
                "px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer",
                unit === "ft"
                  ? "bg-brand-gold text-brand-navy font-bold"
                  : "bg-brand-navy text-brand-ivory/60 hover:text-brand-ivory"
              )}
            >
              FT
            </button>
          </div>
        </div>

        {/* Room items list */}
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 scrollbar-luxury">
          {rooms.map((room) => {
            const areaM2 = room.widthM * room.lengthM;
            return (
              <div
                key={room.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xs border border-brand-gold/15 bg-brand-navy hover:bg-brand-navy-light transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-brand-ivory font-semibold truncate">
                      {room.name}
                    </span>
                    <span className="text-[10px] font-mono text-brand-gold/70">
                      {display(room.widthM)} × {display(room.lengthM)}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-brand-ivory/40">
                    {areaM2.toFixed(1)} m² · {room.hasFlooring ? "SPC Flooring" : "Tile / Wet Area"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateRoom(room.id, { hasFlooring: !room.hasFlooring })}
                    className={cn(
                      "px-2 py-1 rounded-xs text-[9px] font-mono uppercase tracking-wider border transition-colors cursor-pointer",
                      room.hasFlooring
                        ? "bg-brand-gold/20 border-brand-gold/40 text-brand-gold"
                        : "bg-brand-navy-deep border-brand-gold/15 text-brand-ivory/40"
                    )}
                  >
                    {room.hasFlooring ? "SPC" : "SKIP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeRoom(room.id)}
                    title="Remove room"
                    className="p-1 text-brand-ivory/30 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom room trigger */}
        {!showAddForm ? (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full py-2.5 rounded-xs border border-dashed border-brand-gold/30 text-brand-gold hover:text-brand-gold-light hover:border-brand-gold hover:bg-brand-gold/5 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Room</span>
          </button>
        ) : (
          <form onSubmit={handleAdd} className="p-3.5 rounded-xs border border-brand-gold/30 bg-brand-navy-deep space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Room Name (e.g. Nursery)"
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs bg-brand-navy border border-brand-gold/20 text-brand-ivory placeholder-brand-ivory/40 rounded-xs focus:outline-none focus:border-brand-gold"
              />
              <select
                value={addForm.type}
                onChange={(e) => setAddForm((f) => ({ ...f, type: e.target.value as Room["type"] }))}
                className="w-full px-2.5 py-1.5 text-xs bg-brand-navy border border-brand-gold/20 text-brand-ivory rounded-xs focus:outline-none focus:border-brand-gold"
              >
                {ROOM_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="50"
                placeholder={`Width (${unit})`}
                value={addForm.width}
                onChange={(e) => setAddForm((f) => ({ ...f, width: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs bg-brand-navy border border-brand-gold/20 text-brand-ivory placeholder-brand-ivory/40 rounded-xs focus:outline-none focus:border-brand-gold"
              />
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="50"
                placeholder={`Length (${unit})`}
                value={addForm.length}
                onChange={(e) => setAddForm((f) => ({ ...f, length: e.target.value }))}
                className="w-full px-2.5 py-1.5 text-xs bg-brand-navy border border-brand-gold/20 text-brand-ivory placeholder-brand-ivory/40 rounded-xs focus:outline-none focus:border-brand-gold"
              />
            </div>

            {formError && <p className="text-[11px] text-red-400 font-mono">{formError}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 rounded-xs bg-brand-gold text-brand-navy font-mono text-xs uppercase font-bold hover:bg-brand-gold-hover cursor-pointer"
              >
                Save Room
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xs bg-brand-navy border border-brand-gold/20 text-brand-ivory/60 hover:text-brand-ivory font-mono text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── 3. Primary Action: Build Isometric House ── */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={rooms.length === 0}
        className={cn(
          "w-full py-3.5 rounded-xs text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer",
          rooms.length > 0
            ? "bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-xl shadow-brand-gold/25"
            : "bg-brand-navy border border-brand-gold/20 text-brand-ivory/40 cursor-not-allowed"
        )}
      >
        <span>Build 3D Isometric House</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
