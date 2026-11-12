"use client";

import React from "react";
import type { Lead, LeadStatus } from "@/types/admin";
import { ScoreRing } from "./ScoreRing";
import { Phone, MessageSquare, MapPin } from "lucide-react";

interface LeadKanbanProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => Promise<void>;
}

export function LeadKanban({
  leads,
  onSelectLead,
  onStatusChange,
}: LeadKanbanProps) {
  const columns: {
    status: LeadStatus;
    title: string;
    description: string;
    badgeStyle: string;
  }[] = [
    {
      status: "quote_created",
      title: "Quote Created",
      description: "Calculated in 3D visualizer",
      badgeStyle: "border-slate-500/30 text-slate-300",
    },
    {
      status: "whatsapp_sent",
      title: "WhatsApp Sent",
      description: "Consultation initiated",
      badgeStyle: "border-indigo-500/30 text-indigo-300",
    },
    {
      status: "visit_booked",
      title: "Survey Booked",
      description: "On-site measurements",
      badgeStyle: "border-amber-500/30 text-amber-300",
    },
    {
      status: "won",
      title: "Won Deals",
      description: "Confirmed Supply & Fit",
      badgeStyle: "border-emerald-500/40 text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const colLeads = leads.filter((l) => {
          if (col.status === "visit_booked") {
            return l.status === "visit_booked" || l.status === "sample_booked";
          }
          if (col.status === "quote_created") {
            return l.status === "quote_created" || l.status === "quote_viewed";
          }
          return l.status === col.status;
        });

        const colTotalKes = colLeads.reduce(
          (sum, l) => sum + (Number(l.total_kes) || 0),
          0
        );

        return (
          <div
            key={col.status}
            className="rounded-xl bg-admin-surface border border-admin-border flex flex-col min-h-[500px] overflow-hidden shadow-xs"
          >
            {/* Column Header */}
            <div className="p-4 border-b border-admin-border bg-admin-surface-raised/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-sans font-semibold text-xs text-admin-text">
                  {col.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-admin-surface border border-admin-border text-admin-text">
                  {colLeads.length}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-admin-text-muted">
                <span className="text-[10px] uppercase font-mono tracking-wider">
                  Volume
                </span>
                <span className="font-mono font-bold text-admin-gold tabular-nums">
                  KSh {colTotalKes.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Column Cards */}
            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              {colLeads.map((lead) => {
                const rawPhone = lead.phone || "";
                const numericPhone = rawPhone.replace(/[^0-9]/g, "");
                const shopPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
                const targetPhone = numericPhone.length >= 9 ? numericPhone : shopPhone;
                const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
                  `Hello ${lead.full_name || "there"}, following up on quote ${lead.quote_ref || ""} from MarvelRise Decor.`
                )}`;

                return (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead?.(lead)}
                    className="p-3.5 rounded-lg bg-admin-surface-raised/80 hover:bg-admin-surface-raised border border-admin-border hover:border-admin-border-gold transition-all duration-150 cursor-pointer shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-sans font-semibold text-xs text-admin-text truncate hover:text-admin-gold transition-colors">
                          {lead.full_name || "Anonymous Visitor"}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-admin-text-muted mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-admin-gold shrink-0" />
                          <span className="truncate">Ruiru / Nairobi</span>
                        </div>
                      </div>

                      <ScoreRing score={lead.score} size={32} strokeWidth={3} />
                    </div>

                    {/* Financials & Area */}
                    <div className="flex items-baseline justify-between pt-1 border-t border-admin-border-subtle text-xs">
                      <span className="font-mono font-bold text-admin-gold tabular-nums text-xs">
                        KSh {Number(lead.total_kes).toLocaleString()}
                      </span>
                      <span className="text-[11px] font-mono text-admin-text-muted tabular-nums">
                        {lead.total_area_sqm} m²
                      </span>
                    </div>

                    {/* Quick Contacts */}
                    <div
                      className="flex items-center justify-between pt-1 text-[11px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lead.quote_ref ? (
                        <span className="font-mono text-[10px] text-admin-gold/80 bg-admin-gold/10 px-1.5 py-0.5 rounded border border-admin-gold/20">
                          {lead.quote_ref}
                        </span>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-1">
                        {lead.phone && (
                          <a
                            href={`tel:${numericPhone}`}
                            className="p-1 rounded bg-admin-surface hover:bg-admin-gold text-admin-text hover:text-brand-navy transition-colors"
                            title="Call"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                        )}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-emerald-600/15 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

              {colLeads.length === 0 && (
                <div className="py-12 text-center text-[11px] text-admin-text-muted/50 italic">
                  No leads in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

