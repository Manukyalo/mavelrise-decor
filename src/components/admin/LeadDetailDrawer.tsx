"use client";

import React, { useState } from "react";
import type { Lead, LeadStatus } from "@/types/admin";
import { ScoreRing } from "./ScoreRing";
import { StatusBadge } from "./StatusBadge";
import {
  X,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Clock,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => Promise<void>;
}

export function LeadDetailDrawer({
  lead,
  onClose,
  onStatusChange,
}: LeadDetailDrawerProps) {
  const [updating, setUpdating] = useState(false);

  if (!lead) return null;

  const rawPhone = lead.phone || "";
  const numericPhone = rawPhone.replace(/[^0-9]/g, "");
  const shopPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
  const targetPhone = numericPhone.length >= 9 ? numericPhone : shopPhone;
  const quoteRefText = lead.quote_ref || "your custom interior quote";
  const waMessage = `Hello ${lead.full_name || "there"}, this is MarvelRise Decor Atelier (Ruiru Membley). Following up on ${quoteRefText} (${lead.total_area_sqm} m², KSh ${Number(lead.total_kes).toLocaleString()}). Would you like us to schedule a site survey or reserve sample swatches?`;
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

  const handleStageSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as LeadStatus;
    if (onStatusChange) {
      setUpdating(true);
      try {
        await onStatusChange(lead.id, next);
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-admin-surface border-l border-admin-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Top Bar */}
          <div className="h-16 px-6 border-b border-admin-border flex items-center justify-between bg-admin-surface-raised/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-admin-text-muted">Lead Details</span>
              {lead.quote_ref && (
                <span className="font-mono text-[11px] font-semibold text-admin-gold bg-admin-gold/10 px-2 py-0.5 rounded border border-admin-gold/25">
                  {lead.quote_ref}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-raised transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header: Score + Name + Stage */}
            <div className="flex items-start gap-4">
              <ScoreRing score={lead.score} size={54} strokeWidth={4} />

              <div className="flex-1 min-w-0">
                <h2 className="font-sans font-bold text-lg text-admin-text truncate">
                  {lead.full_name || "Anonymous Design Visitor"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={lead.status} size="sm" />
                  <span className="text-xs text-admin-text-muted font-mono">
                    {new Date(lead.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Selector */}
            <div className="p-3.5 rounded-xl bg-admin-surface-raised border border-admin-border space-y-1.5">
              <label className="block text-[11px] font-medium text-admin-text-muted uppercase tracking-wider">
                Pipeline Stage
              </label>
              <div className="relative">
                <select
                  value={lead.status}
                  disabled={updating}
                  onChange={handleStageSelect}
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-admin-surface border border-admin-border hover:border-admin-border-gold text-admin-text text-xs font-medium focus:outline-none focus:ring-1 focus:ring-admin-gold cursor-pointer transition-colors"
                >
                  <option value="quote_created">Quote Created</option>
                  <option value="quote_viewed">Proposal Viewed</option>
                  <option value="whatsapp_sent">WhatsApp Sent</option>
                  <option value="visit_booked">Site Survey Booked</option>
                  <option value="sample_booked">Sample Booked</option>
                  <option value="won">Won Deal (Supply & Fit)</option>
                  <option value="lost">Lost</option>
                </select>
                <ChevronDown className="w-4 h-4 text-admin-gold absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {numericPhone ? (
                <a
                  href={`tel:${numericPhone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-admin-gold hover:bg-admin-gold-hover text-brand-navy font-semibold text-xs transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Client</span>
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-admin-surface-raised border border-admin-border text-admin-text-muted text-xs opacity-50 cursor-not-allowed">
                  <Phone className="w-4 h-4" />
                  <span>No Phone</span>
                </div>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Project Valuation & Scope */}
            <div className="p-4 rounded-xl bg-admin-surface-raised border border-admin-border space-y-3">
              <span className="text-[11px] font-medium text-admin-text-muted uppercase tracking-wider block">
                Project Scope & Estimate
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-admin-text-muted block">
                    Total Estimate
                  </span>
                  <span className="font-mono text-lg font-bold text-admin-gold tabular-nums">
                    KSh {Number(lead.total_kes).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-admin-text-muted block">
                    Surface Area
                  </span>
                  <span className="font-sans text-sm text-admin-text font-semibold">
                    <span className="font-mono tabular-nums">{lead.total_area_sqm}</span> m²
                    <span className="text-xs text-admin-text-muted font-normal ml-1">
                      ({lead.room_count} {lead.room_count === 1 ? "room" : "rooms"})
                    </span>
                  </span>
                </div>
              </div>

              {lead.quote_ref && (
                <div className="pt-2 border-t border-admin-border-subtle">
                  <a
                    href={`/en/quote/${lead.quote_ref}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-admin-gold hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Proposal Document & Spec Sheet</span>
                  </a>
                </div>
              )}
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-xl bg-admin-surface-raised border border-admin-border space-y-2.5 text-xs">
              <span className="text-[11px] font-medium text-admin-text-muted uppercase tracking-wider block">
                Contact Information
              </span>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-admin-text">
                  <Phone className="w-3.5 h-3.5 text-admin-gold shrink-0" />
                  <span className="font-mono">{lead.phone || "Not provided"}</span>
                </div>

                {lead.email && (
                  <div className="flex items-center gap-2.5 text-admin-text">
                    <Mail className="w-3.5 h-3.5 text-admin-gold shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-admin-text">
                  <MapPin className="w-3.5 h-3.5 text-admin-gold shrink-0" />
                  <span>Ruiru / Nairobi Metropolitan Area</span>
                </div>
              </div>
            </div>

            {/* Score Breakdown Factors */}
            {lead.score_reasons && lead.score_reasons.length > 0 && (
              <div className="p-4 rounded-xl bg-admin-surface-raised border border-admin-border space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-admin-text-muted uppercase tracking-wider">
                    Score Factors ({lead.score}/100)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    High Intent
                  </span>
                </div>

                <div className="space-y-1.5">
                  {lead.score_reasons.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1 border-b border-admin-border-subtle text-[11px]"
                    >
                      <span className="text-admin-text-muted">{r.reason}</span>
                      <span className="font-mono font-bold text-admin-gold">
                        +{r.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Specifications */}
            {lead.products && lead.products.length > 0 && (
              <div className="p-4 rounded-xl bg-admin-surface-raised border border-admin-border space-y-2.5 text-xs">
                <span className="text-[11px] font-medium text-admin-text-muted uppercase tracking-wider block">
                  Selected Product Specifications
                </span>

                <div className="space-y-2">
                  {lead.products.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-admin-surface border border-admin-border space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-admin-gold font-bold">
                          {p.code}
                        </span>
                        {p.qty && (
                          <span className="font-mono text-[11px] text-admin-text-muted">
                            Qty: {p.qty}
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-admin-text text-xs">
                        {p.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Notes */}
            {lead.notes && (
              <div className="p-4 rounded-xl bg-admin-surface-raised border border-admin-border space-y-1.5">
                <span className="text-[11px] font-medium text-admin-text-muted uppercase tracking-wider block">
                  Studio Notes
                </span>
                <p className="text-xs text-admin-text leading-relaxed italic bg-admin-surface p-3 rounded-lg border border-admin-border-subtle">
                  &ldquo;{lead.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

