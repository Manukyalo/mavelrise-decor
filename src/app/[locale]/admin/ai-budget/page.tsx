import React from "react";
import { createClient } from "@supabase/supabase-js";
import type { AiBudget } from "@/types/admin";
import { AiBudgetMeter } from "@/components/admin/AiBudgetMeter";

export const dynamic = "force-dynamic";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default async function AdminAiBudgetPage() {
  const supabase = getServiceClient();
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Fetch or initialize budget
  let { data: budget } = await supabase
    .from("ai_budget")
    .select("*")
    .eq("month", currentMonth)
    .maybeSingle();

  if (!budget) {
    const { data: created } = await supabase
      .from("ai_budget")
      .insert({
        month: currentMonth,
        budget_kes: 3000,
        tokens_used: 0,
        cost_kes: 0,
        is_enabled: true,
      })
      .select()
      .single();
    budget = created;
  }

  // Fetch recent usage logs
  const { data: logs } = await supabase
    .from("ai_usage_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono font-medium tracking-wider text-admin-gold uppercase">
          Cost Governance & Safety Limits
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-admin-text tracking-tight mt-1">
          AI Token Guard & Budget
        </h1>
        <p className="text-xs sm:text-sm text-admin-text-muted font-sans mt-1">
          Live token telemetry, monthly spend caps in KSh, and automated fail-safe redirection to WhatsApp.
        </p>
      </div>

      <AiBudgetMeter
        initialBudget={budget as AiBudget}
        initialLogs={logs || []}
      />
    </div>
  );
}
