// ─────────────────────────────────────────────────────────────────────────────
// MixedProductRenderHelpers — Canvas 2D Architectural Finish & Object Engine
// Renders WPC fluted walls, UV marble sheets, hanging MRDP lamps, and tactile decor.
// ─────────────────────────────────────────────────────────────────────────────

import type { Room, QualityTier } from "@/lib/planner/types";
import {
  getWpcByCode,
  getMarbleByCode,
  getLampByCode,
  getDecorByCode,
} from "@/lib/planner/pairings";

type ProjectFn = (wx: number, wy: number, wz: number) => [number, number];

/**
 * 1. Renders WPC Fluted Panelling or UV Marble Feature Cladding on Wall Surfaces
 */
export function renderWallFinish(
  ctx: CanvasRenderingContext2D,
  room: Room,
  p: ProjectFn,
  mode: "iso" | "top",
  wallHeight: number = 0.45
) {
  if (mode !== "iso" || !room.wallFinishType || room.wallFinishType === "none") {
    return;
  }

  const x0 = room.gridX;
  const y0 = room.gridY;
  const x1 = x0 + room.widthM;
  const y1 = y0 + room.lengthM;

  // Back feature wall coordinates
  const [w0x, w0y] = p(x0, y0, 0);
  const [w1x, w1y] = p(x1, y0, 0);
  const [w2x, w2y] = p(x1, y0, wallHeight);
  const [w3x, w3y] = p(x0, y0, wallHeight);

  ctx.save();

  if (room.wallFinishType === "wpc") {
    const wpc = getWpcByCode(room.wallFinishCode) || {
      colorHex: "#C49A6C",
      ridgeHex: "#8B6438",
      name: "Golden Bamboo Flute",
    };

    // Base wall slab in WPC tone
    ctx.beginPath();
    ctx.moveTo(w0x, w0y);
    ctx.lineTo(w1x, w1y);
    ctx.lineTo(w2x, w2y);
    ctx.lineTo(w3x, w3y);
    ctx.closePath();
    ctx.fillStyle = wpc.colorHex;
    ctx.fill();

    // Vertical acoustic fluting ridges
    const ridgeCount = Math.max(6, Math.floor(room.widthM * 6));
    const step = (x1 - x0) / ridgeCount;

    for (let i = 0; i < ridgeCount; i++) {
      const rx = x0 + i * step;
      const [r0x, r0y] = p(rx, y0, 0);
      const [r1x, r1y] = p(rx, y0, wallHeight);

      ctx.beginPath();
      ctx.moveTo(r0x, r0y);
      ctx.lineTo(r1x, r1y);
      ctx.strokeStyle = wpc.ridgeHex;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Flute highlight highlight line
      const [rh0x, rh0y] = p(rx + step * 0.4, y0, 0);
      const [rh1x, rh1y] = p(rx + step * 0.4, y0, wallHeight);
      ctx.beginPath();
      ctx.moveTo(rh0x, rh0y);
      ctx.lineTo(rh1x, rh1y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // Top architectural trim in brushed brass
    ctx.beginPath();
    ctx.moveTo(w3x, w3y);
    ctx.lineTo(w2x, w2y);
    ctx.strokeStyle = "rgba(200, 161, 90, 0.85)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  } else if (room.wallFinishType === "marble") {
    const marble = getMarbleByCode(room.wallFinishCode) || {
      bgHex: "#F5F2ED",
      veinHex: "#D4AF37",
      veinAccentHex: "#8C7335",
      name: "Calacatta Gold",
    };

    // Base mirror-gloss slab
    ctx.beginPath();
    ctx.moveTo(w0x, w0y);
    ctx.lineTo(w1x, w1y);
    ctx.lineTo(w2x, w2y);
    ctx.lineTo(w3x, w3y);
    ctx.closePath();
    ctx.fillStyle = marble.bgHex;
    ctx.fill();

    // Elegant organic marble veining lines across wall face
    ctx.beginPath();
    const [mv0x, mv0y] = p(x0 + room.widthM * 0.1, y0, wallHeight * 0.8);
    const [mv1x, mv1y] = p(x0 + room.widthM * 0.45, y0, wallHeight * 0.35);
    const [mv2x, mv2y] = p(x0 + room.widthM * 0.85, y0, wallHeight * 0.1);

    ctx.moveTo(mv0x, mv0y);
    ctx.quadraticCurveTo(mv1x, mv1y, mv2x, mv2y);
    ctx.strokeStyle = marble.veinHex;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Secondary vein branch
    ctx.beginPath();
    const [mv3x, mv3y] = p(x0 + room.widthM * 0.45, y0, wallHeight * 0.35);
    const [mv4x, mv4y] = p(x0 + room.widthM * 0.7, y0, wallHeight * 0.65);
    ctx.moveTo(mv3x, mv3y);
    ctx.lineTo(mv4x, mv4y);
    ctx.strokeStyle = marble.veinAccentHex;
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // Monolithic perimeter gold trim
    ctx.beginPath();
    ctx.moveTo(w0x, w0y);
    ctx.lineTo(w1x, w1y);
    ctx.lineTo(w2x, w2y);
    ctx.lineTo(w3x, w3y);
    ctx.closePath();
    ctx.strokeStyle = "rgba(200, 161, 90, 0.75)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 2. Renders Hanging MRDP Lampshades with Suspensions & Glow Effects
 */
export function renderPendantLampshade(
  ctx: CanvasRenderingContext2D,
  room: Room,
  p: ProjectFn,
  mode: "iso" | "top",
  qualityTier: QualityTier
) {
  if (mode !== "iso" || !room.lampCode) return;

  const lamp = getLampByCode(room.lampCode);
  if (!lamp) return;

  const cx = room.gridX + room.widthM / 2;
  const cy = room.gridY + room.lengthM / 2;
  const isLit = room.lampLightOn !== false; // defaults to true

  const ceilingZ = 0.82;
  const shadeZ = 0.48;

  const [topX, topY] = p(cx, cy, ceilingZ);
  const [shadeX, shadeY] = p(cx, cy, shadeZ);
  const [floorX, floorY] = p(cx, cy, 0.02);

  ctx.save();

  // 1. Suspension cable
  ctx.beginPath();
  ctx.moveTo(topX, topY);
  ctx.lineTo(shadeX, shadeY);
  ctx.strokeStyle = "rgba(200, 161, 90, 0.75)";
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // 2. Ceiling anchor rose
  ctx.beginPath();
  ctx.arc(topX, topY, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = "#C8A15A";
  ctx.fill();

  // 3. Radiant Ambient Floor Lighting Pool (when lights are on)
  if (isLit && qualityTier !== "low") {
    const floorGlowRadius = Math.max(room.widthM, room.lengthM) * 38;
    const floorGlow = ctx.createRadialGradient(
      floorX,
      floorY,
      2,
      floorX,
      floorY,
      floorGlowRadius
    );
    floorGlow.addColorStop(0, "rgba(255, 220, 140, 0.28)");
    floorGlow.addColorStop(0.5, "rgba(200, 161, 90, 0.09)");
    floorGlow.addColorStop(1, "rgba(200, 161, 90, 0)");

    ctx.beginPath();
    ctx.arc(floorX, floorY, floorGlowRadius, 0, Math.PI * 2);
    ctx.fillStyle = floorGlow;
    ctx.fill();
  }

  // 4. Radiant Aura around Lampshade (when lit)
  if (isLit) {
    ctx.save();
    ctx.shadowColor = "#F59E0B";
    ctx.shadowBlur = 20;
    const aura = ctx.createRadialGradient(shadeX, shadeY, 1, shadeX, shadeY, 24);
    aura.addColorStop(0, "rgba(255, 230, 160, 0.45)");
    aura.addColorStop(1, "rgba(255, 180, 50, 0)");
    ctx.beginPath();
    ctx.arc(shadeX, shadeY, 22, 0, Math.PI * 2);
    ctx.fillStyle = aura;
    ctx.fill();
    ctx.restore();
  }

  // 5. Geometric Lampshade Silhouette
  ctx.fillStyle = lamp.shadeHex;
  ctx.strokeStyle = "rgba(200, 161, 90, 0.85)";
  ctx.lineWidth = 1;

  if (lamp.shape === "cage") {
    // Rectilinear geometric cage
    const w = 14;
    const h = 18;
    ctx.strokeRect(shadeX - w / 2, shadeY - h / 2, w, h);
    ctx.fillStyle = "rgba(25, 25, 25, 0.85)";
    ctx.fillRect(shadeX - w / 2, shadeY - h / 2, w, h);
    // Interior filament dot
    ctx.beginPath();
    ctx.arc(shadeX, shadeY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = isLit ? "#FFEA79" : "#666";
    ctx.fill();
  } else if (lamp.shape === "orb" || lamp.shape === "geodesic") {
    // Spherical orb / geodesic facets
    ctx.beginPath();
    ctx.arc(shadeX, shadeY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (lamp.shape === "geodesic") {
      ctx.beginPath();
      ctx.moveTo(shadeX - 7, shadeY);
      ctx.lineTo(shadeX + 7, shadeY);
      ctx.moveTo(shadeX, shadeY - 7);
      ctx.lineTo(shadeX, shadeY + 7);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.stroke();
    }
  } else if (lamp.shape === "petal") {
    // Layered organic petal shape
    ctx.beginPath();
    ctx.ellipse(shadeX, shadeY, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Petal crest
    ctx.beginPath();
    ctx.ellipse(shadeX, shadeY - 3, 7, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fill();
  } else {
    // Conical / barrel pendant
    ctx.beginPath();
    ctx.moveTo(shadeX - 10, shadeY + 6);
    ctx.lineTo(shadeX + 10, shadeY + 6);
    ctx.lineTo(shadeX + 4, shadeY - 6);
    ctx.lineTo(shadeX - 4, shadeY - 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 3. Renders Tactile Decor Artifacts (Vases, Wall Art, Travertine Bowl, Lanterns)
 */
export function renderDecorArtifact(
  ctx: CanvasRenderingContext2D,
  room: Room,
  p: ProjectFn,
  mode: "iso" | "top"
) {
  if (mode !== "iso" || !room.decorCode) return;

  const decor = getDecorByCode(room.decorCode);
  if (!decor) return;

  const x0 = room.gridX;
  const y0 = room.gridY;

  ctx.save();

  if (decor.type === "vase") {
    // Trio of ceramic ribbed vases positioned on dining table or credenza
    const vx = x0 + room.widthM * 0.42;
    const vy = y0 + room.lengthM * 0.52;
    const [v0x, v0y] = p(vx, vy, 0.26);

    ctx.fillStyle = decor.colorHex;
    ctx.strokeStyle = "rgba(100, 80, 60, 0.4)";
    ctx.lineWidth = 0.8;

    // Tall vase
    ctx.beginPath();
    ctx.ellipse(v0x, v0y, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Medium vase
    ctx.beginPath();
    ctx.ellipse(v0x + 7, v0y + 2, 3.5, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#D4AF37";
    ctx.fill();
    ctx.stroke();
  } else if (decor.type === "wall-art") {
    // Kinetic bronze swirl wall sculpture on back wall
    const wx = x0 + room.widthM * 0.5;
    const [artX, artY] = p(wx, y0, 0.38);

    ctx.beginPath();
    ctx.arc(artX, artY, 11, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(160, 104, 58, 0.75)";
    ctx.fill();
    ctx.strokeStyle = "#C8A15A";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Interior swirl path
    ctx.beginPath();
    ctx.arc(artX, artY, 6, 0, Math.PI * 1.5);
    ctx.strokeStyle = "rgba(255, 230, 180, 0.7)";
    ctx.lineWidth = 1.0;
    ctx.stroke();
  } else if (decor.type === "lantern") {
    // Brushed brass storm lantern in corner
    const lx = x0 + room.widthM * 0.15;
    const ly = y0 + room.lengthM * 0.15;
    const [ltX, ltY] = p(lx, ly, 0.05);

    ctx.strokeStyle = "#C8A15A";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(ltX - 4, ltY - 12, 8, 12);
    ctx.fillStyle = "rgba(255, 215, 120, 0.35)";
    ctx.fillRect(ltX - 4, ltY - 12, 8, 12);

    // Warm candle glow dot
    ctx.beginPath();
    ctx.arc(ltX, ltY - 6, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFE082";
    ctx.fill();
  } else if (decor.type === "donut-cushion") {
    // Sculptural velvet donut knot on sofa/bed
    const dx = x0 + room.widthM * 0.48;
    const dy = y0 + room.lengthM * 0.35;
    const [dnX, dnY] = p(dx, dy, 0.18);

    ctx.beginPath();
    ctx.arc(dnX, dnY, 6, 0, Math.PI * 2);
    ctx.fillStyle = decor.colorHex;
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center hole
    ctx.beginPath();
    ctx.arc(dnX, dnY, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fill();
  } else {
    // Architectural book set + travertine bowl
    const bx = x0 + room.widthM * 0.5;
    const by = y0 + room.lengthM * 0.45;
    const [bkX, bkY] = p(bx, by, 0.15);

    ctx.fillStyle = "#EAE5DF";
    ctx.fillRect(bkX - 6, bkY - 3, 12, 4);
    ctx.strokeStyle = "rgba(200, 161, 90, 0.6)";
    ctx.strokeRect(bkX - 6, bkY - 3, 12, 4);

    ctx.beginPath();
    ctx.arc(bkX + 2, bkY - 5, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#C8A15A";
    ctx.fill();
  }

  ctx.restore();
}

