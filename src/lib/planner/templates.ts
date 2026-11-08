// ─────────────────────────────────────────────────────────────────────────────
// Room Templates — preset room arrangements per house type
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
  studio: [
    room("Main Space", "living", 5.5, 7, 0, 0),
    room("Bathroom", "bathroom", 2, 2.5, 5.5, 0),
    room("Kitchenette", "kitchen", 2.5, 3, 0, 7),
  ],
  "1bed": [
    room("Living Room", "living", 4.5, 5.5, 0, 0),
    room("Bedroom", "master", 4, 4.5, 4.5, 0),
    room("Bathroom", "bathroom", 2, 2.5, 4.5, 4.5),
    room("Kitchen", "kitchen", 2.5, 3, 0, 5.5),
    room("Hallway", "hallway", 1.5, 3, 4.5, 7),
  ],
  "2bed": [
    room("Living Room", "living", 5, 6, 0, 0),
    room("Master Bedroom", "master", 4.5, 4.5, 5, 0),
    room("Bedroom 2", "bedroom", 3.5, 4, 5, 4.5),
    room("Bathroom", "bathroom", 2, 2.5, 8.5, 0),
    room("En Suite", "bathroom", 1.8, 2, 8.5, 2.5),
    room("Kitchen", "kitchen", 3, 3.5, 0, 6),
    room("Dining", "dining", 3, 3.5, 3, 6),
    room("Hallway", "hallway", 1.5, 3, 5, 8.5),
  ],
  "3bed": [
    room("Living Room", "living", 6, 6.5, 0, 0),
    room("Master Bedroom", "master", 5, 5, 6, 0),
    room("Bedroom 2", "bedroom", 4, 4.5, 6, 5),
    room("Bedroom 3", "bedroom", 3.5, 4, 10, 0),
    room("Main Bathroom", "bathroom", 2.5, 3, 11, 5),
    room("En Suite", "bathroom", 2, 2.5, 10, 2.5),
    room("Kitchen", "kitchen", 3.5, 4, 0, 6.5),
    room("Dining", "dining", 3.5, 4, 3.5, 6.5),
    room("Hallway", "hallway", 2, 4, 6, 9.5),
  ],
  office: [
    room("Open Plan Office", "office", 8, 10, 0, 0),
    room("Meeting Room A", "office", 4, 4, 8, 0),
    room("Meeting Room B", "office", 4, 4, 8, 4),
    room("Reception", "living", 3, 4, 0, 10),
    room("Kitchen / Pantry", "kitchen", 3, 3, 3, 10),
    room("Bathroom", "bathroom", 2.5, 3, 8, 8),
  ],
  custom: [],
};

