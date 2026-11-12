import React from "react";
import { createClient } from "@supabase/supabase-js";
import type { Lead } from "@/types/admin";
import { PipelineKanban } from "@/components/admin/PipelineKanban";
import { DollarSign, Flame, CheckCircle, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default async function AdminDashboardPage() {
  const supabase = getServiceClient();

  // Fetch leads
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("score", { ascending: false })
    .order("created_at", { ascending: false });

  const allLeads = (leads as Lead[]) || [];

  // Metrics
  const totalPipelineKes = allLeads.reduce((sum, l) => sum + (l.total_kes || 0), 0);
  const hotLeadsCount = allLeads.filter((l) => l.score_tag === "hot" || l.score >= 70).length;
  const wonCount = allLeads.filter((l) => l.status === "won").length;
  const wonVolumeKes = allLeads
    .filter((l) => l.status === "won")
    .reduce((sum, l) => sum + (l.total_kes || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold">
              Live Showroom Operations
            </span>
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-brand-ivory font-light mt-1">
            Director Pipeline & Lead Command
          </h1>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-brand-ivory/50 block">
            System Clock
          </span>
          <span className="text-xs font-mono text-brand-gold">
            Nairobi (EAT) • {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pipeline */}
        <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory/60">
              Active Pipeline
            </span>
            <DollarSign className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-mono text-brand-gold font-bold">
            KSh {totalPipelineKes.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono text-brand-ivory/40 mt-1 block">
            Across {allLeads.length} calculated quotes
          </span>
        </div>

        {/* Priority Hot Leads */}
        <div className="p-6 rounded-sm bg-brand-navy-card border border-emerald-500/40 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Call These First
            </span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono text-emerald-300 font-bold">
            {hotLeadsCount} Hot Leads
          </div>
          <span className="text-[10px] font-mono text-brand-ivory/40 mt-1 block">
            Highest intent, survey or phone ready
          </span>
        </div>

        {/* Won Orders */}
        <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory/60">
              Won Supply & Fit
            </span>
            <CheckCircle className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-mono text-brand-ivory font-bold">
            {wonCount} Deals
          </div>
          <span className="text-[10px] font-mono text-brand-gold mt-1 block">
            KSh {wonVolumeKes.toLocaleString()} confirmed
          </span>
        </div>

        {/* Total Quotes Created */}
        <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory/60">
              Total Inquiries
            </span>
            <Users className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-mono text-brand-ivory font-bold">
            {allLeads.length} Clients
          </div>
          <span className="text-[10px] font-mono text-brand-ivory/40 mt-1 block">
            Interactive room planner traffic
          </span>
        </div>
      </div>

      {/* Main Kanban & Lead Queue */}
      <PipelineKanban initialLeads={allLeads} />
    </div>
  );
}

