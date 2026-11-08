// ─────────────────────────────────────────────────────────────────────────────
// MarvelRise Decor — Isometric House Planner Types
// All measurements in metres for input; converted to mm internally for layout.
// ─────────────────────────────────────────────────────────────────────────────

export type PlankDirection = "lengthwise" | "crosswise" | "diagonal";
export type RoomType =
  | "living"
  | "master"
  | "bedroom"
  | "bathroom"
  | "kitchen"
  | "office"
  | "dining"
  | "hallway"
  | "other";
export type TemplateType =
  | "studio"
  | "1bed"
  | "2bed"
  | "3bed"
  | "office"
  | "custom";
export type MeasurementUnit = "m" | "ft";
export type QualityTier = "high" | "medium" | "low";

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  widthM: number;  // metres
  lengthM: number; // metres
  /** Grid column position (integer steps) */
  gridX: number;
  /** Grid row position (integer steps) */
  gridY: number;
  colorId: string;
  plankDirection: PlankDirection;
  hasFlooring: boolean;
}

export interface SpcColor {
  id: string;
  name: string;
  collection: string;
  /** Primary wood tone hex */
  hex: string;
  /** Darker grain accent hex */
  grainHex: string;
  /** Lightest highlight on plank surface */
  highlightHex: string;
}

export interface PlankPosition {
  /** mm from room left edge */
  x: number;
  /** mm from room top edge */
  y: number;
  /** actual plank width in mm (may be cut) */
  width: number;
  /** actual plank length in mm (may be cut) */
  length: number;
  isFullPlank: boolean;
  row: number;
  col: number;
  /** offset for staggered joint pattern (mm) */
  staggerOffset: number;
}

export interface PlankLayout {
  roomId: string;
  totalPlanks: number;
  fullPlanks: number;
  cutPlanks: number;
  areaSqm: number;
  wastePercentage: number;
  boxesNeeded: number;
  plankPositions: PlankPosition[];
}

export interface QuoteSummary {
  layouts: PlankLayout[];
  totalAreaSqm: number;
  totalBoxes: number;
  totalFullPlanks: number;
  totalCutPlanks: number;
  avgWastePct: number;
}

export interface PlannerDesign {
  id?: string;
  shareCode?: string;
  templateType: TemplateType;
  rooms: Room[];
  globalColorId: string;
  perRoomColors: boolean;
  plankDirection: PlankDirection;
  createdAt?: string;
}

