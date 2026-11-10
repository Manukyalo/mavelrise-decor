"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DetailedQuoteProposal, SupplyMode, calculateQuoteProposal } from "@/lib/planner/quoteEngine";
import {
  Printer,
  Share2,
  MessageCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Layers,
  Building,
  Sparkles,
  Download,
  Send,
  PhoneCall,
  Calendar,
  ShieldCheck,
  Compass,
} from "lucide-react";

interface ProposalDocumentViewProps {
  initialProposal: DetailedQuoteProposal;
  locale: string;
}

export function ProposalDocumentView({
  initialProposal,
  locale,
}: ProposalDocumentViewProps) {
  const [supplyMode, setSupplyMode] = useState<SupplyMode>(initialProposal.supplyMode);
  const [copiedLink, setCopiedLink] = useState(false);

  // Recalculate if supply mode is toggled by user
  const proposal = React.useMemo(() => {
    if (supplyMode === initialProposal.supplyMode) return initialProposal;
    // Derive rooms from initial proposal
    const dummyRooms = initialProposal.rooms.map((r) => ({
      id: r.roomId,
      name: r.roomName,
      type: "living" as const,
      widthM: r.widthM,
      lengthM: r.lengthM,
      gridX: 0,
      gridY: 0,
      colorId: r.floorColorCode,
      plankDirection: "lengthwise" as const,
      hasFlooring: true,
      wallFinishType: r.wallType,
      wallFinishCode: r.wallCode,
      lampCode: r.lampCode,
      lampLightOn: true,
      decorCode: r.decorCode,
    }));
    return calculateQuoteProposal(dummyRooms, supplyMode, initialProposal.wastagePct, initialProposal.quoteNumber);
  }, [supplyMode, initialProposal]);

  const shopPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254719113343";
  const cleanPhone = shopPhone.replace(/[^0-9]/g, "");

  // Unique quote link
  const quoteUrl = typeof window !== "undefined" ? window.location.href : `https://mavelrise-decor.vercel.app/${locale}/quote/${proposal.quoteNumber}`;

  // 1. WhatsApp handoff to MarvelRise shop
  const shopMessage = encodeURIComponent(
    `Hello MarvelRise Decor,\n\n` +
    `I would like to reserve my architectural finishes proposal:\n` +
    `• Quote Ref: ${proposal.quoteNumber}\n` +
    `• Total Area: ${proposal.metrics.totalGrossAreaSqm} m² (${proposal.metrics.totalBoxes} boxes)\n` +
    `• Package: ${supplyMode === "supply_and_fit" ? "Supply & Fit (Turnkey)" : "Supply Only"}\n` +
    `• Total Investment: KES ${proposal.grandTotalKes.toLocaleString()}\n` +
    `• Full Proposal Link: ${quoteUrl}\n\n` +
    `Please confirm material stock at Ruiru Membley and schedule our site inspection.`
  );
  const shopWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${shopMessage}`;

  // 2. WhatsApp message to send to friend / contractor
  const contractorMessage = encodeURIComponent(
    `Hi, here is our interior finishes proposal from MarvelRise Decor:\n` +
    `• Ref: ${proposal.quoteNumber}\n` +
    `• Area: ${proposal.metrics.totalGrossAreaSqm} m² (${proposal.metrics.totalBoxes} boxes)\n` +
    `• Estimated Total: KES ${proposal.grandTotalKes.toLocaleString()}\n` +
    `View the full specification and room breakdown here: ${quoteUrl}`
  );
  const contractorWhatsAppUrl = `https://wa.me/?text=${contractorMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quoteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0 print:space-y-4">
      {/* Action Navigation Bar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-sm bg-[#060c18] border border-amber-500/20 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/planner`}
            className="px-3.5 py-1.5 rounded-xs border border-white/10 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Return to 3D Planner</span>
          </Link>
          <span className="text-white/20 text-xs font-mono">|</span>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Quote Verified &amp; Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xs border border-white/20 hover:border-amber-400 text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xs border border-white/20 hover:border-amber-400 text-white text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Proposal (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Document Paper Container */}
      <div className="bg-[#040812] border border-amber-500/30 shadow-2xl rounded-sm p-6 sm:p-12 space-y-10 print:border-none print:shadow-none print:bg-white print:text-black print:p-0">
        {/* Letterhead & Atelier Insignia */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-amber-500/20 pb-8 print:border-black/20">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white print:text-black">
                MARVELRISE DECOR
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 print:border-black/30 print:text-black">
                MRD ATELIER
              </span>
            </div>
            <p className="text-xs font-mono text-white/50 print:text-black/60 tracking-wider uppercase">
              Architectural Finishes &amp; Spatial Fit-Outs
            </p>
            <div className="text-xs text-white/60 print:text-black/70 font-mono space-y-0.5 pt-1">
              <div>Ruiru Membley, Opposite NattyGym · Nairobi, Kenya</div>
              <div>Tel: +254 719 113 343 / +254 721 605 779</div>
              <div>Email: concierge@marvelrisedecor.co.ke</div>
            </div>
          </div>

          {/* Quote Identifier Card */}
          <div className="p-4 rounded-xs bg-[#070e1c] border border-white/10 space-y-2 sm:text-right print:bg-gray-100 print:border-black/10">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-medium">
              Architectural Proposal
            </span>
            <div className="text-xl font-mono text-white print:text-black font-semibold">
              {proposal.quoteNumber}
            </div>
            <div className="text-[11px] font-mono text-white/60 print:text-black/60 space-y-1">
              <div className="flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Date: {new Date(proposal.createdAt).toLocaleDateString("en-GB")}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5 text-amber-300 print:text-amber-700">
                <Clock className="w-3 h-3" />
                <span>Valid for {proposal.validityDays} Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Package Mode Toggle Switcher (Supply Only vs Supply & Fit) */}
        <div className="p-4 rounded-sm bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-semibold block">
              Installation &amp; Scope Mode
            </span>
            <p className="text-xs text-white/60">
              Toggle between supply of materials only or full turnkey installation by certified MarvelRise fitters.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xs bg-[#070e1c] border border-white/10 shrink-0">
            <button
              onClick={() => setSupplyMode("supply_only")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${supplyMode === "supply_only"
                  ? "bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/20"
                  : "text-white/60 hover:text-white"
                }`}
            >
              Supply Only
            </button>
            <button
              onClick={() => setSupplyMode("supply_and_fit")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${supplyMode === "supply_and_fit"
                  ? "bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/20"
                  : "text-white/60 hover:text-white"
                }`}
            >
              Supply &amp; Fit (Turnkey)
            </button>
          </div>
        </div>

        {/* Key Architectural Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xs bg-[#070e1a] border border-white/10 print:border-black/20 print:bg-gray-50">
            <span className="text-[10px] font-mono text-white/40 uppercase block">Net Spatial Area</span>
            <div className="text-2xl font-serif text-white print:text-black mt-1 font-medium">
              {proposal.metrics.totalNetAreaSqm.toFixed(1)} m²
            </div>
          </div>
          <div className="p-4 rounded-xs bg-[#070e1a] border border-white/10 print:border-black/20 print:bg-gray-50">
            <span className="text-[10px] font-mono text-amber-300 uppercase block">Gross (+10% Wastage)</span>
            <div className="text-2xl font-serif text-amber-300 print:text-amber-800 mt-1 font-medium">
              {proposal.metrics.totalGrossAreaSqm.toFixed(1)} m²
            </div>
          </div>
          <div className="p-4 rounded-xs bg-[#070e1a] border border-white/10 print:border-black/20 print:bg-gray-50">
            <span className="text-[10px] font-mono text-white/40 uppercase block">Boxes Required</span>
            <div className="text-2xl font-serif text-white print:text-black mt-1 font-medium">
              {proposal.metrics.totalBoxes} Boxes
            </div>
            <span className="text-[9px] font-mono text-white/40 block mt-0.5">2.197 m² / box</span>
          </div>
          <div className="p-4 rounded-xs bg-[#070e1a] border border-white/10 print:border-black/20 print:bg-gray-50">
            <span className="text-[10px] font-mono text-white/40 uppercase block">Perimeter Skirting</span>
            <div className="text-2xl font-serif text-white print:text-black mt-1 font-medium">
              {proposal.metrics.totalPerimeterM.toFixed(1)} m
            </div>
          </div>
        </div>

        {/* Itemised Schedule of Rates Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 print:border-black/20">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 print:text-black font-semibold">
              Itemised Finishes Schedule
            </span>
            <span className="text-[10px] font-mono text-white/50 print:text-black/50">
              All amounts in Kenya Shillings (KES)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 print:border-black/20 print:text-black/60 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 pr-4">Description &amp; Specification</th>
                  <th className="py-2.5 px-3">Room / Side</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (KES)</th>
                  <th className="py-2.5 pl-3 text-right">Total (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-black/10">
                {/* 1. Flooring Line Item */}
                <tr>
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-white print:text-black block">
                      SPC Click-Lock Flooring ({proposal.rooms[0]?.floorColorName || "Natural French Oak"})
                    </span>
                    <span className="text-[10px] text-white/40 print:text-black/50 block">
                      Code: {proposal.rooms[0]?.floorColorCode || "GJ6345-3"} · 1220×183mm · {proposal.metrics.totalBoxes} Boxes
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white/70 print:text-black/70">
                    All {proposal.rooms.length} Rooms
                  </td>
                  <td className="py-3 px-3 text-right text-white print:text-black">
                    {proposal.metrics.totalGrossAreaSqm.toFixed(1)} m²
                  </td>
                  <td className="py-3 px-3 text-right text-white/70 print:text-black/70">
                    2,400.00
                  </td>
                  <td className="py-3 pl-3 text-right font-medium text-white print:text-black">
                    {proposal.breakdown.flooringTotalKes.toLocaleString()}.00
                  </td>
                </tr>

                {/* 2. WPC Wall Panels */}
                {proposal.breakdown.wallsTotalKes > 0 && (
                  <tr>
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-white print:text-black block">
                        WPC Acoustic Fluted Wall Cladding
                      </span>
                      <span className="text-[10px] text-white/40 print:text-black/50 block">
                        Interlocking tongue-and-groove vertical fluting (NRC 0.65)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white/70 print:text-black/70">
                      Feature Walls
                    </td>
                    <td className="py-3 px-3 text-right text-white print:text-black">
                      {proposal.rooms.reduce((s, r) => s + (r.wallType === "wpc" ? r.wallAreaSqm : 0), 0).toFixed(1)} m²
                    </td>
                    <td className="py-3 px-3 text-right text-white/70 print:text-black/70">
                      2,800.00
                    </td>
                    <td className="py-3 pl-3 text-right font-medium text-white print:text-black">
                      {proposal.breakdown.wallsTotalKes.toLocaleString()}.00
                    </td>
                  </tr>
                )}

                {/* 3. UV Marble Sheets */}
                {proposal.breakdown.marbleTotalKes > 0 && (
                  <tr>
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-white print:text-black block">
                        UV Marble High-Gloss Cladding Slabs
                      </span>
                      <span className="text-[10px] text-white/40 print:text-black/50 block">
                        Mirror-gloss veined marble monolithic surface
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white/70 print:text-black/70">
                      Accent Walls
                    </td>
                    <td className="py-3 px-3 text-right text-white print:text-black">
                      {proposal.rooms.reduce((s, r) => s + (r.wallType === "marble" ? r.wallAreaSqm : 0), 0).toFixed(1)} m²
                    </td>
                    <td className="py-3 px-3 text-right text-white/70 print:text-black/70">
                      3,200.00
                    </td>
                    <td className="py-3 pl-3 text-right font-medium text-white print:text-black">
                      {proposal.breakdown.marbleTotalKes.toLocaleString()}.00
                    </td>
                  </tr>
                )}

                {/* 4. MRDP Luminaires */}
                {proposal.breakdown.lampsTotalKes > 0 && (
                  <tr>
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-white print:text-black block">
                        MRDP Artisanal Pendant Luminaires
                      </span>
                      <span className="text-[10px] text-white/40 print:text-black/50 block">
                        Sculptural polyester &amp; woven rattan ceiling fixtures (E27)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white/70 print:text-black/70">
                      Ceilings
                    </td>
                    <td className="py-3 px-3 text-right text-white print:text-black">
                      {proposal.rooms.filter((r) => r.lampCode).length} units
                    </td>
                    <td className="py-3 px-3 text-right text-white/70 print:text-black/70">
                      Various
                    </td>
                    <td className="py-3 pl-3 text-right font-medium text-white print:text-black">
                      {proposal.breakdown.lampsTotalKes.toLocaleString()}.00
                    </td>
                  </tr>
                )}

                {/* 5. Decor Layer */}
                {proposal.breakdown.decorTotalKes > 0 && (
                  <tr>
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-white print:text-black block">
                        Curated Tactile Decor Objects
                      </span>
                      <span className="text-[10px] text-white/40 print:text-black/50 block">
                        Handcrafted vessels, bronze sculptures &amp; travertine sets
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white/70 print:text-black/70">
                      Atelier Objects
                    </td>
                    <td className="py-3 px-3 text-right text-white print:text-black">
                      {proposal.rooms.filter((r) => r.decorCode).length} units
                    </td>
                    <td className="py-3 px-3 text-right text-white/70 print:text-black/70">
                      Various
                    </td>
                    <td className="py-3 pl-3 text-right font-medium text-white print:text-black">
                      {proposal.breakdown.decorTotalKes.toLocaleString()}.00
                    </td>
                  </tr>
                )}

                {/* 6. Underlay */}
                <tr>
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-white print:text-black block">
                      1.5mm Acoustic IXPE Underlay Membrane
                    </span>
                    <span className="text-[10px] text-white/40 print:text-black/50 block">
                      Vapor barrier + acoustic dampening underlay
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white/70 print:text-black/70">Subfloor</td>
                  <td className="py-3 px-3 text-right text-white print:text-black">
                    {proposal.metrics.totalGrossAreaSqm.toFixed(1)} m²
                  </td>
                  <td className="py-3 px-3 text-right text-white/70 print:text-black/70">250.00</td>
                  <td className="py-3 pl-3 text-right font-medium text-white print:text-black">
                    {proposal.breakdown.underlayTotalKes.toLocaleString()}.00
                  </td>
                </tr>

                {/* 7. Skirting */}
                <tr>
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-white print:text-black block">
                      Waterproof Architectural Skirting (80mm)
                    </span>
                    <span className="text-[10px] text-white/40 print:text-black/50 block">
                      Color-matched composite perimeter trim
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white/70 print:text-black/70">Perimeter</td>
                  <td className="py-3 px-3 text-right text-white print:text-black">
                    {proposal.metrics.totalPerimeterM.toFixed(1)} m
                  </td>
                  <td className="py-3 px-3 text-right text-white/70 print:text-black/70">480.00</td>
                  <td className="py-3 pl-3 text-right font-medium text-white print:text-black">
                    {proposal.breakdown.skirtingTotalKes.toLocaleString()}.00
                  </td>
                </tr>

                {/* 8. Doorway Trims */}
                <tr>
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-white print:text-black block">
                      Aluminium T-Moulding &amp; Reducer Profiles
                    </span>
                    <span className="text-[10px] text-white/40 print:text-black/50 block">
                      Anodized brass door transition profiles
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white/70 print:text-black/70">Thresholds</td>
                  <td className="py-3 px-3 text-right text-white print:text-black">
                    {proposal.rooms.length} pcs
                  </td>
                  <td className="py-3 px-3 text-right text-white/70 print:text-black/70">850.00</td>
                  <td className="py-3 pl-3 text-right font-medium text-white print:text-black">
                    {proposal.breakdown.trimsTotalKes.toLocaleString()}.00
                  </td>
                </tr>

                {/* 9. Installation (if Supply & Fit) */}
                {proposal.supplyMode === "supply_and_fit" && (
                  <tr className="bg-amber-500/5 print:bg-gray-100">
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-amber-300 print:text-black block">
                        Turnkey Certified Installation &amp; Fit-Out
                      </span>
                      <span className="text-[10px] text-amber-200/60 print:text-black/50 block">
                        Laser levelling, subfloor prep &amp; click-lock alignment by MarvelRise artisans
                      </span>
                    </td>
                    <td className="py-3 px-3 text-amber-200/80 print:text-black">Turnkey Labour</td>
                    <td className="py-3 px-3 text-right text-amber-300 print:text-black">
                      Complete
                    </td>
                    <td className="py-3 px-3 text-right text-amber-200/80 print:text-black">Scope</td>
                    <td className="py-3 pl-3 text-right font-semibold text-amber-300 print:text-black">
                      {proposal.breakdown.installationTotalKes.toLocaleString()}.00
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grand Total Summary Monolith */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-xs bg-[#060c18] border border-amber-500/30 print:border-black/30 print:bg-gray-50">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 print:text-black font-semibold">
              Total Proposed Investment
            </span>
            <div className="text-sm font-mono text-white/60 print:text-black/60">
              {proposal.supplyMode === "supply_and_fit"
                ? "Includes all materials, hardware, and certified fitting"
                : "Materials supply and site delivery"}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-white/40 block print:text-black/50">KES (Kenyan Shillings)</span>
            <div className="text-3xl sm:text-4xl font-serif text-white print:text-black font-medium tracking-tight">
              KSh {proposal.grandTotalKes.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Advisory Terms & Conditions */}
        <div className="space-y-2 text-[11px] font-mono text-white/40 print:text-black/60 border-t border-white/10 print:border-black/20 pt-6">
          <div className="text-white/60 print:text-black/80 font-medium uppercase tracking-wider">
            Important Tender &amp; Execution Notes:
          </div>
          <p>
            1. This quotation is an initial architectural estimate based on client-provided dimensions. Final quantities and subfloor leveling requirements will be verified during the on-site survey.
          </p>
          <p>
            2. Prices are valid for 7 calendar days from issuance. Stock allocation is secured upon confirmation of the site consultation.
          </p>
          <p>
            3. MarvelRise Decor provides a 10-year manufacturer warranty on all commercial-grade SPC flooring and 5 years on WPC fluted wall panels.
          </p>
        </div>

        {/* CTAs Bar (Hidden in Print) */}
        <div className="space-y-4 pt-6 border-t border-white/10 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary CTA: Reserve Quote on WhatsApp */}
            <a
              href={shopWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-xs bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-amber-400/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reserve this Quote on WhatsApp</span>
            </a>

            {/* Secondary CTA: Send to Friend / Contractor */}
            <a
              href={contractorWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-xs bg-[#0b1526] hover:bg-[#101e36] border border-amber-500/30 text-white font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-all"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Send to Friend or Contractor</span>
            </a>
          </div>

          <div className="text-center">
            <span className="text-[11px] font-mono text-white/40">
              Prefer a direct consultation? Call our Ruiru showroom directly at{" "}
              <a href="tel:+254719113343" className="text-amber-300 hover:underline">
                +254 719 113 343
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

