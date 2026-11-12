export type LeadStatus =
  | "quote_created"
  | "quote_viewed"
  | "whatsapp_sent"
  | "visit_booked"
  | "sample_booked"
  | "won"
  | "lost";

export type LeadScoreTag = "hot" | "warm" | "cold";

export interface LeadScoreReason {
  reason: string;
  points: number;
}

export interface LeadProductItem {
  code: string;
  name: string;
  category?: string;
  qty?: number;
}

export interface Lead {
  id: string;
  quote_ref: string | null;
  visitor_id: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  source: string;
  status: LeadStatus;
  total_kes: number;
  total_area_sqm: number;
  room_count: number;
  products: LeadProductItem[];
  score: number;
  score_reasons: LeadScoreReason[];
  score_tag: LeadScoreTag;
  visit_count: number;
  whatsapp_clicked: boolean;
  phone_given: boolean;
  visit_booked_flag: boolean;
  notes: string | null;
  locale: string;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}

export interface LeadScoreWeight {
  id: string;
  key: string;
  label: string;
  points: number;
  updated_at: string;
}

export interface AiBudget {
  id: string;
  month: string;
  budget_kes: number;
  tokens_used: number;
  cost_kes: number;
  is_enabled: boolean;
  per_visitor_limit: number;
  per_session_limit: number;
  alert_70_sent: boolean;
  alert_90_sent: boolean;
  alert_100_sent: boolean;
  updated_at: string;
}

export interface FollowUpReminder {
  id: string;
  lead_id: string;
  trigger_at: string;
  type: "24h" | "3d";
  sent: boolean;
  dismissed: boolean;
  created_at: string;
}

