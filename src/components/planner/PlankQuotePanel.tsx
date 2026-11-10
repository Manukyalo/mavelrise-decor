"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PlankQuotePanel — Comprehensive Mixed-Product Architectural Estimate
// Computes live line items for SPC flooring, WPC panels, marble, lamps & decor.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import {
  Share2,
  MessageCircle,
  Sparkles,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import type { QuoteSummary, Room, QuoteLineItem } from "@/lib/planner/types";
import {
  BOX_COVERAGE_SQM,
} from "@/lib/planner/geometry";
import {
  getWpcByCode,
  getMarbleByCode,
  getLampByCode,
  getDecorByCode,
} from "@/lib/planner/pairings";
import { getColorById } from "@/lib/planner/colors";
import { calculateQuoteProposal } from "@/lib/planner/quoteEngine";

const SPC_PRICE_PER_SQM = 2400; // Benchmark KES per m² for 5.5mm/6mm click-lock

interface Props {
  quote: QuoteSummary | null;
  rooms: Room[];
  globalColorId: string;
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
  rooms,
  globalColorId,
  laid,
  total,
  isAnimating,
  shareCode,
  onShare,
}: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const progress = total > 0 ? Math.round((laid / total) * 100) : 0;
  const spcColor = getColorById(globalColorId);

  // Compute live multi-product line items from rooms state
  const lineItems = useMemo<QuoteLineItem[]>(() => {
    const items: QuoteLineItem[] = [];

    // 1. SPC Flooring Line Item
    if (quote && quote.totalAreaSqm > 0) {
      const spcTotal = Math.round(quote.totalAreaSqm * SPC_PRICE_PER_SQM);
      items.push({
        id: "line-spc-flooring",
        category: "spc",
        name: `SPC Click-Lock: ${spcColor.name}`,
        code: spcColor.code || "GJ6345-3",
        quantity: Math.round(quote.totalAreaSqm * 10) / 10,
        unit: "m²",
        unitPriceKes: SPC_PRICE_PER_SQM,
        totalPriceKes: spcTotal,
        details: `${quote.totalBoxes} boxes (${BOX_COVERAGE_SQM.toFixed(2)} m²/box, incl. ${quote.avgWastePct.toFixed(0)}% waste)`,
      });
    }

    // 2. WPC Wall Panels
    const wpcRooms = rooms.filter((r) => r.wallFinishType === "wpc" && r.wallFinishCode);
    const wpcCounts: Record<string, { sqm: number; rooms: string[] }> = {};
    wpcRooms.forEach((r) => {
      const code = r.wallFinishCode!;
      const area = Math.round(r.widthM * 2.8 * 10) / 10;
      if (!wpcCounts[code]) wpcCounts[code] = { sqm: 0, rooms: [] };
      wpcCounts[code].sqm += area;
      wpcCounts[code].rooms.push(r.name);
    });

    Object.entries(wpcCounts).forEach(([code, data]) => {
      const opt = getWpcByCode(code);
      const unitPrice = opt?.priceKesPerSqm || 2800;
      items.push({
        id: `line-wpc-${code}`,
        category: "wpc",
        name: `WPC Fluted Cladding: ${opt?.name || code}`,
        code,
        quantity: Math.round(data.sqm * 10) / 10,
        unit: "m²",
        unitPriceKes: unitPrice,
        totalPriceKes: Math.round(data.sqm * unitPrice),
        details: `Installed in: ${data.rooms.join(", ")}`,
      });
    });

    // 3. Marble Sheets
    const marbleRooms = rooms.filter((r) => r.wallFinishType === "marble" && r.wallFinishCode);
    const marbleCounts: Record<string, { sqm: number; rooms: string[] }> = {};
    marbleRooms.forEach((r) => {
      const code = r.wallFinishCode!;
      const area = Math.round(r.widthM * 2.8 * 10) / 10;
      if (!marbleCounts[code]) marbleCounts[code] = { sqm: 0, rooms: [] };
      marbleCounts[code].sqm += area;
      marbleCounts[code].rooms.push(r.name);
    });

    Object.entries(marbleCounts).forEach(([code, data]) => {
      const opt = getMarbleByCode(code);
      const unitPrice = opt?.priceKesPerSqm || 3200;
      items.push({
        id: `line-marble-${code}`,
        category: "marble",
        name: `UV Marble Sheet: ${opt?.name || code}`,
        code,
        quantity: Math.round(data.sqm * 10) / 10,
        unit: "m²",
        unitPriceKes: unitPrice,
        totalPriceKes: Math.round(data.sqm * unitPrice),
        details: `Installed in: ${data.rooms.join(", ")}`,
      });
    });

    // 4. MRDP Lampshades
    const lampRooms = rooms.filter((r) => r.lampCode);
    const lampCounts: Record<string, number> = {};
    lampRooms.forEach((r) => {
      const code = r.lampCode!;
      lampCounts[code] = (lampCounts[code] || 0) + 1;
    });

    Object.entries(lampCounts).forEach(([code, count]) => {
      const opt = getLampByCode(code);
      const unitPrice = opt?.priceKesPerPiece || 6500;
      items.push({
        id: `line-lamp-${code}`,
        category: "lamp",
        name: `Pendant Luminaire: ${opt?.name || code}`,
        code,
        quantity: count,
        unit: count === 1 ? "piece" : "pieces",
        unitPriceKes: unitPrice,
        totalPriceKes: count * unitPrice,
        details: `MRDP architectural pendant fixture`,
      });
    });

    // 5. Decor Accessories
    const decorRooms = rooms.filter((r) => r.decorCode);
    const decorCounts: Record<string, number> = {};
    decorRooms.forEach((r) => {
      const code = r.decorCode!;
      decorCounts[code] = (decorCounts[code] || 0) + 1;
    });

    Object.entries(decorCounts).forEach(([code, count]) => {
      const opt = getDecorByCode(code);
      const unitPrice = opt?.priceKesPerPiece || 3500;
      items.push({
        id: `line-decor-${code}`,
        category: "decor",
        name: `Tactile Accent: ${opt?.name || code}`,
        code,
        quantity: count,
        unit: count === 1 ? "piece" : "pieces",
        unitPriceKes: unitPrice,
        totalPriceKes: count * unitPrice,
        details: `Atelier curated styling object`,
      });
    });

    return items;
  }, [quote, rooms, spcColor]);

  // Grand Total in KES
  const grandTotalKes = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + item.totalPriceKes, 0);
  }, [lineItems]);

  // Generate & Navigate to Official Proposal Document
  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    try {
      const proposal = calculateQuoteProposal(rooms, "supply_only", 10);
      await fetch("/api/quote/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteNumber: proposal.quoteNumber,
          quoteData: proposal,
          supplyMode: proposal.supplyMode,
          totalKes: proposal.grandTotalKes,
        }),
      });

      router.push(`/quote/${proposal.quoteNumber}`);
    } catch (err) {
      console.error("[handleGenerateProposal] Error:", err);
      // Fallback direct navigate
      const randNum = `MRD-Q-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(`/quote/${randNum}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // WhatsApp Hand-off (Shop reserve message)
  const handleReserveWhatsApp = async () => {
    const proposal = calculateQuoteProposal(rooms, "supply_only", 10);
    const quoteUrl = typeof window !== "undefined"
      ? `${window.location.origin}/en/quote/${proposal.quoteNumber}`
      : `https://mavelrise-decor.vercel.app/en/quote/${proposal.quoteNumber}`;

    // Background persist
    fetch("/api/quote/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteNumber: proposal.quoteNumber,
        quoteData: proposal,
        supplyMode: proposal.supplyMode,
        totalKes: proposal.grandTotalKes,
      }),
    }).catch(() => {});

    let msg = `Hello MarvelRise Decor,\n\nI want to reserve my finishes quote:\n`;
    msg += `• Quote Ref: ${proposal.quoteNumber}\n`;
    msg += `• Total Rooms: ${rooms.length} (${proposal.metrics.totalGrossAreaSqm} m²)\n`;
    msg += `• Primary Floor: ${spcColor.name} (${spcColor.code || "GJ6345-3"})\n`;
    msg += `• Boxes Needed: ${proposal.metrics.totalBoxes} Boxes (incl. 10% wastage)\n`;
    msg += `• Estimated Total: KES ${grandTotalKes.toLocaleString()}\n`;
    msg += `• View Full Proposal: ${quoteUrl}\n\n`;
    msg += `Please confirm stock and book my free on-site survey in Nairobi.`;

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
    window.open(
      `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  // Send to Friend / Contractor
  const handleSendToFriend = () => {
    const proposal = calculateQuoteProposal(rooms, "supply_only", 10);
    const quoteUrl = typeof window !== "undefined"
      ? `${window.location.origin}/en/quote/${proposal.quoteNumber}`
      : `https://mavelrise-decor.vercel.app/en/quote/${proposal.quoteNumber}`;

    let msg = `Hi, here is our interior finishes estimate from MarvelRise Decor:\n`;
    msg += `• Quote No: ${proposal.quoteNumber}\n`;
    msg += `• Area: ${proposal.metrics.totalGrossAreaSqm} m² (${proposal.metrics.totalBoxes} boxes)\n`;
    msg += `• Total: KES ${grandTotalKes.toLocaleString()}\n`;
    msg += `Check out the complete specification here: ${quoteUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!quote) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl text-brand-ivory tracking-wide">
            Architectural Estimate
          </h2>
          <p className="text-xs text-brand-ivory/50 mt-1">
            Lay your planks to generate the live quote.
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Spatial Bill of Materials</span>
        </div>
        <h2 className="font-serif text-2xl text-brand-ivory font-medium mt-1">
          Architectural Estimate
        </h2>
        <p className="text-[10px] font-mono text-brand-ivory/40 mt-0.5">
          {rooms.length} Rooms Configured · Live Multi-Finish Breakdown
        </p>
      </div>

      {/* Grand Total Highlight Monolith */}
      <div className="p-4 rounded-sm bg-gradient-to-br from-[#121c2e] to-[#070d18] border border-amber-400/30 shadow-xl space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300/80">
          Total Estimated Investment
        </span>
        <div className="text-3xl font-serif text-white font-medium">
          KES {grandTotalKes.toLocaleString()}
        </div>
        <div className="text-[10px] font-mono text-white/40">
          Based on 10% wastage allowance &amp; benchmark atelier rates
        </div>
      </div>

      {/* Key Metrics Pill Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xs bg-black/40 border border-white/5">
          <span className="text-white/40 block text-[9px] uppercase">Net Area</span>
          <span className="text-white font-medium">{quote.totalAreaSqm.toFixed(1)} m²</span>
        </div>
        <div className="p-2.5 rounded-xs bg-black/40 border border-white/5">
          <span className="text-amber-300 block text-[9px] uppercase">Boxes (10% Waste)</span>
          <span className="text-amber-300 font-medium">{quote.totalBoxes} Boxes</span>
        </div>
      </div>

      {/* Selected Line Items Preview */}
      <div className="space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
          Configured Finishing Specifications ({lineItems.length} lines)
        </span>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-luxury">
          {lineItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xs bg-[#050a14] border border-white/5 space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-serif text-white font-medium block">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300/80">
                    Code: {item.code}
                  </span>
                </div>
                <span className="text-xs font-mono text-white font-semibold whitespace-nowrap">
                  KES {item.totalPriceKes.toLocaleString()}
                </span>
              </div>
              <div className="text-[10px] font-mono text-white/40">
                {item.quantity} {item.unit} @ KES {item.unitPriceKes.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Actions (Phase 6 Specifications) */}
      <div className="space-y-2.5 pt-2 border-t border-white/10">
        {/* 1. Official Proposal Document Button */}
        <button
          type="button"
          onClick={handleGenerateProposal}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xs border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-xs uppercase tracking-widest font-semibold transition-all"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>View &amp; Print Official Proposal (PDF)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* 2. Reserve this Quote on WhatsApp */}
        <button
          type="button"
          onClick={handleReserveWhatsApp}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xs bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-xl shadow-amber-400/20"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Reserve this Quote on WhatsApp</span>
        </button>

        {/* 3. Send to a Friend or Contractor */}
        <button
          type="button"
          onClick={handleSendToFriend}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xs border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
        >
          <Send className="w-3.5 h-3.5 text-amber-400" />
          <span>Send to a Friend or Contractor</span>
        </button>
      </div>

      <p className="text-[10px] font-mono text-white/35 leading-relaxed">
        *7-day price guarantee. Final quote confirmed during the MarvelRise site consultation in Nairobi.
      </p>
    </div>
  );
}
