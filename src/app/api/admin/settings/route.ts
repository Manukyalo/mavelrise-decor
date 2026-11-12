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
  const { data: weights, error } = await supabase
    .from("lead_score_weights")
    .select("*")
    .order("points", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ weights: weights || [] });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { key, points } = body;

  if (!key || points === undefined) {
    return NextResponse.json({ error: "Missing key or points" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data: updated, error } = await supabase
    .from("lead_score_weights")
    .update({
      points: Math.round(Number(points)),
      updated_at: new Date().toISOString(),
    })
    .eq("key", key)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ weight: updated });
}

