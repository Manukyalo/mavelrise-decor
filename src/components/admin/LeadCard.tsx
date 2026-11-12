"use client";

import React, { useState } from "react";
import type { Lead, LeadStatus } from "@/types/admin";
import { ScoreRing } from "./ScoreRing";
import { StatusBadge } from "./StatusBadge";
import {
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Layers,
  MapPin,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onSelectLead?: (lead: Lead) => void;
}

export function LeadCard({ lead, onStatusChange, onSelectLead }: LeadCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);
  const [expanded, setExpanded] = useState(false);

  const handleStatusSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as LeadStatus;
    setCurrentStatus(nextStatus);
    if (onStatusChange) {
      setIsUpdating(true);
      try {
        await onStatusChange(lead.id, nextStatus);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Clean formatted phone and URLs
  const rawPhone = lead.phone || "";
  const numericPhone = rawPhone.replace(/[^0-9]/g, "");
  const formattedPhone = rawPhone
    ? rawPhone.startsWith("+")
      ? rawPhone
      : `+${rawPhone}`
    : null;

  const shopPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
  const targetPhone = numericPhone.length >= 9 ? numericPhone : shopPhone;
  const quoteRefText = lead.quote_ref || "your custom interior quote";
  const waMessage = `Hello ${lead.full_name || "there"}, this is MarvelRise Decor Atelier (Ruiru Membley). Following up on ${quoteRefText} (${lead.total_area_sqm} m², KSh ${Number(lead.total_kes).toLocaleString()}). Would you like us to schedule a site survey or reserve sample swatches?`;
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

  // Extract project location or default
  const locationText = lead.notes?.includes("Runda")
    ? "Runda Villa Project"
    : lead.notes?.includes("Garden Estate")
      ? "Garden Estate"
      : lead.quote_ref
        ? "Ruiru & Nairobi Metropolitan"
        : "Showroom Inquiry";

  return (
    <div className="group rounded-xl bg-admin-surface border border-admin-border hover:border-admin-border-gold transition-all duration-200 shadow-sm hover:shadow-md p-4 sm:p-5 flex flex-col gap-4">
      {/* Top Row: Score + Client Info + Stage Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Score Ring + Client Name + Quote ID Chip */}
        <div className="flex items-center gap-3.5 min-w-0">
          <ScoreRing score={lead.score} size={44} strokeWidth={3.5} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h3
                onClick={() => onSelectLead?.(lead)}
                className="font-sans font-semibold text-sm sm:text-base text-admin-text truncate hover:text-admin-gold cursor-pointer transition-colors"
                title={lead.full_name || "Anonymous Design Visitor"}
              >
                {lead.full_name || "Anonymous Design Visitor"}
              </h3>

              {lead.quote_ref && (
                <span className="font-mono text-[11px] font-medium text-admin-gold bg-admin-gold/10 px-2 py-0.5 rounded border border-admin-gold/25 whitespace-nowrap shrink-0">
                  {lead.quote_ref}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-admin-text-muted mt-0.5">
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-admin-gold shrink-0" />
                <span className="truncate">{locationText}</span>
              </span>
              <span>•</span>
              <span className="font-mono text-[11px]">
                {new Date(lead.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Stage Dropdown Selector */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <div className="relative">
            <select
              value={currentStatus}
              disabled={isUpdating}
              onChange={handleStatusSelect}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-admin-surface-raised border border-admin-border hover:border-admin-border-gold text-admin-text text-xs font-sans font-medium focus:outline-none focus:ring-1 focus:ring-admin-gold cursor-pointer transition-colors"
            >
              <option value="quote_created">Quote Created</option>
              <option value="quote_viewed">Proposal Viewed</option>
              <option value="whatsapp_sent">WhatsApp Sent</option>
              <option value="visit_booked">Site Survey Booked</option>
              <option value="sample_booked">Sample Booked</option>
              <option value="won">Won Deal</option>
              <option value="lost">Lost</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-admin-gold absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Metrics Row: Estimate, Coverage, Phone, Actions */}
      <div className="pt-3 border-t border-admin-border flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div>
            <span className="text-[10px] text-admin-text-muted uppercase tracking-wider block">
              Estimate
            </span>
            <span className="font-mono text-sm font-bold text-admin-gold tabular-nums">
              KSh {Number(lead.total_kes).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-admin-text-muted uppercase tracking-wider block">
              Coverage
            </span>
            <span className="font-sans text-xs text-admin-text font-medium">
              <span className="font-mono tabular-nums">{lead.total_area_sqm}</span> m²{" "}
              <span className="text-admin-text-muted">
                ({lead.room_count} {lead.room_count === 1 ? "room" : "rooms"})
              </span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-admin-text-muted uppercase tracking-wider block">
              Direct Contact
            </span>
            {formattedPhone ? (
              <a
                href={`tel:${numericPhone}`}
                className="font-mono text-xs text-admin-text hover:text-admin-gold transition-colors inline-flex items-center gap-1"
              >
                <span>{formattedPhone}</span>
              </a>
            ) : (
              <span className="text-admin-text-muted/60 text-xs">No phone</span>
            )}
          </div>
        </div>

        {/* Action Buttons: Call (Primary) + WhatsApp + Expand */}
        <div className="flex items-center gap-2">
          {formattedPhone && (
            <a
              href={`tel:${numericPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-gold hover:bg-admin-gold-hover text-brand-navy font-semibold text-xs transition-colors shadow-xs"
              title="Call Client directly"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs transition-colors"
            title="Open WhatsApp chat with pre-filled quote proposal message"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {lead.products && lead.products.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-raised transition-colors"
              title={expanded ? "Hide products" : "Show product specs"}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Product Spec Row (Collapsed by Default) */}
      {expanded && lead.products && lead.products.length > 0 && (
        <div className="pt-3 border-t border-admin-border-subtle bg-admin-surface-raised/50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 rounded-b-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] text-admin-text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3 h-3 text-admin-gold" />
              <span>Product Spec Selection</span>
            </span>
            {lead.quote_ref && (
              <a
                href={`/en/quote/${lead.quote_ref}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-admin-gold hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Proposal PDF</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {lead.products.map((p, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded bg-admin-surface border border-admin-border text-[11px] font-sans text-admin-text flex items-center gap-1.5"
              >
                <span className="font-mono text-[10px] text-admin-gold font-semibold">
                  {p.code}
                </span>
                <span>{p.name}</span>
                {p.qty ? (
                  <span className="text-admin-text-muted font-mono">({p.qty}x)</span>
                ) : null}
              </span>
            ))}
          </div>

          {lead.score_reasons && lead.score_reasons.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1">
              {lead.score_reasons.map((r, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-admin-surface/70 border border-admin-border-subtle text-[10px] text-admin-text-muted font-mono"
                >
                  +{r.points} {r.reason}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
