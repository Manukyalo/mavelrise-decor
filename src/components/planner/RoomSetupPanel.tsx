"use client";

// ─────────────────────────────────────────────────────────────────────────────
// RoomSetupPanel — Step 1 of the planner
// Template picker → room entry form → room list with inline edit
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Plus, Trash2, ChevronRight, AlertCircle } from "lucide-react";
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
}

const TEMPLATE_OPTIONS: Array<{ id: TemplateType; label: string; desc: string }> = [
  { id: "studio",  label: "Studio",        desc: "Open plan · 1 bath" },
  { id: "1bed",    label: "1 Bedroom",     desc: "1 bed · 1 bath" },
  { id: "2bed",    label: "2 Bedrooms",    desc: "2 beds · 2 baths" },
  { id: "3bed",    label: "3 Bedrooms",    desc: "3 beds · 2 baths" },
  { id: "office",  label: "Office",        desc: "Open plan · meeting rooms" },
  { id: "custom",  label: "Custom",        desc: "Build from scratch" },
];

const ROOM_TYPE_OPTIONS: Array<{ value: Room["type"]; label: string }> = [
  { value: "living",   label: "Living Room" },
  { value: "master",   label: "Master Bedroom" },
  { value: "bedroom",  label: "Bedroom" },
  { value: "bathroom", label: "Bathroom" },
  { value: "kitchen",  label: "Kitchen" },
  { value: "dining",   label: "Dining Room" },
  { value: "office",   label: "Office / Study" },
  { value: "hallway",  label: "Hallway" },
  { value: "other",    label: "Other" },
];

function ftToM(ft: number) { return parseFloat((ft * 0.3048).toFixed(2)); }
function mToFt(m: number)  { return parseFloat((m * 3.28084).toFixed(2)); }

