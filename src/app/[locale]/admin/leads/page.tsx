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

  const allLeads = (leads as Lead[]) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-admin-border">
        <div>
          <span className="text-[11px] font-mono tracking-wider text-admin-gold uppercase block">
            Client Inquiries & CRM
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-admin-text font-normal mt-0.5 tracking-tight">
            Client Leads & Valuation Pipeline
          </h1>
        </div>

        <div className="text-left sm:text-right text-xs text-admin-text-muted">
          <span>{allLeads.length} total customer leads</span>
          <span className="font-mono text-admin-gold block text-[11px] mt-0.5">
            Auto-scored 0 to 100
          </span>
        </div>
      </div>

      <PipelineKanban initialLeads={allLeads} />
    </div>
  );
}
