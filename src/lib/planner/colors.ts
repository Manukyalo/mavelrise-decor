// ─────────────────────────────────────────────────────────────────────────────
// SPC Colour Catalogue — MarvelRise Decor
// Confirm all colour codes with client before launch.
// ─────────────────────────────────────────────────────────────────────────────

import type { SpcColor } from "./types";

export const SPC_COLORS: SpcColor[] = [
  {
    id: "natural-french-oak",
    name: "Natural French Oak",
    collection: "Atelier Collection",
    hex: "#8B6340",
    grainHex: "#6B4A2C",
    highlightHex: "#A87D55",
  },
  {
    id: "smoked-walnut",
    name: "Smoked Walnut",
    collection: "Atelier Collection",
    hex: "#4A3222",
    grainHex: "#2E1D12",
    highlightHex: "#6B4A33",
  },
  {
    id: "nordic-ash",
    name: "Nordic Ash",
    collection: "Nordic Series",
    hex: "#C5B49A",
    grainHex: "#A89880",
    highlightHex: "#D6C9B4",
  },
  {
    id: "charcoal-noir",
    name: "Charcoal Noir",
    collection: "Obsidian Series",
    hex: "#2A2A2A",
    grainHex: "#1A1A1A",
    highlightHex: "#3D3D3D",
  },
  {
    id: "ivory-driftwood",
    name: "Ivory Driftwood",
    collection: "Coastal Collection",
    hex: "#D4C4A8",
    grainHex: "#B8A88C",
    highlightHex: "#E5D8C4",
  },
  {
    id: "cognac-bourbon",
    name: "Cognac Bourbon",
    collection: "Atelier Collection",
    hex: "#7D4A1C",
    grainHex: "#5C3412",
    highlightHex: "#9E6228",
  },
  {
    id: "herringbone-grey",
    name: "Herringbone Grey",
    collection: "Metropolitan Series",
    hex: "#7A7A7A",
    grainHex: "#5E5E5E",
    highlightHex: "#969696",
  },
  {
    id: "sahara-dune",
    name: "Sahara Dune",
    collection: "Sahara Collection",
    hex: "#C4A97A",
    grainHex: "#A88C5E",
    highlightHex: "#D6BE96",
  },
];

export const DEFAULT_COLOR_ID = "natural-french-oak";

export function getColorById(id: string): SpcColor {
  return (
    SPC_COLORS.find((c) => c.id === id) ??
    (SPC_COLORS[0] as SpcColor)
  );
}

