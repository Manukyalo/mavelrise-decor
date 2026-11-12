import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { createClient } from "@supabase/supabase-js";
import { computeLeadScore } from "@/lib/admin/scoring";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const { data: events } = await supabase
    .from("lead_events")
    .select("*")
    .eq("lead_id", params.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ lead, events: events || [] });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getServiceClient();

  // Fetch current lead
  const { data: currentLead, error: fetchErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchErr || !currentLead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Update lead and recompute score if status or attributes changed
  const newStatus = body.status || currentLead.status;
  const newNotes = body.notes !== undefined ? body.notes : currentLead.notes;
  const newVisitBooked =
    body.visit_booked_flag !== undefined
      ? body.visit_booked_flag
      : currentLead.visit_booked_flag;

  const scoreResult = computeLeadScore({
    status: newStatus,
    total_kes: currentLead.total_kes,
    total_area_sqm: currentLead.total_area_sqm,
    products: currentLead.products || [],
    visit_count: currentLead.visit_count || 1,
    whatsapp_clicked: currentLead.whatsapp_clicked,
    phone: currentLead.phone,
    visit_booked_flag: newVisitBooked,
  });

  const { data: updated, error: updateErr } = await supabase
    .from("leads")
    .update({
      status: newStatus,
      notes: newNotes,
      visit_booked_flag: newVisitBooked,
      score: scoreResult.score,
      score_reasons: scoreResult.reasons,
      score_tag: scoreResult.tag,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Log event
  await supabase.from("lead_events").insert({
    lead_id: params.id,
    event_type: "status_update",
    payload: {
      previous_status: currentLead.status,
      new_status: newStatus,
      updated_by: session.fullName || session.user.email,
    },
  });

  return NextResponse.json({ lead: updated });
}

