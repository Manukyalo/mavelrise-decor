"use client";

import React, { useState } from "react";
import { QrCode, Download, Printer, ExternalLink, Sparkles } from "lucide-react";

interface PlannerQrCodeProps {
  url?: string;
  size?: number;
  label?: string;
}

export function PlannerQrCode({
  url = "https://mavelrise-decor.vercel.app/en/planner",
  size = 200,
  label = "Scan with your phone to dress your room in 3D",
}: PlannerQrCodeProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=C8A15A&bgcolor=03060B&data=${encodeURIComponent(
    url
  )}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/30 shadow-2xl text-center max-w-sm mx-auto space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[10px] font-mono uppercase tracking-widest text-brand-gold">
          <Sparkles className="w-3 h-3" />
          <span>Showroom Counter QR</span>
        </div>
        <h4 className="font-display text-lg text-brand-ivory font-medium uppercase tracking-wider">
          3D Interactive Visualizer
        </h4>
        <p className="text-xs font-sans text-brand-ivory/60">
          {label}
        </p>
      </div>

      {/* QR Code Container */}
      <div className="p-4 bg-brand-navy rounded-sm border border-brand-gold/25 inline-block mx-auto shadow-inner">
        <img
          src={qrUrl}
          alt="QR Code for MarvelRise Decor 3D Room Planner"
          width={size}
          height={size}
          className="rounded-xs mx-auto"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-brand-gold/30 hover:border-brand-gold text-brand-gold text-xs font-mono uppercase tracking-wider transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Standee</span>
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs font-mono uppercase tracking-wider transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Link</span>
        </a>
      </div>
    </div>
  );
}

