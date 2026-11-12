"use client";

import React, { useState } from "react";
import type { Lead, LeadStatus } from "@/types/admin";
import { LeadCard } from "./LeadCard";
import { Flame, Filter, Search, ListFilter, Kanban, RefreshCw } from "lucide-react";

interface PipelineKanbanProps {
  initialLeads: Lead[];
}

export function PipelineKanban({ initialLeads }: PipelineKanbanProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [viewMode, setViewMode] = useState<"call_first" | "kanban" | "all">("call_first");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshLeads = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
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
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Filter leads
  const filtered = leads.filter((l) => {
    const matchesQuery =
      !searchQuery ||
      (l.full_name && l.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.phone && l.phone.includes(searchQuery)) ||
      (l.quote_ref && l.quote_ref.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || l.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  // Call These First: sorted by score desc, tag == 'hot' or score >= 70
  const callFirstLeads = [...filtered]
    .filter((l) => l.score_tag === "hot" || l.score >= 50)
    .sort((a, b) => b.score - a.score);

  const columns: { title: string; status: LeadStatus; count: number }[] = [
    { title: "Quote Created", status: "quote_created", count: filtered.filter((l) => l.status === "quote_created").length },
    { title: "WhatsApp Sent", status: "whatsapp_sent", count: filtered.filter((l) => l.status === "whatsapp_sent").length },
    { title: "Site Survey / Sample", status: "visit_booked", count: filtered.filter((l) => l.status === "visit_booked" || l.status === "sample_booked").length },
    { title: "Won (Supply & Fit)", status: "won", count: filtered.filter((l) => l.status === "won").length },
  ];

  return (
    <div className="space-y-6">
      {/* Control Bar: Search, Filters & View Mode Toggles */}
      <div className="p-4 rounded-sm bg-brand-navy-card border border-brand-gold/20 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-brand-gold/70 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, phone or quote ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-sm bg-brand-navy border border-brand-gold/20 focus:border-brand-gold text-brand-ivory text-xs font-mono placeholder:text-brand-ivory/30 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-brand-gold" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-sm bg-brand-navy border border-brand-gold/20 text-brand-ivory text-xs font-mono focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="quote_created">Quote Created</option>
            <option value="whatsapp_sent">WhatsApp Sent</option>
            <option value="visit_booked">Site Survey Booked</option>
            <option value="won">Won Deals</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-brand-navy p-1 rounded-sm border border-brand-gold/20">
          <button
            onClick={() => setViewMode("call_first")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
              viewMode === "call_first"
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                : "text-brand-ivory/60 hover:text-brand-ivory"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>Call These First</span>
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
              viewMode === "kanban"
                ? "bg-brand-gold/25 text-brand-gold border border-brand-gold/40"
                : "text-brand-ivory/60 hover:text-brand-ivory"
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
              viewMode === "all"
                ? "bg-brand-gold/25 text-brand-gold border border-brand-gold/40"
                : "text-brand-ivory/60 hover:text-brand-ivory"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>All ({filtered.length})</span>
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={refreshLeads}
          disabled={isRefreshing}
          className="p-2 rounded-sm border border-brand-gold/20 hover:border-brand-gold text-brand-gold transition-colors disabled:opacity-50"
          title="Refresh Leads"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* VIEW 1: Call These First (Priority Hot Ranking) */}
      {viewMode === "call_first" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="font-display text-xl uppercase tracking-wider text-brand-ivory">
                Priority Action Queue — Highest Intent Clients
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              {callFirstLeads.length} prioritized high-conversion leads
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callFirstLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {callFirstLeads.length === 0 && (
            <div className="p-12 text-center rounded-sm bg-brand-navy-card border border-dashed border-brand-gold/20">
              <p className="font-mono text-xs text-brand-ivory/50 uppercase tracking-widest">
                No hot leads pending contact right now
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Pipeline Kanban Board */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colLeads = filtered.filter(
              (l) =>
                l.status === col.status ||
                (col.status === "visit_booked" && l.status === "sample_booked")
            );

            return (
              <div
                key={col.status}
                className="rounded-sm bg-brand-navy-card/60 border border-brand-gold/15 p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-gold/15">
                  <span className="font-display text-sm uppercase tracking-wider text-brand-ivory font-medium">
                    {col.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-gold/20 text-brand-gold">
                    {colLeads.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                  {colLeads.length === 0 && (
                    <div className="py-8 text-center text-[10px] font-mono text-brand-ivory/30 uppercase tracking-widest">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: All Leads List */}
      {viewMode === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={handleStatusChange}
            />
          ))}
          {filtered.length === 0 && (
            <div className="p-12 col-span-2 text-center rounded-sm bg-brand-navy-card border border-dashed border-brand-gold/20">
              <p className="font-mono text-xs text-brand-ivory/50 uppercase tracking-widest">
                No matching leads found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

