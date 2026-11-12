import type { LeadScoreReason, LeadScoreTag, LeadProductItem } from "@/types/admin";

export interface ScoreInput {
  status: string;
  total_kes: number;
  total_area_sqm: number;
  products: LeadProductItem[];
  visit_count: number;
  whatsapp_clicked: boolean;
  phone?: string | null;
  visit_booked_flag?: boolean;
}

export interface ScoreResult {
  score: number;
  reasons: LeadScoreReason[];
  tag: LeadScoreTag;
}

export function computeLeadScore(
  input: ScoreInput,
  weights: Record<string, number> = {}
): ScoreResult {
  const defaultWeights: Record<string, number> = {
    completed_quote: 30,
    large_room_or_high_total: 15,
    multi_category_products: 10,
    booked_visit_or_sample: 25,
    returned_visitor: 10,
    whatsapp_clicked: 15,
    phone_given: 10,
    ...weights,
  };

  const reasons: LeadScoreReason[] = [];
  let score = 0;

  // 1. Completed quote
  if (
    input.status === "quote_created" ||
    input.status === "quote_viewed" ||
    input.status === "whatsapp_sent" ||
    input.status === "visit_booked" ||
    input.status === "sample_booked" ||
    input.status === "won"
  ) {
    const pts = defaultWeights.completed_quote ?? 30;
    score += pts;
    reasons.push({ reason: "Completed quote calculation", points: pts });
  }

  // 2. Large room or high total (>120m² or >KSh 300,000)
  if (input.total_area_sqm >= 120 || input.total_kes >= 300000) {
    const pts = defaultWeights.large_room_or_high_total ?? 15;
    score += pts;
    reasons.push({
      reason: `High value project (${input.total_area_sqm}m² / KSh ${input.total_kes.toLocaleString()})`,
      points: pts,
    });
  }

  // 3. Multi-category products
  const uniqueCategories = new Set(
    (input.products || [])
      .map((p) => p.category)
      .filter((c): c is string => Boolean(c))
  );
  if (uniqueCategories.size >= 2) {
    const pts = defaultWeights.multi_category_products ?? 10;
    score += pts;
    reasons.push({
      reason: `Multi-product selection (${uniqueCategories.size} categories)`,
      points: pts,
    });
  }

  // 4. Booked visit or sample
  if (
    input.visit_booked_flag ||
    input.status === "visit_booked" ||
    input.status === "sample_booked"
  ) {
    const pts = defaultWeights.booked_visit_or_sample ?? 25;
    score += pts;
    reasons.push({ reason: "Booked showroom/site visit or sample", points: pts });
  }

  // 5. Returned visitor (>1 visit)
  if (input.visit_count > 1) {
    const pts = defaultWeights.returned_visitor ?? 10;
    score += pts;
    reasons.push({ reason: `Returning visitor (${input.visit_count} sessions)`, points: pts });
  }

  // 6. Clicked WhatsApp
  if (input.whatsapp_clicked || input.status === "whatsapp_sent") {
    const pts = defaultWeights.whatsapp_clicked ?? 15;
    score += pts;
    reasons.push({ reason: "Initiated WhatsApp consultation", points: pts });
  }

  // 7. Phone number given
  if (input.phone && input.phone.trim().length >= 9) {
    const pts = defaultWeights.phone_given ?? 10;
    score += pts;
    reasons.push({ reason: "Direct contact phone provided", points: pts });
  }

  // Cap score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, score));

  let tag: LeadScoreTag = "cold";
  if (finalScore >= 70) tag = "hot";
  else if (finalScore >= 40) tag = "warm";

  return {
    score: finalScore,
    reasons,
    tag,
  };
}

