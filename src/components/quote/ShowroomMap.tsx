"use client";

import React from "react";
import { MapPin, Navigation, Phone, Clock, ExternalLink } from "lucide-react";
import { t } from "@/lib/i18n/client";

interface ShowroomMapProps {
  locale?: string;
}

export function ShowroomMap({ locale = "en" }: ShowroomMapProps) {
  const shopLat = -1.1492;
  const shopLng = 36.9624;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shopLat},${shopLng}`;

  return (
    <div className="space-y-4 print:hidden">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
            {t(locale, "delivery.showroomTitle")}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
            Ruiru Membley Showroom &amp; Depository
          </h3>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono uppercase tracking-wider transition-all"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{t(locale, "delivery.getDirections")}</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>

      {/* Map container with architectural dark frame */}
      <div className="relative rounded-sm overflow-hidden border border-amber-500/20 bg-[#040812] shadow-2xl">
        <div className="relative w-full h-[280px] sm:h-[340px]">
          <iframe
            title="MarvelRise Ruiru Membley Showroom"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${shopLng - 0.015}%2C${shopLat - 0.012}%2C${shopLng + 0.015}%2C${shopLat + 0.012}&layer=mapnik&marker=${shopLat}%2C${shopLng}`}
            className="w-full h-full border-0 filter contrast-125 brightness-90 saturate-75 opacity-80 hover:opacity-100 transition-opacity"
            loading="lazy"
          />

          {/* Luxury ambient gradient overlay to integrate with brand aesthetic */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040812] via-transparent to-transparent opacity-75" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>

        {/* Floating Atelier Coordinates Badge */}
        <div className="p-4 bg-[#060c18]/95 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-300">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">{t(locale, "delivery.showroomAddress")}</span>
            </div>
            <div className="flex items-center gap-4 text-white/50 text-[11px] pl-5.5">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-white/40" />
                <span>{t(locale, "delivery.showroomHours")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-white/40" />
                <a href="tel:+254719113343" className="hover:text-amber-300 underline-offset-2 hover:underline">
                  +254 719 113 343
                </a>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] tracking-wider uppercase font-semibold">
              Live Stock Depot
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