export function RoomSetupPanel({ rooms, onRoomsChange, onConfirm, unit, onUnitChange }: Props) {
  const [step, setStep] = useState<"template" | "rooms">("template");
  const [addForm, setAddForm] = useState({
    name: "",
    type: "living" as Room["type"],
    width: "",
    length: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const totalAreaSqm = rooms.reduce((s, r) => s + r.widthM * r.lengthM, 0);

  function pickTemplate(id: TemplateType) {
    const template = TEMPLATES[id];
    onRoomsChange(template.map((r) => ({ ...r, id: nanoid() })));
    setStep("rooms");
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

    // Auto-position: stack vertically below existing rooms
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
    setAddForm({ name: "", type: "living", width: "", length: "" });
  }

  function removeRoom(id: string) {
    onRoomsChange(rooms.filter((r) => r.id !== id));
  }

  function updateRoom(id: string, patch: Partial<Room>) {
    onRoomsChange(rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  // ── Template picker ──────────────────────────────────────────────────────
  if (step === "template") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl text-brand-ivory uppercase tracking-wide">
            Choose a Starting Layout
          </h2>
          <p className="text-xs font-sans text-brand-ivory/60 mt-1 leading-relaxed">
            Select a template to populate a typical room arrangement, or start
            from a custom blank canvas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TEMPLATE_OPTIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => pickTemplate(t.id)}
              className={cn(
                "p-4 rounded-sm border text-left transition-all duration-200 group",
                "bg-brand-navy-card border-brand-gold/20 hover:border-brand-gold/60",
                "hover:bg-brand-navy-light"
              )}
            >
              <div className="text-sm font-display text-brand-ivory uppercase font-semibold group-hover:text-brand-gold transition-colors">
                {t.label}
              </div>
              <div className="text-[11px] font-mono text-brand-ivory/50 mt-1">
                {t.desc}
              </div>
            </button>
          ))}
        </div>

        <p className="text-[11px] font-mono text-brand-ivory/40 leading-relaxed border-t border-brand-gold/10 pt-4">
          Note: All layouts are schematics derived from your measurements — not
          architectural drawings. Final dimensions are verified at the site visit.
        </p>
      </div>
    );
  }

  // ── Room editor ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header + unit toggle */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-brand-ivory uppercase tracking-wide">
            Your Rooms
          </h2>
          <p className="text-[11px] font-mono text-brand-ivory/50 mt-0.5">
            {rooms.length} room{rooms.length !== 1 ? "s" : ""} ·{" "}
            {totalAreaSqm.toFixed(1)} m² total
          </p>
        </div>
        <div className="flex items-center rounded-xs border border-brand-gold/25 overflow-hidden shrink-0">
          {(["m", "ft"] as MeasurementUnit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onUnitChange(u)}
              className={cn(
                "px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors",
                unit === u
                  ? "bg-brand-gold text-brand-navy font-bold"
                  : "bg-brand-navy text-brand-ivory/60 hover:text-brand-ivory"
              )}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-luxury">
        {rooms.length === 0 && (
          <p className="text-xs font-mono text-brand-ivory/40 text-center py-6">
            No rooms yet. Add your first room below.
          </p>
        )}
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center gap-3 p-3 rounded-xs bg-brand-navy border border-brand-gold/15 hover:border-brand-gold/35 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-brand-ivory truncate font-semibold">
                {room.name}
              </div>
              <div className="text-[10px] font-mono text-brand-gold/70 mt-0.5">
                {display(room.widthM)} × {display(room.lengthM)} ·{" "}
                {(room.widthM * room.lengthM).toFixed(1)} m²
              </div>
            </div>

            {/* Flooring toggle */}
            <button
              type="button"
              onClick={() => updateRoom(room.id, { hasFlooring: !room.hasFlooring })}
              className={cn(
                "text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors",
                room.hasFlooring
                  ? "bg-brand-gold/20 border-brand-gold/40 text-brand-gold"
                  : "bg-brand-navy border-brand-gold/15 text-brand-ivory/40"
              )}
            >
              {room.hasFlooring ? "SPC" : "Skip"}
            </button>

            <button
              type="button"
              onClick={() => removeRoom(room.id)}
              className="text-brand-ivory/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add room form */}
      <form onSubmit={handleAdd} className="space-y-3 border-t border-brand-gold/15 pt-4">
        <p className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-semibold">
          Add Room
        </p>

        {formError && (
          <div className="flex items-center gap-2 text-red-400 text-[11px] font-mono">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Room name"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            className="col-span-2 w-full px-3 py-2 rounded-xs bg-brand-navy border border-brand-gold/20 focus:border-brand-gold text-brand-ivory text-xs font-mono placeholder:text-brand-ivory/30 focus:outline-none transition-colors"
          />

          <select
            value={addForm.type}
            onChange={(e) => setAddForm({ ...addForm, type: e.target.value as Room["type"] })}
            className="col-span-2 w-full px-3 py-2 rounded-xs bg-brand-navy border border-brand-gold/20 focus:border-brand-gold text-brand-ivory text-xs font-mono focus:outline-none transition-colors appearance-none"
          >
            {ROOM_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="number"
              min="0.5"
              max="50"
              step="0.1"
              placeholder="Width"
              value={addForm.width}
              onChange={(e) => setAddForm({ ...addForm, width: e.target.value })}
              className="w-full px-3 py-2 pr-8 rounded-xs bg-brand-navy border border-brand-gold/20 focus:border-brand-gold text-brand-ivory text-xs font-mono placeholder:text-brand-ivory/30 focus:outline-none transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-brand-gold/50">
              {unit}
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              min="0.5"
              max="50"
              step="0.1"
              placeholder="Length"
              value={addForm.length}
              onChange={(e) => setAddForm({ ...addForm, length: e.target.value })}
              className="w-full px-3 py-2 pr-8 rounded-xs bg-brand-navy border border-brand-gold/20 focus:border-brand-gold text-brand-ivory text-xs font-mono placeholder:text-brand-ivory/30 focus:outline-none transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-brand-gold/50">
              {unit}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xs bg-brand-navy border border-brand-gold/35 hover:border-brand-gold text-brand-ivory/80 hover:text-brand-ivory text-xs font-mono uppercase tracking-widest transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Room
        </button>
      </form>

      {/* Back + confirm */}
      <div className="flex items-center justify-between pt-2 border-t border-brand-gold/10">
        <button
          type="button"
          onClick={() => setStep("template")}
          className="text-[11px] font-mono text-brand-ivory/50 hover:text-brand-ivory uppercase tracking-wider transition-colors"
        >
          ← Change Template
        </button>

        <button
          type="button"
          disabled={rooms.length === 0}
          onClick={onConfirm}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono uppercase tracking-widest font-bold transition-all duration-200",
            rooms.length > 0
              ? "bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-lg shadow-brand-gold/25"
              : "bg-brand-navy border border-brand-gold/20 text-brand-ivory/40 cursor-not-allowed"
          )}
        >
          <span>Build My House</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

