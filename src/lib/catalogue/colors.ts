// Architectural tone preview palette mapping brochure SPC codes to hex values
export const SPC_PREVIEW_COLORS: Record<string, string> = {
  "GJ6345-3": "#C49A6C", // Natural French Oak
  "GJ6345-4": "#969FA7", // Nordic Blue Ash
  "GJ6305-27": "#D8C7B0", // Desert Sand
  "GJ88076-34": "#2B2A29", // Charcoal Smoke
  "GJ7518": "#9E6438", // Bamboo Honey
};

export function getSpcColorHex(code: string): string {
  const normalized = code.replace(/&/g, "").toUpperCase();
  return SPC_PREVIEW_COLORS[code] || SPC_PREVIEW_COLORS[normalized] || "#A88B6E";
}

