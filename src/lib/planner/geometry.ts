// ─────────────────────────────────────────────────────────────────────────────
// Plank Layout Engine — drives both the animation and the quote
// All internal calculations in millimetres.
// ─────────────────────────────────────────────────────────────────────────────

import type { Room, PlankLayout, PlankPosition, QuoteSummary } from "./types";

/** Placeholder dims — replace once supplier confirms */
export const PLANK_LENGTH_MM = 1220;
export const PLANK_WIDTH_MM = 180;
export const PLANKS_PER_BOX = 8;
export const BOX_COVERAGE_SQM =
  (PLANK_LENGTH_MM * PLANK_WIDTH_MM * PLANKS_PER_BOX) / 1_000_000;

/** Standard stagger offset — half-plank bond pattern */
const STAGGER_OFFSET_MM = PLANK_LENGTH_MM / 2;

/**
 * Returns all plank positions for one room, plus waste/box counts.
 * Direction "lengthwise": planks run along the room's length axis.
 * Direction "crosswise":  planks run across the room's width axis.
 * Direction "diagonal":   45° — treated as crosswise for counting (visual only).
 */
export function calculatePlankLayout(
  room: Room,
  minWastePct = 10
): PlankLayout {
  if (!room.hasFlooring) {
    return {
      roomId: room.id,
      totalPlanks: 0,
      fullPlanks: 0,
      cutPlanks: 0,
      areaSqm: parseFloat((room.widthM * room.lengthM).toFixed(2)),
      wastePercentage: 0,
      boxesNeeded: 0,
      plankPositions: [],
    };
  }

  const roomWidthMm = room.widthM * 1000;
  const roomLengthMm = room.lengthM * 1000;

  // For crosswise, swap the plank orientation
  const isLengthwise = room.plankDirection !== "crosswise";
  const runMm = isLengthwise ? roomLengthMm : roomWidthMm;   // direction planks run
  const spanMm = isLengthwise ? roomWidthMm : roomLengthMm;  // direction planks span across

  const positions: PlankPosition[] = [];
  let fullPlanks = 0;
  let cutPlanks = 0;

  let spanCursor = 0;
  let rowIndex = 0;

  while (spanCursor < spanMm) {
    const plankWidth = Math.min(PLANK_WIDTH_MM, spanMm - spanCursor);
    const isLastRow = spanCursor + PLANK_WIDTH_MM > spanMm;

    // Stagger every other row by half a plank
    const stagger = (rowIndex % 2 === 0) ? 0 : STAGGER_OFFSET_MM;
    let runCursor = -stagger; // start before 0 so first plank may be cut
    let colIndex = 0;

    while (runCursor < runMm) {
      const rawLength = PLANK_LENGTH_MM;
      // Clip at both ends
      const startClip = Math.max(0, -runCursor);
      const endClip = Math.max(0, runCursor + rawLength - runMm);
      const plankLength = rawLength - startClip - endClip;

      if (plankLength <= 0) {
        runCursor += rawLength;
        colIndex++;
        continue;
      }

      const isFullW = Math.abs(plankWidth - PLANK_WIDTH_MM) < 1;
      const isFullL = Math.abs(plankLength - PLANK_LENGTH_MM) < 1;
      const isFull = isFullW && isFullL;

      if (isFull) {
        fullPlanks++;
      } else {
        cutPlanks++;
      }

      const posX = isLengthwise
        ? Math.max(0, runCursor)
        : spanCursor;
      const posY = isLengthwise
        ? spanCursor
        : Math.max(0, runCursor);
      const posWidth = isLengthwise ? plankLength : plankWidth;
      const posLength = isLengthwise ? plankWidth : plankLength;

      positions.push({
        x: posX,
        y: posY,
        width: posWidth,
        length: posLength,
        isFullPlank: isFull,
        row: rowIndex,
        col: colIndex,
        staggerOffset: stagger,
      });

      runCursor += rawLength;
      colIndex++;
    }

    spanCursor += PLANK_WIDTH_MM;
    rowIndex++;
  }

  const areaSqm = room.widthM * room.lengthM;
  const totalPlanks = fullPlanks + cutPlanks;

  // Actual planks cover this many m²:
  const usefulAreaPerPlank = (PLANK_LENGTH_MM * PLANK_WIDTH_MM) / 1_000_000;
  const theoreticalPlanks = areaSqm / usefulAreaPerPlank;
  const rawWastePct = totalPlanks > 0
    ? Math.max(0, ((totalPlanks - theoreticalPlanks) / theoreticalPlanks) * 100)
    : 0;
  const wastePercentage = Math.max(minWastePct, parseFloat(rawWastePct.toFixed(1)));

  // Boxes: cover the final waste-adjusted area
  const adjustedAreaSqm = areaSqm * (1 + wastePercentage / 100);
  const boxesNeeded = Math.ceil(adjustedAreaSqm / BOX_COVERAGE_SQM);

  return {
    roomId: room.id,
    totalPlanks,
    fullPlanks,
    cutPlanks,
    areaSqm: parseFloat(areaSqm.toFixed(2)),
    wastePercentage,
    boxesNeeded,
    plankPositions: positions,
  };
}

export function calculateQuote(
  rooms: Room[],
  minWastePct = 10
): QuoteSummary {
  const layouts = rooms.map((r) => calculatePlankLayout(r, minWastePct));

  const totalAreaSqm = layouts.reduce((s, l) => s + l.areaSqm, 0);
  const totalBoxes = layouts.reduce((s, l) => s + l.boxesNeeded, 0);
  const totalFullPlanks = layouts.reduce((s, l) => s + l.fullPlanks, 0);
  const totalCutPlanks = layouts.reduce((s, l) => s + l.cutPlanks, 0);
  const avgWastePct =
    layouts.filter((l) => l.wastePercentage > 0).length > 0
      ? layouts.reduce((s, l) => s + l.wastePercentage, 0) /
        layouts.filter((l) => l.wastePercentage > 0).length
      : 0;

  return {
    layouts,
    totalAreaSqm: parseFloat(totalAreaSqm.toFixed(2)),
    totalBoxes,
    totalFullPlanks,
    totalCutPlanks,
    avgWastePct: parseFloat(avgWastePct.toFixed(1)),
  };
}

