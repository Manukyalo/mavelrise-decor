export interface ArModelConfig {
  glbSrc: string;
  usdzSrc: string;
  placement: "floor" | "wall" | "ceiling";
  scale: string;
  titleEn: string;
  titleSw: string;
  hintEn: string;
  hintSw: string;
}

/**
 * Maps product lines to calibrated AR 3D assets.
 * Each asset is ultra-lightweight (<6KB) for lightning-fast mobile loading on 3G/4G.
 */
export function getArModelForProduct(
  categorySlug?: string,
  _productCode?: string
): ArModelConfig {
  switch (categorySlug) {
    case "spc-flooring":
      return {
        glbSrc: "/models/spc-flooring-plank.glb",
        usdzSrc: "/models/spc-flooring-plank.usdz",
        placement: "floor",
        scale: "1 1 1",
        titleEn: "1:1 True-Scale SPC Flooring Plank Sample",
        titleSw: "Sampuli ya Sakafu ya SPC ya Ukubwa Halisi",
        hintEn: "Aim phone camera at your room floor to test realistic wood grain & tone under your natural light.",
        hintSw: "Elekeza kamera ya simu sakafuni ili kupima mwonekano wa mbao chini ya mwanga wako wa asili.",
      };

    case "wpc-wall-panels":
      return {
        glbSrc: "/models/wpc-fluted-panel.glb",
        usdzSrc: "/models/wpc-fluted-panel.usdz",
        placement: "wall",
        scale: "1 1 1",
        titleEn: "1:1 True-Scale WPC Fluted Wall Slat",
        titleSw: "Sampuli ya Paneli ya WPC ya Ukubwa Halisi",
        hintEn: "Aim phone at your feature wall to visualize timber fluting height, depth, and shadow lines.",
        hintSw: "Elekeza simu ukutani ili kuona kimo na vivuli vya mistari ya paneli za mbao.",
      };

    case "lampshades":
      return {
        glbSrc: "/models/lampshade-pendant.glb",
        usdzSrc: "/models/lampshade-pendant.usdz",
        placement: "ceiling",
        scale: "1 1 1",
        titleEn: "1:1 True-Scale Architectural Pendant Lampshade",
        titleSw: "Kivuli cha Taa cha Kuning'inia cha Ukubwa Halisi",
        hintEn: "Position in your dining or living room to test ceiling suspension height and ambient glow.",
        hintSw: "Weka juu ya meza ya chakula au sebuleni ili kupima kimo cha kuning'inia na mwangaza.",
      };

    case "decor-accessories":
    default:
      return {
        glbSrc: "/models/decor-vase-sculpture.glb",
        usdzSrc: "/models/decor-vase-sculpture.usdz",
        placement: "floor",
        scale: "1 1 1",
        titleEn: "1:1 True-Scale Atelier Sculptural Artifact",
        titleSw: "Pambo la Kauri la Atelier la Ukubwa Halisi",
        hintEn: "Place on any tabletop, console, or floor corner to assess scale and finish integration.",
        hintSw: "Weka mezani au kona ya sakafu ili kupima uwiano wa pambo na muundo wa chumba chako.",
      };
  }
}

