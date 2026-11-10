import { StylePairing } from "./types";

// Curated designer pairings matching brochure SKUs
export const FALLBACK_STYLE_PAIRINGS: StylePairing[] = [
  {
    floorCode: "GJ6345-3",
    styleTitle: "Warm Monolithic Nordic",
    styleSubtitle: "Natural French Oak with Golden Bamboo & Calacatta Gold",
    wpcCode: "J300H1A8",
    marbleCode: "MRB-ADH-001",
    lampCode: "MRDP003",
    decorCode: "DECOR-VASE-001",
    narrative:
      "A sun-drenched Scandinavian-Kenyan dialogue: pale French Oak timber balances warm vertical bamboo fluting, illuminated by organic petal diffusion and anchored by Calacatta gold veining.",
    paletteColors: ["#8B6340", "#C49A6C", "#F4EFEA", "#E8A856"],
  },
  {
    floorCode: "GJ6345-4",
    styleTitle: "Metropolitan Slate & Chrome",
    styleSubtitle: "Nordic Blue Ash with Silver Metallic & Carrara White",
    wpcCode: "J200H1HW",
    marbleCode: "MRB-RGD-001",
    lampCode: "MRDP001",
    decorCode: "DECOR-WALL-001",
    narrative:
      "Cool, architectural and high-contrast: slate-toned ash planks paired with light-catching silver metallic flutes, rectilinear cage geometry, and pure Carrara marble slabs.",
    paletteColors: ["#C5B49A", "#7A7A7A", "#FFFFFF", "#1A1A1A"],
  },
  {
    floorCode: "GJ6305-27",
    styleTitle: "Savannah Coastal Luxe",
    styleSubtitle: "Desert Sand with Warm Walnut & Blue Lapis Accents",
    wpcCode: "J200H1H7",
    marbleCode: "MRB-ADH-002",
    lampCode: "MRDP012",
    decorCode: "DECOR-BOOK-001",
    narrative:
      "Organic coastal tactility: sand-toned SPC grounded by rich walnut fluting and hand-woven rattan pendant shades, energized by vibrant cobalt lapis marble accents.",
    paletteColors: ["#D4C4A8", "#6E472A", "#1D3557", "#C4A97A"],
  },
  {
    floorCode: "GJ88076-34",
    styleTitle: "Obsidian Dramatic Suite",
    styleSubtitle: "Charcoal Smoke with Deep Ebony & Nero Marquina",
    wpcCode: "J200H1H6",
    marbleCode: "MRB-RGD-002",
    lampCode: "MRDP007",
    decorCode: "DECOR-LANTERN-001",
    narrative:
      "Ultra-luxury monochromatic drama: charred oak underfoot seamlessly continuous into deep ebony vertical fluting, illuminated by faceted brushed champagne brass spheres.",
    paletteColors: ["#2A2A2A", "#121212", "#C8A15A", "#E0E0E0"],
  },
  {
    floorCode: "GJ7518",
    styleTitle: "Artisanal Heritage Sanctuary",
    styleSubtitle: "Bamboo Honey with Espresso Dark & Botanical Relief",
    wpcCode: "Z63",
    marbleCode: "MRB-ADH-001",
    lampCode: "MRDP008",
    decorCode: "DECOR-DONUT-001",
    narrative:
      "Warm biophilic craftsmanship: golden-honey striations underfoot complemented by espresso timber partitions and hand-louvered natural wood barrel pendants.",
    paletteColors: ["#7D4A1C", "#2B1D14", "#D4AF37", "#3D2817"],
  },
];

// Reference catalogue metadata for WPC Wall Panels
export interface WpcPanelOption {
  code: string;
  name: string;
  colorHex: string;
  ridgeHex: string;
  texture: string;
  priceKesPerSqm: number;
}

export const WPC_OPTIONS: WpcPanelOption[] = [
  {
    code: "J300H1A8",
    name: "Golden Bamboo Flute",
    colorHex: "#C49A6C",
    ridgeHex: "#8B6438",
    texture: "fluted",
    priceKesPerSqm: 2800,
  },
  {
    code: "Z63",
    name: "Espresso Dark Panel",
    colorHex: "#2B1D14",
    ridgeHex: "#18100B",
    texture: "fluted",
    priceKesPerSqm: 2800,
  },
  {
    code: "J300H1A6",
    name: "Charcoal Flute",
    colorHex: "#22252A",
    ridgeHex: "#141619",
    texture: "fluted",
    priceKesPerSqm: 2800,
  },
  {
    code: "J200H1HW",
    name: "Silver Metallic Slat",
    colorHex: "#8A9098",
    ridgeHex: "#5E636A",
    texture: "fluted",
    priceKesPerSqm: 3100,
  },
  {
    code: "J200H1H7",
    name: "Warm Walnut Flute",
    colorHex: "#5C3E28",
    ridgeHex: "#3A2617",
    texture: "fluted",
    priceKesPerSqm: 2800,
  },
  {
    code: "J200H1H6",
    name: "Deep Ebony Flute",
    colorHex: "#141517",
    ridgeHex: "#090A0B",
    texture: "fluted",
    priceKesPerSqm: 2900,
  },
];

// Reference catalogue metadata for Marble Sheets
export interface MarbleOption {
  code: string;
  name: string;
  bgHex: string;
  veinHex: string;
  veinAccentHex: string;
  priceKesPerSqm: number;
  type: "adhesive" | "rigid";
}

