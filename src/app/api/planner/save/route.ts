import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/planner/save — persist a planner design and return a share code
// ─────────────────────────────────────────────────────────────────────────────

const DesignSchema = z.object({
  templateType: z.string(),
  rooms: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      widthM: z.number().positive().max(50),
      lengthM: z.number().positive().max(50),
      gridX: z.number(),
      gridY: z.number(),
      colorId: z.string(),
      plankDirection: z.enum(["lengthwise", "crosswise", "diagonal"]),
      hasFlooring: z.boolean(),
    })
  ).min(1).max(30),
  globalColorId: z.string(),
  perRoomColors: z.boolean(),
  plankDirection: z.enum(["lengthwise", "crosswise", "diagonal"]),
});

function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code = "";
  const bytes: number[] =
    typeof crypto !== "undefined"
      ? Array.from(crypto.getRandomValues(new Uint8Array(6)))
      : Array.from({ length: 6 }, () => Math.floor(Math.random() * 32));
  for (const b of bytes) code += chars[b % chars.length];
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = DesignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid design data", code: "VALIDATION_ERROR" },
        { status: 422 }
      );
    }

    const design = parsed.data;
    const shareCode = generateShareCode();
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("planner_designs").insert({
      share_code: shareCode,
      design_data: design,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[planner/save] Supabase insert error:", error.message);
      // Don't expose internal error — just return the share code anyway
      // The design is stateless enough that the code alone is useful
    }

    return NextResponse.json({ shareCode }, { status: 201 });
  } catch (err) {
    console.error("[planner/save] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code || code.length !== 6) {
    return NextResponse.json({ error: "Invalid code", code: "BAD_REQUEST" }, { status: 400 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("planner_designs")
      .select("design_data, created_at")
      .eq("share_code", code)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Design not found", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ design: data.design_data, createdAt: data.created_at });
  } catch (err) {
    console.error("[planner/load] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
