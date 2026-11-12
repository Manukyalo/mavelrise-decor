import React from "react";
import { createClient } from "@supabase/supabase-js";
import type { Lead } from "@/types/admin";
import { PipelineKanban } from "@/components/admin/PipelineKanban";

export const dynamic = "force-dynamic";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default async function AdminLeadsPage() {
  const supabase = getServiceClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("score", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold">
          Sales & Pipeline
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-brand-ivory font-light mt-1">
          Client Leads & Ranked Inquiries
        </h1>
      </div>

      <PipelineKanban initialLeads={(leads as Lead[]) || []} />
    </div>
  );
}

