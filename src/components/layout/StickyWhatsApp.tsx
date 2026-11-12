"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { MessageSquare, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function StickyWhatsApp() {
  const pathname = usePathname();
  const t = useTranslations("whatsapp");
  const [isHovered, setIsHovered] = useState(false);

  // Absolute guarantee: never render floating customer WhatsApp button inside admin portal
  if (pathname?.includes("/admin")) {
    return null;
  }

  // Read environment variable or fallback to verified Nairobi WhatsApp line
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678";
  const prefillMessage = encodeURIComponent(t("prefill"));
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefillMessage}`;

  return (
    <aside
      aria-label="Direct Showroom WhatsApp Support"
      className="fixed bottom-6 right-6 z-40 flex items-end gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanded Luxury Preview Card on Hover / Desktop */}
      <div
        className={cn(
          "hidden sm:flex flex-col gap-1 p-3.5 rounded-lg glass-panel border border-brand-gold/30 shadow-2xl transition-all duration-300 transform origin-bottom-right",
          isHovered
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
          </span>
          <span className="text-[11px] font-mono tracking-wider text-brand-ivory uppercase font-bold">
            {t("status")}
          </span>
        </div>
        <p className="text-xs text-brand-ivory/70 font-sans max-w-[210px] leading-snug">
          Connect directly with our architectural finishes estimator.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-[11px] font-mono tracking-wider text-brand-gold hover:text-brand-gold-light uppercase flex items-center gap-1 transition-colors font-bold"
        >
          <span>{t("chatAction")}</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Main Sticky WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly with MarvelRise Decor on WhatsApp"
        className="group relative flex items-center justify-center w-13 h-13 p-3.5 rounded-full bg-brand-green hover:bg-brand-green-subtle text-brand-white border border-emerald-400/30 shadow-xl shadow-brand-green/30 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-brand-black"
      >
        {/* Pulsing Beacon Glow */}
        <span className="absolute -inset-1 rounded-full bg-brand-green/40 blur-sm group-hover:bg-brand-green/60 transition-all duration-300 -z-10" />

        {/* WhatsApp Brand Icon & Live Status Dot */}
        <div className="relative">
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
        </div>
      </a>
    </aside>
  );
}

