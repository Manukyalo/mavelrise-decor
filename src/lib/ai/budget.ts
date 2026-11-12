import { createClient } from "@supabase/supabase-js";
import type { AiBudget } from "@/types/admin";

// Est: KSh 75 per 1 million tokens (or approx 0.000075 KSh per token)
const KES_PER_TOKEN = 0.000075;

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export interface AiCheckResult {
  allowed: boolean;
  reason?: string;
  fallbackUrl?: string;
  budgetStatus?: {
    budgetKes: number;
    costKes: number;
    percentage: number;
    isEnabled: boolean;
  };
}

/**
 * Checks if the AI request should proceed or be hard-stopped.
 */
export async function checkAiBudget(
  visitorId: string,
  sessionId?: string
): Promise<AiCheckResult> {
  const supabase = getAdminClient();
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  try {
    const { data: budgetData, error } = await supabase
      .from("ai_budget")
      .select("*")
      .eq("month", currentMonth)
      .maybeSingle();

    if (error || !budgetData) {
      // Default allow if budget record doesn't exist yet
      return { allowed: true };
    }

    const budget = budgetData as AiBudget;

    // 1. Check if AI system is manually toggled off by owner
    if (!budget.is_enabled) {
      return {
        allowed: false,
        reason: "The AI Concierge is currently resting. Chat directly with our interior specialists on WhatsApp.",
        fallbackUrl: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343"}?text=${encodeURIComponent("Hello MarvelRise, I'd like advice on my room design.")}`,
        budgetStatus: {
          budgetKes: budget.budget_kes,
          costKes: Number(budget.cost_kes),
          percentage: (Number(budget.cost_kes) / budget.budget_kes) * 100,
          isEnabled: false,
        },
      };
    }

    // 2. Hard stop if cost exceeds monthly budget
    if (Number(budget.cost_kes) >= budget.budget_kes) {
      return {
        allowed: false,
        reason: "Monthly design assistant allocation reached. Connect with our atelier team directly.",
        fallbackUrl: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343"}?text=${encodeURIComponent("Hello MarvelRise, I'd like to consult on my design project.")}`,
        budgetStatus: {
          budgetKes: budget.budget_kes,
          costKes: Number(budget.cost_kes),
          percentage: 100,
          isEnabled: true,
        },
      };
    }

    // 3. Per-visitor token limit check for anti-bot protection
    if (visitorId) {
      const { data: usage } = await supabase
        .from("ai_usage_log")
        .select("total_tokens")
        .eq("visitor_id", visitorId);

      const visitorTokens = (usage || []).reduce(
        (sum, item) => sum + (item.total_tokens || 0),
        0
      );

      if (visitorTokens >= budget.per_visitor_limit) {
        return {
          allowed: false,
          reason: "Visitor session limit reached. Please contact our design studio on WhatsApp.",
          fallbackUrl: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343"}`,
        };
      }
    }

    return {
      allowed: true,
      budgetStatus: {
        budgetKes: budget.budget_kes,
        costKes: Number(budget.cost_kes),
        percentage: Math.min(100, (Number(budget.cost_kes) / budget.budget_kes) * 100),
        isEnabled: true,
      },
    };
  } catch (err) {
    console.error("AI Budget check error:", err);
    return { allowed: true };
  }
}

/**
 * Records AI token consumption into the audit log and increments monthly budget metrics.
 */
export async function recordAiTokens(params: {
  visitorId: string;
  sessionId?: string;
  tokensIn: number;
  tokensOut: number;
}): Promise<void> {
  const supabase = getAdminClient();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalTokens = params.tokensIn + params.tokensOut;
  const costKes = totalTokens * KES_PER_TOKEN;

  try {
    // 1. Insert detailed usage record
    await supabase.from("ai_usage_log").insert({
      visitor_id: params.visitorId,
      session_id: params.sessionId,
      tokens_in: params.tokensIn,
      tokens_out: params.tokensOut,
      total_tokens: totalTokens,
      cost_kes: costKes,
    });

    // 2. Fetch current budget
    const { data: current } = await supabase
      .from("ai_budget")
      .select("*")
      .eq("month", currentMonth)
      .maybeSingle();

    if (current) {
      const newTokens = (current.tokens_used || 0) + totalTokens;
      const newCost = Number(current.cost_kes || 0) + costKes;
      const pct = (newCost / current.budget_kes) * 100;

      await supabase
        .from("ai_budget")
        .update({
          tokens_used: newTokens,
          cost_kes: newCost,
          alert_70_sent: current.alert_70_sent || pct >= 70,
          alert_90_sent: current.alert_90_sent || pct >= 90,
          alert_100_sent: current.alert_100_sent || pct >= 100,
          updated_at: new Date().toISOString(),
        })
        .eq("month", currentMonth);
    }
  } catch (err) {
    console.error("Failed to record AI token usage:", err);
  }
}

