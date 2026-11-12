import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { computeLeadScore } from "@/lib/admin/scoring";

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

    // Automatically synchronize with Leads Pipeline
    try {
      const rooms = Array.isArray(quoteData.rooms) ? quoteData.rooms : [];
      const totalAreaSqm = rooms.reduce(
        (sum: number, r: { dimensions?: { areaSqm?: number }; areaSqm?: number }) =>
          sum + (r.dimensions?.areaSqm || r.areaSqm || 0),
        0
      );

      const productsList: { code: string; name: string; category?: string }[] = [];
      rooms.forEach((r: { spcProduct?: { code: string; name: string }; wpcProduct?: { code: string; name: string }; lampProduct?: { code: string; name: string } }) => {
        if (r.spcProduct?.code) productsList.push({ ...r.spcProduct, category: "spc-flooring" });
        if (r.wpcProduct?.code) productsList.push({ ...r.wpcProduct, category: "wpc-wall-panels" });
        if (r.lampProduct?.code) productsList.push({ ...r.lampProduct, category: "lampshades" });
      });

      const scoreResult = computeLeadScore({
        status: "quote_created",
        total_kes: totalKes,
        total_area_sqm: totalAreaSqm,
        products: productsList,
        visit_count: 1,
        whatsapp_clicked: false,
      });

      // Find existing lead by quote_ref if any
      const { data: existingLead } = await supabase
        .from("leads")
        .select("id")
        .eq("quote_ref", quoteNumber)
        .maybeSingle();

      if (existingLead) {
        await supabase
          .from("leads")
          .update({
            source: "planner",
            status: "quote_created",
            total_kes: totalKes,
            total_area_sqm: totalAreaSqm,
            room_count: rooms.length || 1,
            products: productsList,
            score: scoreResult.score,
            score_reasons: scoreResult.reasons,
            score_tag: scoreResult.tag,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingLead.id);
      } else {
        await supabase.from("leads").insert({
          quote_ref: quoteNumber,
          source: "planner",
          status: "quote_created",
          total_kes: totalKes,
          total_area_sqm: totalAreaSqm,
          room_count: rooms.length || 1,
          products: productsList,
          score: scoreResult.score,
          score_reasons: scoreResult.reasons,
          score_tag: scoreResult.tag,
        });
      }
    } catch (leadSyncErr) {
      console.error("[api/quote/save] Non-blocking lead sync error:", leadSyncErr);
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
