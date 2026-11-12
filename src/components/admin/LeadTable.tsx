"use client";

import React, { useState } from "react";
import type { Lead, LeadStatus } from "@/types/admin";
import { ScoreRing } from "./ScoreRing";
import { StatusBadge } from "./StatusBadge";
import { ArrowUpDown, Phone, MessageSquare, ExternalLink } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => Promise<void>;
}

export function LeadTable({ leads, onSelectLead, onStatusChange }: LeadTableProps) {
  const [sortField, setSortField] = useState<"score" | "total_kes" | "created_at">("score");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: "score" | "total_kes" | "created_at") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let diff = 0;
    if (sortField === "score") diff = a.score - b.score;
    else if (sortField === "total_kes") diff = a.total_kes - b.total_kes;
    else if (sortField === "created_at")
      diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

    return sortAsc ? diff : -diff;
  });

  return (
    <div className="rounded-xl bg-admin-surface border border-admin-border overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-admin-border bg-admin-surface-raised/60 text-admin-text-muted">
              <th
                onClick={() => handleSort("score")}
                className="py-3 px-4 font-medium text-admin-text-muted hover:text-admin-text cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Score</span>
                  <ArrowUpDown className="w-3 h-3 text-admin-gold" />
                </div>
              </th>

              <th className="py-3 px-4 font-medium text-admin-text-muted">
                Client / Project
              </th>

              <th className="py-3 px-4 font-medium text-admin-text-muted">
                Quote ID
              </th>

              <th
                onClick={() => handleSort("total_kes")}
                className="py-3 px-4 font-medium text-admin-text-muted hover:text-admin-text cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Estimate (KSh)</span>
                  <ArrowUpDown className="w-3 h-3 text-admin-gold" />
                </div>
              </th>

              <th className="py-3 px-4 font-medium text-admin-text-muted">
                Coverage
              </th>

              <th className="py-3 px-4 font-medium text-admin-text-muted">
                Stage
              </th>

              <th
                onClick={() => handleSort("created_at")}
                className="py-3 px-4 font-medium text-admin-text-muted hover:text-admin-text cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3 text-admin-gold" />
                </div>
              </th>

              <th className="py-3 px-4 font-medium text-admin-text-muted text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-admin-border-subtle">
            {sortedLeads.map((lead) => {
              const rawPhone = lead.phone || "";
              const numericPhone = rawPhone.replace(/[^0-9]/g, "");
              const shopPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
              const targetPhone = numericPhone.length >= 9 ? numericPhone : shopPhone;
              const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
                `Hello ${lead.full_name || "there"}, following up on quote ${lead.quote_ref || ""} from MarvelRise Decor.`
              )}`;

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-admin-surface-hover/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectLead?.(lead)}
                >
                  {/* Score */}
                  <td className="py-3 px-4">
                    <ScoreRing score={lead.score} size={36} strokeWidth={3} />
                  </td>

                  {/* Client Name & Phone */}
                  <td className="py-3 px-4 min-w-[200px]">
                    <div className="font-sans font-semibold text-admin-text group-hover:text-admin-gold transition-colors truncate">
                      {lead.full_name || "Anonymous Visitor"}
                    </div>
                    {lead.phone ? (
                      <div className="font-mono text-[11px] text-admin-text-muted mt-0.5">
                        {lead.phone}
                      </div>
                    ) : (
                      <div className="text-[11px] text-admin-text-muted/50 mt-0.5 italic">
                        No phone provided
                      </div>
                    )}
                  </td>

                  {/* Quote ID Chip */}
                  <td className="py-3 px-4">
                    {lead.quote_ref ? (
                      <span className="font-mono text-[11px] text-admin-gold bg-admin-gold/10 px-2 py-0.5 rounded border border-admin-gold/25 whitespace-nowrap">
                        {lead.quote_ref}
                      </span>
                    ) : (
                      <span className="text-admin-text-muted/40 font-mono text-[11px]">
                        —
                      </span>
                    )}
                  </td>

                  {/* Estimate (KSh) */}
                  <td className="py-3 px-4 font-mono font-bold text-admin-text tabular-nums">
                    KSh {Number(lead.total_kes).toLocaleString()}
                  </td>

                  {/* Coverage */}
                  <td className="py-3 px-4 font-sans text-admin-text-muted whitespace-nowrap">
                    <span className="font-mono text-admin-text font-medium tabular-nums">
                      {lead.total_area_sqm}
                    </span>{" "}
                    m²{" "}
                    <span className="text-[11px] text-admin-text-muted">
                      ({lead.room_count} {lead.room_count === 1 ? "room" : "rooms"})
                    </span>
                  </td>

                  {/* Stage Badge */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge status={lead.status} size="sm" />
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 font-mono text-[11px] text-admin-text-muted whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {lead.phone && (
                        <a
                          href={`tel:${numericPhone}`}
                          className="p-1.5 rounded bg-admin-surface-raised hover:bg-admin-gold text-admin-text hover:text-brand-navy transition-colors"
                          title="Call client"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-emerald-600/15 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors"
                        title="Open WhatsApp chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

