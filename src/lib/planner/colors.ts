// ─────────────────────────────────────────────────────────────────────────────
// SPC Colour Catalogue — MarvelRise Decor
// Seeded with official brochure codes and architectural tone profiles.
// ─────────────────────────────────────────────────────────────────────────────

import type { SpcColor } from "./types";

export const SPC_COLORS: SpcColor[] = [
  {
    id: "natural-french-oak",
    code: "GJ6345-3",
    name: "Natural French Oak",
    collection: "Atelier Collection",
    hex: "#8B6340",
    grainHex: "#6B4A2C",
    highlightHex: "#A87D55",
  },
  {
    id: "smoked-walnut",
    code: "GJ88076-34",
    name: "Smoked Walnut / Charcoal Smoke",
    collection: "Obsidian Series",
    hex: "#4A3222",
    grainHex: "#2E1D12",
    highlightHex: "#6B4A33",
  },
  {
    id: "nordic-ash",
    code: "GJ6345-4",
    name: "Nordic Blue Ash",
    collection: "Nordic Series",
    hex: "#C5B49A",
    grainHex: "#A89880",
    highlightHex: "#D6C9B4",
  },
  {
    id: "charcoal-noir",
    code: "GJ88076-34-NOIR",
    name: "Charcoal Noir",
    collection: "Obsidian Series",
    hex: "#2A2A2A",
    grainHex: "#1A1A1A",
    highlightHex: "#3D3D3D",
  },
  {
    id: "ivory-driftwood",
    code: "GJ6305-27",
    name: "Desert Sand / Ivory Driftwood",
    collection: "Coastal Collection",
    hex: "#D4C4A8",
    grainHex: "#B8A88C",
    highlightHex: "#E5D8C4",
  },
  {
    id: "cognac-bourbon",
    code: "GJ7518",
    name: "Bamboo Honey Series",
    collection: "Atelier Collection",
    hex: "#7D4A1C",
    grainHex: "#5C3412",
    highlightHex: "#9E6228",
  },
  {
    id: "herringbone-grey",
    code: "GJ-HB-GREY",
    name: "Herringbone Grey",
    collection: "Metropolitan Series",
    hex: "#7A7A7A",
    grainHex: "#5E5E5E",
    highlightHex: "#969696",
  },
  {
    id: "sahara-dune",
    code: "GJ6305-27-DUNE",
    name: "Sahara Dune",
    collection: "Sahara Collection",
    hex: "#C4A97A",
    grainHex: "#A88C5E",
    highlightHex: "#D6BE96",
  },
];

export const DEFAULT_COLOR_ID = "natural-french-oak";

/**
 * Robust lookup by either id or brochure code (e.g. GJ6345-3 or G&J6345-3)
 */
export function getColorById(idOrCode: string): SpcColor {
  if (!idOrCode) return SPC_COLORS[0] as SpcColor;

  const normalized = idOrCode.replace(/&/g, "").toLowerCase();

  const found = SPC_COLORS.find((c) => {
    if (c.id === idOrCode || c.id === normalized) return true;
    if (c.code && (c.code === idOrCode || c.code.toLowerCase().replace(/&/g, "") === normalized)) {
      return true;
    }
    return false;
  });

  return found ?? (SPC_COLORS[0] as SpcColor);
}
