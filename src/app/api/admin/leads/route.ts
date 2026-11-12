import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { createClient } from "@supabase/supabase-js";
import type { Lead } from "@/types/admin";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const tag = searchParams.get("tag");
  const sortBy = searchParams.get("sortBy") || "score"; // 'score' | 'created_at'

  const supabase = getServiceClient();
  let query = supabase.from("leads").select("*");

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (tag && tag !== "all") {
    query = query.eq("score_tag", tag);
  }

  if (sortBy === "score") {
    query = query.order("score", { ascending: false }).order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: (data as Lead[]) || [] });
}

