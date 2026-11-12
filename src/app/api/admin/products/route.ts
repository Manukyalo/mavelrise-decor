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
  const { data: products, error } = await supabase
    .from("products")
    .select("*, categories(slug, name)")
    .order("category_id", { ascending: true })
    .order("code", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: products || [] });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, price_kes, stock_status, is_placeholder, active } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (price_kes !== undefined) updates.price_kes = Math.round(Number(price_kes));
  if (stock_status !== undefined) updates.stock_status = stock_status;
  if (is_placeholder !== undefined) updates.is_placeholder = Boolean(is_placeholder);
  if (active !== undefined) updates.active = Boolean(active);

  const supabase = getServiceClient();
  const { data: updated, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: updated });
}

