"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PlankQuotePanel — live quote derived from plank layout calculation
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Share2, Download, MessageCircle } from "lucide-react";
import type { QuoteSummary } from "@/lib/planner/types";
import { PLANK_LENGTH_MM, PLANK_WIDTH_MM, PLANKS_PER_BOX, BOX_COVERAGE_SQM } from "@/lib/planner/geometry";

interface Props {
  quote: QuoteSummary | null;
  laid: number;
  total: number;
  isAnimating: boolean;
  shareCode: string | null;
  onShare: () => void;
  onWhatsApp: () => void;
  whatsAppPhone: string;
}

export function PlankQuotePanel({
  quote,
  laid,
  total,
  isAnimating,
  shareCode,
  onShare,
  onWhatsApp,
}: Props) {
  const progress = total > 0 ? Math.round((laid / total) * 100) : 0;

  if (!quote) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-xl text-brand-ivory uppercase tracking-wide">
            Installation Quote
          </h2>
          <p className="text-xs font-sans text-brand-ivory/50 mt-1">
            Lay your planks to generate the quote.
          </p>
        </div>
        <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/15 text-center">
          <p className="text-xs font-mono text-brand-ivory/40">
            Quote will appear here once planks are laid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl text-brand-ivory uppercase tracking-wide">
          Installation Quote
        </h2>
        <p className="text-[10px] font-mono text-brand-ivory/40 mt-0.5">
          Based on {PLANK_LENGTH_MM}mm × {PLANK_WIDTH_MM}mm planks ·{" "}
          {PLANKS_PER_BOX} planks/box ({BOX_COVERAGE_SQM.toFixed(2)} m²/box)
        </p>
      </div>

      {/* Plank laying progress */}
      {(isAnimating || (total > 0 && laid < total)) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-brand-ivory/60">
            <span>Planks laid</span>
            <span className="text-brand-gold font-semibold">
              {laid.toLocaleString()} / {total.toLocaleString()}
            </span>
          </div>
          <div className="h-1 rounded-full bg-brand-navy overflow-hidden">
            <div
              className="h-full bg-brand-gold transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-brand-ivory/40 text-right">
            {progress}% complete
          </p>
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xs bg-brand-navy border border-brand-gold/20">
          <div className="text-2xl font-display text-brand-ivory font-light">
            {quote.totalAreaSqm.toFixed(1)}
          </div>
          <div className="text-[10px] font-mono text-brand-gold uppercase tracking-wider mt-0.5">
            m² Total Area
          </div>
        </div>
        <div className="p-4 rounded-xs bg-brand-gold/15 border border-brand-gold/40">
          <div className="text-2xl font-display text-brand-gold font-semibold">
            {quote.totalBoxes}
          </div>
          <div className="text-[10px] font-mono text-brand-ivory/70 uppercase tracking-wider mt-0.5">
            Boxes Needed
          </div>
        </div>
        <div className="p-4 rounded-xs bg-brand-navy border border-brand-gold/20">
          <div className="text-xl font-display text-brand-ivory font-light">
            {quote.totalFullPlanks.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-brand-gold uppercase tracking-wider mt-0.5">
            Full Planks
          </div>
        </div>
        <div className="p-4 rounded-xs bg-brand-navy border border-brand-gold/20">
          <div className="text-xl font-display text-brand-ivory font-light">
            {quote.totalCutPlanks.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-brand-gold uppercase tracking-wider mt-0.5">
            Cut Pieces
          </div>
        </div>
      </div>

      {/* Waste */}
      <div className="p-3 rounded-xs bg-brand-navy border border-brand-gold/15 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono text-brand-gold uppercase tracking-wider font-semibold">
            Wastage Factor
          </p>
          <p className="text-[10px] font-sans text-brand-ivory/50 mt-0.5">
            Includes cuts, breakage, and site variation
          </p>
        </div>
        <div className="text-xl font-display text-brand-ivory font-light shrink-0">
          {quote.avgWastePct.toFixed(1)}%
        </div>
      </div>

      {/* Per-room breakdown */}
      {quote.layouts.filter((l) => l.boxesNeeded > 0).length > 1 && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-semibold">
            Room Breakdown
          </p>
          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-luxury">
            {quote.layouts
              .filter((l) => l.boxesNeeded > 0)
              .map((l) => (
                <div
                  key={l.roomId}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xs bg-brand-navy border border-brand-gold/10"
                >
                  <div>
                    <span className="text-[10px] font-mono text-brand-ivory/80">
                      {l.areaSqm.toFixed(1)} m²
                    </span>
                    <span className="text-[9px] font-mono text-brand-ivory/40 ml-2">
                      {l.wastePercentage.toFixed(0)}% waste
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-gold font-semibold shrink-0">
                    {l.boxesNeeded} box{l.boxesNeeded !== 1 ? "es" : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] font-sans text-brand-ivory/35 leading-relaxed border-t border-brand-gold/10 pt-3">
        This estimate is based on the dimensions you entered. Final quantities
        are confirmed after the site survey. Pricing is provided separately by
        MarvelRise Decor.
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xs border border-brand-gold/30 hover:border-brand-gold text-brand-ivory/70 hover:text-brand-ivory text-xs font-mono uppercase tracking-widest transition-all duration-200"
        >
          <Share2 className="w-3.5 h-3.5" />
          {shareCode ? shareCode : "Save & Share"}
        </button>

        <button
          type="button"
          onClick={onWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 shadow-lg shadow-brand-gold/25"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Get Quote
        </button>
      </div>
    </div>
  );
}

