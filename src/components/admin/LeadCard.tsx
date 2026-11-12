"use client";

import React, { useState } from "react";
import type { Lead, LeadStatus } from "@/types/admin";
import {
  Phone,
  Calendar,
  Layers,
  Flame,
  Clock,
  ChevronDown,
  CheckCircle2,
  XCircle,
  FileText,
  MessageSquare,
} from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onStatusChange?: (leadId: string, newStatus: LeadStatus) => Promise<void>;
}

export function LeadCard({ lead, onStatusChange }: LeadCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "border-emerald-500/50 bg-emerald-950/40 text-emerald-400";
    if (score >= 40) return "border-amber-500/50 bg-amber-950/40 text-amber-300";
    return "border-slate-600/40 bg-slate-900/40 text-slate-400";
  };

  const getTagBadge = (tag: string) => {
    if (tag === "hot") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold">
          <Flame className="w-3 h-3 text-emerald-400" />
          <span>Hot Lead</span>
        </span>
      );
    }
    if (tag === "warm") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Warm Prospect</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-500/15 border border-slate-500/30 text-slate-400">
        <span>Cold / Browsing</span>
      </span>
    );
  };

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

  // Generate 1-tap WhatsApp consultation link
  const clientPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : "";
  const shopPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
  const targetPhone = clientPhone.length >= 9 ? clientPhone : shopPhone;
  const quoteRefText = lead.quote_ref ? `quote ref ${lead.quote_ref}` : "your luxury interior quote";
  const waMessage = `Hello ${lead.full_name || "there"}, this is MarvelRise Decor Atelier (Ruiru Membley). Following up on ${quoteRefText} for ${lead.total_area_sqm}m² (KSh ${lead.total_kes.toLocaleString()}). Would you like us to schedule a site survey or reserve sample swatches?`;
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="p-6 rounded-sm bg-brand-navy-card/90 border border-brand-gold/20 hover:border-brand-gold/45 transition-all duration-300 shadow-xl space-y-5">
      {/* Top Header: Score + Tag + Ref */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Score Badge */}
          <div
            className={`w-14 h-14 rounded-sm border flex flex-col items-center justify-center font-mono ${getScoreColor(
              lead.score
            )}`}
          >
            <span className="text-xl font-bold leading-none">{lead.score}</span>
            <span className="text-[9px] uppercase tracking-wider opacity-80 mt-0.5">
              Score
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              {getTagBadge(lead.score_tag)}
              {lead.quote_ref && (
                <span className="text-[11px] font-mono text-brand-gold/80 bg-brand-gold/10 px-2 py-0.5 rounded-sm border border-brand-gold/20">
                  {lead.quote_ref}
                </span>
              )}
            </div>
            <h3 className="font-display text-lg text-brand-ivory font-medium">
              {lead.full_name || "Anonymous Design Visitor"}
            </h3>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={currentStatus}
            disabled={isUpdating}
            onChange={handleStatusSelect}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-sm bg-brand-navy border border-brand-gold/30 hover:border-brand-gold text-brand-ivory text-xs font-mono uppercase tracking-wider focus:outline-none cursor-pointer transition-colors"
          >
            <option value="quote_created">Quote Created</option>
            <option value="quote_viewed">Quote Viewed</option>
            <option value="whatsapp_sent">WhatsApp Sent</option>
            <option value="visit_booked">Site Survey Booked</option>
            <option value="sample_booked">Sample Swatch Booked</option>
            <option value="won">Won (Supply & Fit)</option>
            <option value="lost">Lost</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-brand-gold absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Project Financials & Area */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-sm bg-brand-navy/60 border border-brand-gold/10 text-xs font-mono">
        <div>
          <span className="text-[10px] text-brand-ivory/50 uppercase tracking-wider block">
            Estimate Total
          </span>
          <span className="text-sm text-brand-gold font-bold">
            KSh {lead.total_kes.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-brand-ivory/50 uppercase tracking-wider block">
            Room Coverage
          </span>
          <span className="text-brand-ivory">
            {lead.total_area_sqm} m² ({lead.room_count} {lead.room_count === 1 ? "room" : "rooms"})
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] text-brand-ivory/50 uppercase tracking-wider block">
            Phone / Contact
          </span>
          <span className="text-brand-ivory truncate block">
            {lead.phone || "No phone given"}
          </span>
        </div>
      </div>

      {/* Selected Products */}
      {lead.products && lead.products.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-brand-ivory/50 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-brand-gold" />
            <span>Product Spec Selection</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {lead.products.map((p, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-sm bg-brand-navy border border-brand-gold/20 text-[11px] font-mono text-brand-ivory/80"
              >
                {p.code}: {p.name} {p.qty ? `(${p.qty} units)` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visible Reasons Behind Lead Score */}
      {lead.score_reasons && lead.score_reasons.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-brand-gold uppercase tracking-wider block">
            Score Breakdown Factors
          </span>
          <div className="flex flex-wrap gap-1.5">
            {lead.score_reasons.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-brand-gold/10 border border-brand-gold/25 text-[10px] font-mono text-brand-gold"
              >
                <span>+{r.points}</span>
                <span className="text-brand-ivory/70">{r.reason}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes if any */}
      {lead.notes && (
        <p className="text-xs font-sans text-brand-ivory/70 bg-brand-navy/40 p-2.5 rounded-sm border-l-2 border-brand-gold italic">
          &ldquo;{lead.notes}&rdquo;
        </p>
      )}

      {/* Bottom Actions: 1-Tap WhatsApp Follow-up + Proposal Link */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-brand-gold/10">
        <div className="text-[11px] font-mono text-brand-ivory/40">
          Created: {new Date(lead.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </div>

        <div className="flex items-center gap-2">
          {lead.quote_ref && (
            <a
              href={`/en/quote/${lead.quote_ref}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-brand-gold/30 hover:border-brand-gold text-brand-gold text-[11px] font-mono uppercase tracking-wider transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>Proposal PDF</span>
            </a>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-emerald-950/40 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>1-Tap WhatsApp Follow-up</span>
          </a>
        </div>
      </div>
    </div>
  );
}

