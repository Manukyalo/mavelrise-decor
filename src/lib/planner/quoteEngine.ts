import type { Room } from "./types";
import { getSpcColorHex } from "@/lib/catalogue/colors";
import { getColorById } from "./colors";
import {
  getWpcByCode,
  getMarbleByCode,
  getLampByCode,
  getDecorByCode,
} from "./pairings";

export const DEFAULT_WASTAGE_PCT = 10; // 10% standard cutting allowance
export const BOX_COVERAGE_SQM = 2.197; // 1220x183mm x 10 planks/box = 2.197 m²
export const SPC_PRICE_PER_SQM = 2400; // Benchmark KES / m²
export const UNDERLAY_PRICE_PER_SQM = 250;
export const SKIRTING_PRICE_PER_METRE = 480;
export const TRIM_PRICE_PER_PIECE = 850;
export const SPC_FITTING_RATE_PER_SQM = 450;
export const WPC_FITTING_RATE_PER_SQM = 650;

export type SupplyMode = "supply_only" | "supply_and_fit";

export interface RoomQuoteDetails {
  roomId: string;
  roomName: string;
  widthM: number;
  lengthM: number;
  netAreaSqm: number;
  grossAreaSqm: number;
  boxes: number;
  perimeterM: number;
  floorColorName: string;
  floorColorCode: string;
  wallType?: "wpc" | "marble";
  wallCode?: string;
  wallAreaSqm: number;
  lampCode?: string;
  decorCode?: string;
}

export interface DetailedQuoteProposal {
  quoteNumber: string;
  createdAt: string;
  validUntil: string;
  validityDays: number;
  supplyMode: SupplyMode;
  wastagePct: number;
  rooms: RoomQuoteDetails[];
  metrics: {
    totalNetAreaSqm: number;
    totalGrossAreaSqm: number;
    totalBoxes: number;
    totalPerimeterM: number;
  };
  breakdown: {
    flooringTotalKes: number;
    wallsTotalKes: number;
    marbleTotalKes: number;
    lampsTotalKes: number;
    decorTotalKes: number;
    underlayTotalKes: number;
    skirtingTotalKes: number;
    trimsTotalKes: number;
    installationTotalKes: number;
  };
  grandTotalKes: number;
}

/**
 * Calculates accurate multi-product proposal conforming to MarvelRise architectural maths
 */
export function calculateQuoteProposal(
  rooms: Room[],
  supplyMode: SupplyMode = "supply_only",
  wastagePct: number = DEFAULT_WASTAGE_PCT,
  quoteNumberOverride?: string
): DetailedQuoteProposal {
  let totalNetArea = 0;
  let totalGrossArea = 0;
  let totalBoxes = 0;
  let totalPerimeter = 0;

  let flooringTotal = 0;
  let wallsTotal = 0;
  let marbleTotal = 0;
  let lampsTotal = 0;
  let decorTotal = 0;

  const roomDetails: RoomQuoteDetails[] = rooms.map((r) => {
    const netArea = Math.round(r.widthM * r.lengthM * 100) / 100;
    const grossArea = Math.round(netArea * (1 + wastagePct / 100) * 100) / 100;
    const boxes = Math.ceil(grossArea / BOX_COVERAGE_SQM);
    const perimeter = Math.round(2 * (r.widthM + r.lengthM) * 10) / 10;

    totalNetArea += netArea;
    totalGrossArea += grossArea;
    totalBoxes += boxes;
    totalPerimeter += perimeter;

    // Floor cost
    flooringTotal += grossArea * SPC_PRICE_PER_SQM;

    // Wall cost
    let wallArea = 0;
    if (r.wallFinishType === "wpc" && r.wallFinishCode) {
      wallArea = Math.round(r.widthM * 2.8 * 10) / 10; // 2.8m ceiling standard
      const wpc = getWpcByCode(r.wallFinishCode);
      wallsTotal += wallArea * (wpc?.priceKesPerSqm || 2800);
    } else if (r.wallFinishType === "marble" && r.wallFinishCode) {
      wallArea = Math.round(r.widthM * 2.8 * 10) / 10;
      const mrb = getMarbleByCode(r.wallFinishCode);
      marbleTotal += wallArea * (mrb?.priceKesPerSqm || 3200);
    }

    // Lamp cost
    if (r.lampCode) {
      const lamp = getLampByCode(r.lampCode);
      lampsTotal += lamp?.priceKesPerPiece || 6500;
    }

    // Decor cost
    if (r.decorCode) {
      const decor = getDecorByCode(r.decorCode);
      decorTotal += decor?.priceKesPerPiece || 3500;
    }

    const spc = getColorById(r.colorId);

    return {
      roomId: r.id,
      roomName: r.name,
      widthM: r.widthM,
      lengthM: r.lengthM,
      netAreaSqm: netArea,
      grossAreaSqm: grossArea,
      boxes,
      perimeterM: perimeter,
      floorColorName: spc.name,
      floorColorCode: spc.code || "GJ6345-3",
      wallType: r.wallFinishType === "none" ? undefined : r.wallFinishType,
      wallCode: r.wallFinishCode,
      wallAreaSqm: wallArea,
      lampCode: r.lampCode,
      decorCode: r.decorCode,
    };
  });

  // Add-ons calculations
  const underlayTotal = Math.round(totalGrossArea * UNDERLAY_PRICE_PER_SQM);
  const skirtingTotal = Math.round(totalPerimeter * SKIRTING_PRICE_PER_METRE);
  const trimsTotal = rooms.length * TRIM_PRICE_PER_PIECE;

  // Turnkey fitting calculations
  let installationTotal = 0;
  if (supplyMode === "supply_and_fit") {
    const spcFitting = Math.round(totalGrossArea * SPC_FITTING_RATE_PER_SQM);
    const totalWallArea = roomDetails.reduce((sum, r) => sum + r.wallAreaSqm, 0);
    const wallFitting = Math.round(totalWallArea * WPC_FITTING_RATE_PER_SQM);
    installationTotal = spcFitting + wallFitting;
  }

  const grandTotal = Math.round(
    flooringTotal +
    wallsTotal +
    marbleTotal +
    lampsTotal +
    decorTotal +
    underlayTotal +
    skirtingTotal +
    trimsTotal +
    installationTotal
  );

  const now = new Date();
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days validity

  const quoteNumber =
    quoteNumberOverride ||
    `MRD-Q-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    quoteNumber,
    createdAt: now.toISOString(),
    validUntil: expires.toISOString(),
    validityDays: 7,
    supplyMode,
    wastagePct,
    rooms: roomDetails,
    metrics: {
      totalNetAreaSqm: Math.round(totalNetArea * 10) / 10,
      totalGrossAreaSqm: Math.round(totalGrossArea * 10) / 10,
      totalBoxes,
      totalPerimeterM: Math.round(totalPerimeter * 10) / 10,
    },
    breakdown: {
      flooringTotalKes: Math.round(flooringTotal),
      wallsTotalKes: Math.round(wallsTotal),
      marbleTotalKes: Math.round(marbleTotal),
      lampsTotalKes: Math.round(lampsTotal),
      decorTotalKes: Math.round(decorTotal),
      underlayTotalKes: underlayTotal,
      skirtingTotalKes: skirtingTotal,
      trimsTotalKes: trimsTotal,
      installationTotalKes: installationTotal,
    },
    grandTotalKes: grandTotal,
  };
}

