// ─────────────────────────────────────────────────────────────────────────────
// Room Templates — Architectural preset room arrangements per house type
//
// Designed for seamless 3D dollhouse cutaways with snapped walls and natural
// apartment & villa proportions.
// ─────────────────────────────────────────────────────────────────────────────

import type { Room, TemplateType } from "./types";
import { DEFAULT_COLOR_ID } from "./colors";
import { nanoid } from "./nanoid";

function room(
  name: string,
  type: Room["type"],
  widthM: number,
  lengthM: number,
  gridX: number,
  gridY: number
): Room {
  return {
    id: nanoid(),
    name,
    type,
    widthM,
    lengthM,
    gridX,
    gridY,
    colorId: DEFAULT_COLOR_ID,
    plankDirection: "lengthwise",
    hasFlooring: type !== "bathroom",
  };
}

export const TEMPLATES: Record<TemplateType, Room[]> = {
  // ── Single Room / Bedsitter (Popular Studio Suite) ─────────────────────────
  single: [
    room("Main Living & Bed", "bedroom", 4.5, 4.8, 0, 0),
    room("Kitchenette", "kitchen", 2.2, 2.5, 4.5, 0),
    room("Washroom", "bathroom", 2.2, 2.3, 4.5, 2.5),
  ],

  // ── Studio Apartment ───────────────────────────────────────────────────────
  studio: [
    room("Open-Plan Studio", "living", 5.5, 6.0, 0, 0),
    room("Modern Kitchenette", "kitchen", 2.8, 3.0, 0, 6.0),
    room("Bathroom", "bathroom", 2.0, 2.6, 5.5, 0),
    room("Foyer & Balcony", "hallway", 2.7, 3.0, 2.8, 6.0),
  ],

  // ── 1 Bedroom Apartment (1BR) ──────────────────────────────────────────────
  "1bed": [
    room("Living Room", "living", 4.5, 5.5, 0, 0),
    room("Master Bedroom", "master", 4.0, 4.5, 4.5, 0),
    room("Bathroom", "bathroom", 2.0, 2.5, 4.5, 4.5),
    room("Fitted Kitchen", "kitchen", 2.5, 3.5, 0, 5.5),
    room("Entry Hallway", "hallway", 2.0, 3.5, 2.5, 5.5),
  ],

  // ── 2 Bedroom Apartment (2BR) ──────────────────────────────────────────────
  "2bed": [
    room("Living Room", "living", 5.0, 6.0, 0, 0),
    room("Master Bedroom", "master", 4.5, 4.5, 5.0, 0),
    room("Bedroom 2", "bedroom", 3.8, 4.0, 5.0, 4.5),
    room("Main Bathroom", "bathroom", 2.2, 2.5, 9.5, 0),
    room("En Suite", "bathroom", 1.8, 2.0, 9.5, 2.5),
    room("Kitchen", "kitchen", 3.0, 3.5, 0, 6.0),
    room("Dining", "dining", 3.0, 3.5, 3.0, 6.0),
    room("Hallway", "hallway", 1.5, 3.5, 6.0, 8.5),
  ],

  // ── 3 Bedroom Residence (3BR) ──────────────────────────────────────────────
  "3bed": [
    room("Living Room", "living", 5.8, 6.5, 0, 0),
    room("Master Bedroom", "master", 4.8, 5.0, 5.8, 0),
    room("Bedroom 2", "bedroom", 4.0, 4.2, 5.8, 5.0),
    room("Bedroom 3", "bedroom", 3.8, 4.0, 10.6, 0),
    room("Main Bathroom", "bathroom", 2.4, 2.8, 9.8, 6.5),
    room("En Suite", "bathroom", 2.0, 2.5, 10.6, 4.0),
    room("Kitchen", "kitchen", 3.5, 4.0, 0, 6.5),
    room("Dining", "dining", 3.5, 4.0, 3.5, 6.5),
    room("Hallway", "hallway", 2.0, 4.0, 5.8, 9.2),
  ],

  // ── 4 Bedroom Luxury Villa (4BR) ───────────────────────────────────────────
  "4bed": [
    room("Grand Living Room", "living", 6.5, 7.0, 0, 0),
    room("Dining Room", "dining", 4.0, 4.5, 0, 7.0),
    room("Gourmet Kitchen", "kitchen", 4.0, 4.5, 4.0, 7.0),
    room("Master Suite", "master", 5.2, 5.2, 6.5, 0),
    room("Master En-Suite", "bathroom", 2.4, 2.8, 11.7, 0),
    room("Bedroom 2 (Guest)", "bedroom", 4.0, 4.2, 6.5, 5.2),
    room("Bedroom 3", "bedroom", 3.8, 4.0, 10.5, 5.2),
    room("Bedroom 4 / Study", "office", 3.6, 3.8, 8.0, 9.4),
    room("Family Bathroom", "bathroom", 2.5, 2.6, 11.6, 2.8),
    room("Gallery Hallway", "hallway", 2.2, 4.5, 4.0, 11.5),
  ],

  // ── Commercial / Executive Office ──────────────────────────────────────────
  office: [
    room("Open Plan Office", "office", 8.0, 9.0, 0, 0),
    room("Executive Boardroom", "office", 4.5, 4.5, 8.0, 0),
    room("Meeting Room B", "office", 4.0, 4.5, 8.0, 4.5),
    room("Reception & Lounge", "living", 4.0, 4.0, 0, 9.0),
    room("Kitchen / Pantry", "kitchen", 3.0, 3.0, 4.0, 9.0),
    room("Restrooms", "bathroom", 2.5, 3.0, 7.0, 9.0),
  ],

  custom: [],
};
