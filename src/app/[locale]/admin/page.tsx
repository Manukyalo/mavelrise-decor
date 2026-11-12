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

export default async function AdminDashboardPage() {
  const supabase = getServiceClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("score", { ascending: false })
    .order("created_at", { ascending: false });

  const allLeads = (leads as Lead[]) || [];

  return (
    <div className="space-y-6">
      {/* Page Header with Serif Title and refined spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-admin-border">
        <div>
          <span className="text-[11px] font-mono tracking-wider text-admin-gold uppercase block">
            Executive Command Suite
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-admin-text font-normal mt-0.5 tracking-tight">
            Client Leads & Project Pipeline
          </h1>
        </div>

        <div className="text-left sm:text-right text-xs text-admin-text-muted">
          <span>Ruiru Membley Showroom</span>
          <span className="font-mono text-admin-gold block text-[11px] mt-0.5">
            Updated live from 3D room visualizer
          </span>
        </div>
      </div>

      {/* Main Priority, Table and Kanban */}
      <PipelineKanban initialLeads={allLeads} />
    </div>
  );
}
