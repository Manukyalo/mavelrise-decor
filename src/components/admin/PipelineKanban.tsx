"use client";

import React, { useState } from "react";
import type { Lead, LeadStatus } from "@/types/admin";
import { LeadCard } from "./LeadCard";
import { LeadTable } from "./LeadTable";
import { LeadKanban } from "./LeadKanban";
import { LeadDetailDrawer } from "./LeadDetailDrawer";
import { StatCard } from "./StatCard";
import { EmptyState } from "./EmptyState";
import {
  Flame,
  Search,
  RefreshCw,
  Table as TableIcon,
  Kanban,
  Download,
  Filter,
  DollarSign,
  Award,
  Users,
} from "lucide-react";

interface PipelineKanbanProps {
  initialLeads: Lead[];
}

export function PipelineKanban({ initialLeads }: PipelineKanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [viewMode, setViewMode] = useState<"priority" | "table" | "kanban">("priority");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const refreshLeads = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? data.lead : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead(data.lead);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const exportCsv = () => {
    const headers = "Quote Ref,Client Name,Phone,Email,Status,Total KES,Area m2,Score,Date\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.quote_ref || ""}","${l.full_name || ""}","${l.phone || ""}","${l.email || ""}","${l.status}",${l.total_kes},${l.total_area_sqm},${l.score},"${new Date(l.created_at).toISOString()}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marvelrise-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered Leads
  const filtered = leads.filter((l) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (l.full_name && l.full_name.toLowerCase().includes(query)) ||
      (l.phone && l.phone.includes(query)) ||
      (l.quote_ref && l.quote_ref.toLowerCase().includes(query));

    const matchesStage = stageFilter === "all" || l.status === stageFilter;

    return matchesSearch && matchesStage;
  });

  // KPI Calculations
  const totalLeadsCount = leads.length;
  const hotLeadsCount = leads.filter((l) => l.score >= 70 || l.score_tag === "hot").length;
  const totalPipelineKes = leads.reduce((sum, l) => sum + (Number(l.total_kes) || 0), 0);
  const avgScore =
    leads.length > 0
      ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length)
      : 0;

  // Priority queue: sorted by score desc
  const priorityLeads = [...filtered].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. KPI SUMMARY STRIP (4 Cards) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Inquiries"
          value={String(totalLeadsCount)}
          subtext="3D room visualizer traffic"
          icon={Users}
        />
        <StatCard
          label="Hot Leads (Priority)"
          value={String(hotLeadsCount)}
          badge="High Intent"
          subtext="Booked visit or phone given"
          icon={Flame}
          variant="emerald"
        />
        <StatCard
          label="Active Pipeline Value"
          value={`KSh ${totalPipelineKes.toLocaleString()}`}
          subtext="Total calculated quotes"
          icon={DollarSign}
          variant="gold"
        />
        <StatCard
          label="Average Lead Score"
          value={`${avgScore} / 100`}
          subtext="Weighted client intent rating"
          icon={Award}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOOLBAR: Search, Stage Filter, Segmented View Switch, CSV Export */}
      {/* ========================================================================= */}
      <div className="p-3.5 rounded-xl bg-admin-surface border border-admin-border flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] sm:min-w-[300px]">
          <Search className="w-4 h-4 text-admin-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone or quote ID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-admin-surface-raised border border-admin-border hover:border-admin-border-gold focus:border-admin-gold text-xs text-admin-text placeholder:text-admin-text-muted/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Stage Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-admin-gold shrink-0" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-admin-surface-raised border border-admin-border hover:border-admin-border-gold text-xs text-admin-text focus:outline-none focus:ring-1 focus:ring-admin-gold cursor-pointer transition-colors"
          >
            <option value="all">All Stages ({leads.length})</option>
            <option value="quote_created">Quote Created</option>
            <option value="quote_viewed">Proposal Viewed</option>
            <option value="whatsapp_sent">WhatsApp Sent</option>
            <option value="visit_booked">Survey Booked</option>
            <option value="won">Won Deals</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Segmented View Switcher: Priority | Table | Kanban */}
        <div className="flex items-center rounded-lg border border-admin-border p-1 bg-admin-surface-raised">
          <button
            onClick={() => setViewMode("priority")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans transition-colors ${viewMode === "priority"
                ? "bg-admin-surface text-admin-text font-semibold shadow-xs border border-admin-border"
                : "text-admin-text-muted hover:text-admin-text"
              }`}
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>Priority</span>
            <span className="font-mono text-[10px] opacity-75">
              ({priorityLeads.length})
            </span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans transition-colors ${viewMode === "table"
                ? "bg-admin-surface text-admin-text font-semibold shadow-xs border border-admin-border"
                : "text-admin-text-muted hover:text-admin-text"
              }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-admin-gold" />
            <span>Table</span>
            <span className="font-mono text-[10px] opacity-75">
              ({filtered.length})
            </span>
          </button>

          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans transition-colors ${viewMode === "kanban"
                ? "bg-admin-surface text-admin-text font-semibold shadow-xs border border-admin-border"
                : "text-admin-text-muted hover:text-admin-text"
              }`}
          >
            <Kanban className="w-3.5 h-3.5 text-admin-gold" />
            <span>Kanban</span>
          </button>
        </div>

        {/* Actions: Refresh + Export CSV */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-admin-border hover:border-admin-border-gold bg-admin-surface hover:bg-admin-surface-raised text-admin-text-muted hover:text-admin-text text-xs font-medium transition-colors"
            title="Export filtered leads to CSV"
          >
            <Download className="w-3.5 h-3.5 text-admin-gold" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={refreshLeads}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-admin-border hover:border-admin-border-gold bg-admin-surface hover:bg-admin-surface-raised text-admin-gold transition-colors disabled:opacity-50"
            title="Refresh Leads Data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE VIEW CONTAINER */}
      {/* ========================================================================= */}

      {/* VIEW 1: Priority Compact Horizontal Cards */}
      {viewMode === "priority" && (
        <div className="space-y-3">
          {priorityLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={handleStatusChange}
              onSelectLead={(l) => setSelectedLead(l)}
            />
          ))}

          {priorityLeads.length === 0 && (
            <EmptyState
              title="No Leads Found"
              description="No customer inquiries match your active filter criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setStageFilter("all");
              }}
            />
          )}
        </div>
      )}

      {/* VIEW 2: Accessible Sortable Data Table */}
      {viewMode === "table" && (
        <div>
          {filtered.length > 0 ? (
            <LeadTable
              leads={filtered}
              onSelectLead={(l) => setSelectedLead(l)}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <EmptyState
              title="No Leads Found"
              description="No customer inquiries match your active filter criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery("");
                setStageFilter("all");
              }}
            />
          )}
        </div>
      )}

      {/* VIEW 3: Visual Kanban Pipeline */}
      {viewMode === "kanban" && (
        <LeadKanban
          leads={filtered}
          onSelectLead={(l) => setSelectedLead(l)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. RIGHT-SIDE DETAIL DRAWER */}
      {/* ========================================================================= */}
      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