export const MARBLE_OPTIONS: MarbleOption[] = [
  {
    code: "MRB-ADH-001",
    name: "Calacatta Gold (Adhesive)",
    bgHex: "#F5F2ED",
    veinHex: "#D4AF37",
    veinAccentHex: "#8C7335",
    priceKesPerSqm: 2400,
    type: "adhesive",
  },
  {
    code: "MRB-ADH-002",
    name: "Blue Lapis (Adhesive)",
    bgHex: "#1B3B6F",
    veinHex: "#E0ECF8",
    veinAccentHex: "#C49A6C",
    priceKesPerSqm: 2600,
    type: "adhesive",
  },
  {
    code: "MRB-RGD-001",
    name: "Carrara White (Rigid Slab)",
    bgHex: "#FAFAFA",
    veinHex: "#8E9399",
    veinAccentHex: "#C5C8CC",
    priceKesPerSqm: 4200,
    type: "rigid",
  },
  {
    code: "MRB-RGD-002",
    name: "Nero Marquina (Rigid Slab)",
    bgHex: "#111215",
    veinHex: "#FFFFFF",
    veinAccentHex: "#D8C7B0",
    priceKesPerSqm: 4500,
    type: "rigid",
  },
];

// Reference catalogue metadata for Lampshades
export interface LampOption {
  code: string;
  name: string;
  shape: "cage" | "orb" | "petal" | "cone" | "geodesic" | "barrel";
  shadeHex: string;
  glowHex: string;
  priceKesPerPiece: number;
}

export const LAMP_OPTIONS: LampOption[] = [
  {
    code: "MRDP001",
    name: "Grid Cage Pendant",
    shape: "cage",
    shadeHex: "#1A1A1A",
    glowHex: "rgba(255, 205, 120, 0.4)",
    priceKesPerPiece: 6500,
  },
  {
    code: "MRDP002",
    name: "Orange Orb Geometric",
    shape: "orb",
    shadeHex: "#E8571A",
    glowHex: "rgba(255, 160, 60, 0.5)",
    priceKesPerPiece: 7200,
  },
  {
    code: "MRDP003",
    name: "Petal Pinecone Luminaire",
    shape: "petal",
    shadeHex: "#EADCC9",
    glowHex: "rgba(255, 220, 140, 0.45)",
    priceKesPerPiece: 8500,
  },
  {
    code: "MRDP004",
    name: "Fluted Pleated Cone",
    shape: "cone",
    shadeHex: "#F2EBE0",
    glowHex: "rgba(255, 215, 130, 0.4)",
    priceKesPerPiece: 5800,
  },
  {
    code: "MRDP007",
    name: "Geodesic Brass Sphere",
    shape: "geodesic",
    shadeHex: "#C8A15A",
    glowHex: "rgba(255, 215, 110, 0.55)",
    priceKesPerPiece: 11500,
  },
  {
    code: "MRDP008",
    name: "Slatted Timber Barrel",
    shape: "barrel",
    shadeHex: "#8B5A2B",
    glowHex: "rgba(255, 195, 110, 0.4)",
    priceKesPerPiece: 7800,
  },
  {
    code: "MRDP012",
    name: "Woven Rattan Tiered Orb",
    shape: "orb",
    shadeHex: "#B8976C",
    glowHex: "rgba(255, 210, 130, 0.45)",
    priceKesPerPiece: 9200,
  },
];

// Reference catalogue metadata for Decor Accessories
export interface DecorOption {
  code: string;
  name: string;
  type: "vase" | "wall-art" | "book-decor" | "lantern" | "donut-cushion";
  colorHex: string;
  priceKesPerPiece: number;
}

export const DECOR_OPTIONS: DecorOption[] = [
  {
    code: "DECOR-VASE-001",
    name: "Nordic Ribbed Ceramic Vases",
    type: "vase",
    colorHex: "#EAE5DF",
    priceKesPerPiece: 3400,
  },
  {
    code: "DECOR-WALL-001",
    name: "Swirl Bronze Metal Relief",
    type: "wall-art",
    colorHex: "#A0683A",
    priceKesPerPiece: 12500,
  },
  {
    code: "DECOR-BOOK-001",
    name: "Monograph & Travertine Bowl",
    type: "book-decor",
    colorHex: "#D8C7B0",
    priceKesPerPiece: 4800,
  },
  {
    code: "DECOR-LANTERN-001",
    name: "Brushed Brass Storm Lantern",
    type: "lantern",
    colorHex: "#C8A15A",
    priceKesPerPiece: 5600,
  },
  {
    code: "DECOR-DONUT-001",
    name: "Sculptural Donut Knot Cushion",
    type: "donut-cushion",
    colorHex: "#D4AF37",
    priceKesPerPiece: 2800,
  },
];

export function getStylePairingForFloor(floorCodeOrId: string): StylePairing {
  const normalized = floorCodeOrId.replace(/&/g, "").toUpperCase();

  const found = FALLBACK_STYLE_PAIRINGS.find(
    (p) =>
      p.floorCode === floorCodeOrId ||
      p.floorCode.toUpperCase() === normalized ||
      p.floorCode === "GJ6345-3"
  );

  return found || FALLBACK_STYLE_PAIRINGS[0];
}

export function getWpcByCode(code?: string): WpcPanelOption | undefined {
  if (!code) return undefined;
  return WPC_OPTIONS.find((w) => w.code === code);
}

export function getMarbleByCode(code?: string): MarbleOption | undefined {
  if (!code) return undefined;
  return MARBLE_OPTIONS.find((m) => m.code === code);
}

export function getLampByCode(code?: string): LampOption | undefined {
  if (!code) return undefined;
  return LAMP_OPTIONS.find((l) => l.code === code);
}

export function getDecorByCode(code?: string): DecorOption | undefined {
  if (!code) return undefined;
  return DECOR_OPTIONS.find((d) => d.code === code);
}

