import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const SaveQuoteSchema = z.object({
  quoteNumber: z.string().min(5),
  quoteData: z.record(z.any()),
  supplyMode: z.enum(["supply_only", "supply_and_fit"]),
  totalKes: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = SaveQuoteSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid quote proposal payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { quoteNumber, quoteData, supplyMode, totalKes } = parsed.data;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("quotes")
      .upsert(
        {
          quote_number: quoteNumber,
          quote_data: quoteData,
          supply_mode: supplyMode,
          total_kes: totalKes,
        },
        { onConflict: "quote_number" }
      )
      .select("quote_number")
      .single();

    if (error) {
      console.error("[api/quote/save] Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to persist quote proposal", code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, quoteNumber: data.quote_number },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/quote/save] Unexpected exception:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

