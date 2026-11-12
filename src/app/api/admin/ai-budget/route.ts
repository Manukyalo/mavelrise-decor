import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Fetch or initialize monthly budget record
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
  const { data: recentLogs } = await supabase
    .from("ai_usage_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  return NextResponse.json({
    budget,
    recentLogs: recentLogs || [],
  });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { budget_kes, is_enabled, per_visitor_limit, per_session_limit } = body;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const supabase = getServiceClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (budget_kes !== undefined) updates.budget_kes = Math.round(Number(budget_kes));
  if (is_enabled !== undefined) updates.is_enabled = Boolean(is_enabled);
  if (per_visitor_limit !== undefined) updates.per_visitor_limit = Math.round(Number(per_visitor_limit));
  if (per_session_limit !== undefined) updates.per_session_limit = Math.round(Number(per_session_limit));

  const { data: updated, error } = await supabase
    .from("ai_budget")
    .update(updates)
    .eq("month", currentMonth)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ budget: updated });
}

