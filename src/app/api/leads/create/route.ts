import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { computeLeadScore } from "@/lib/admin/scoring";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      quote_ref,
      visitor_id,
      full_name,
      phone,
      email,
      source = "planner",
      status = "quote_created",
      total_kes = 0,
      total_area_sqm = 0,
      room_count = 1,
      products = [],
      whatsapp_clicked = false,
      visit_booked_flag = false,
      notes,
      locale = "en",
    } = body;

    const supabase = getServiceClient();

    // Check if a lead with this quote_ref or visitor_id already exists
    let existingLead = null;
    if (quote_ref) {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("quote_ref", quote_ref)
        .maybeSingle();
      existingLead = data;
    } else if (visitor_id) {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("visitor_id", visitor_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      existingLead = data;
    }

    const visitCount = (existingLead?.visit_count || 0) + 1;
    const finalWhatsAppClicked = Boolean(existingLead?.whatsapp_clicked || whatsapp_clicked);
    const finalVisitBooked = Boolean(existingLead?.visit_booked_flag || visit_booked_flag);
    const finalPhone = phone || existingLead?.phone || null;

    const scoreResult = computeLeadScore({
      status: status || existingLead?.status || "quote_created",
      total_kes: Number(total_kes) || existingLead?.total_kes || 0,
      total_area_sqm: Number(total_area_sqm) || existingLead?.total_area_sqm || 0,
      products: products.length > 0 ? products : existingLead?.products || [],
      visit_count: visitCount,
      whatsapp_clicked: finalWhatsAppClicked,
      phone: finalPhone,
      visit_booked_flag: finalVisitBooked,
    });

    let leadRecord;

    if (existingLead) {
      const { data, error } = await supabase
        .from("leads")
        .update({
          quote_ref: quote_ref || existingLead.quote_ref,
          full_name: full_name || existingLead.full_name,
          phone: finalPhone,
          email: email || existingLead.email,
          status: status || existingLead.status,
          total_kes: Math.max(Number(total_kes) || 0, existingLead.total_kes || 0),
          total_area_sqm: Math.max(Number(total_area_sqm) || 0, existingLead.total_area_sqm || 0),
          room_count: Math.max(Number(room_count) || 1, existingLead.room_count || 1),
          products: products.length > 0 ? products : existingLead.products,
          score: scoreResult.score,
          score_reasons: scoreResult.reasons,
          score_tag: scoreResult.tag,
          visit_count: visitCount,
          whatsapp_clicked: finalWhatsAppClicked,
          phone_given: Boolean(finalPhone),
          visit_booked_flag: finalVisitBooked,
          notes: notes || existingLead.notes,
          locale,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id)
        .select()
        .single();

      if (error) throw error;
      leadRecord = data;
    } else {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          quote_ref,
          visitor_id,
          full_name,
          phone: finalPhone,
          email,
          source,
          status,
          total_kes: Number(total_kes) || 0,
          total_area_sqm: Number(total_area_sqm) || 0,
          room_count: Number(room_count) || 1,
          products,
          score: scoreResult.score,
          score_reasons: scoreResult.reasons,
          score_tag: scoreResult.tag,
          visit_count: 1,
          whatsapp_clicked: finalWhatsAppClicked,
          phone_given: Boolean(finalPhone),
          visit_booked_flag: finalVisitBooked,
          notes,
          locale,
        })
        .select()
        .single();

      if (error) throw error;
      leadRecord = data;

      // Automatically schedule 24-hour and 3-day follow-up reminders
      await supabase.from("follow_up_reminders").insert([
        {
          lead_id: leadRecord.id,
          type: "24h",
          trigger_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          lead_id: leadRecord.id,
          type: "3d",
          trigger_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    }

    // Log the touchpoint event
    await supabase.from("lead_events").insert({
      lead_id: leadRecord.id,
      event_type: status,
      payload: {
        total_kes: leadRecord.total_kes,
        score: leadRecord.score,
        tag: leadRecord.score_tag,
      },
    });

    return NextResponse.json({ success: true, lead: leadRecord });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to record lead";
    console.error("Lead creation failed:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

