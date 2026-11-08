"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck, Compass } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const brandT = useTranslations("brand");
  const navT = useTranslations("navigation");

  const showroomPhone = process.env.NEXT_PUBLIC_SHOWROOM_PHONE || "+254 700 000 000";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "concierge@marvelrisedecor.co.ke";
  const mapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "https://maps.google.com/?q=Nairobi+Kenya";

  return (
    <footer id="contact" className="relative bg-brand-navy-deep border-t border-brand-gold/20 text-brand-ivory/80 pt-20 pb-12 overflow-hidden">
      {/* Background Architectural Watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.03] select-none text-[18vw] font-display font-bold leading-none text-brand-gold">
        MRD
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-brand-gold/15">
          {/* Column 1: Brand & Manifesto (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-brand-navy-elevated border border-brand-gold/40">
                <svg viewBox="0 0 40 40" className="w-6 h-6 stroke-brand-ivory fill-none">
                  <path d="M 20 4 L 36 20 L 20 36 L 4 20 Z" strokeWidth="1.2" className="stroke-brand-gold/50" />
                  <path d="M 11 26 L 11 14 L 16 21 L 20 14 L 24 21 L 29 14 L 29 26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Official Logo Orange Accent */}
                  <circle cx="20" cy="14" r="1.5" className="fill-[#F25C05] stroke-none" />
                </svg>
              </div>
              <div>
                <span className="font-display text-2xl tracking-[0.16em] text-brand-ivory uppercase block leading-tight">
                  {brandT("name")}
                </span>
                <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase">
                  {brandT("tagline")}
                </span>
              </div>
            </div>

            <p className="text-sm font-sans text-brand-ivory/70 leading-relaxed max-w-sm">
              {t("tagline")}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[11px] font-mono tracking-wider text-brand-gold">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                <span>NCA Certified Finishers</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy-card border border-brand-gold/25 text-[11px] font-mono tracking-wider text-brand-gold">
                <Compass className="w-3.5 h-3.5" />
                <span>Precision Joinery</span>
              </span>
            </div>
          </div>

          {/* Column 2: Architectural Services (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-brand-gold">
              {navT("collections")}
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <a href="#ceilings" className="hover:text-brand-gold transition-colors">
                  {navT("ceilings")}
                </a>
              </li>
              <li>
                <a href="#wall-panels" className="hover:text-brand-gold transition-colors">
                  {navT("wallPanels")}
                </a>
              </li>
              <li>
                <Link href="/projects" className="hover:text-brand-gold transition-colors">
                  {navT("projects")}
                </Link>
              </li>
              <li>
                <a href="#custom" className="hover:text-brand-gold transition-colors">
                  {navT("custom")}
                </a>
              </li>
              <li>
                <a href="#studio" className="hover:text-brand-gold transition-colors">
                  {navT("about")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Showroom & Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-brand-gold">
              {t("showroomTitle")}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-ivory">{t("showroomId")}</p>
                  <p className="text-brand-ivory/60 text-xs mt-0.5">{t("city")}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-mono tracking-wider text-brand-gold hover:text-brand-gold-light uppercase transition-colors"
                  >
                    <span>{t("viewOnMaps")}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-brand-gold/10">
                <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <p className="text-xs text-brand-ivory/70 leading-relaxed">
                  {t("hours")}
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: Direct Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-brand-gold">
              {t("contactTitle")}
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${showroomPhone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 text-brand-ivory/80 hover:text-brand-gold transition-colors group"
              >
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>{showroomPhone}</span>
              </a>

              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-2.5 text-brand-ivory/80 hover:text-brand-gold transition-colors group"
              >
                <Mail className="w-4 h-4 text-brand-gold" />
                <span className="truncate">{supportEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-brand-ivory/50">
          <div>
            © {new Date().getFullYear()} MarvelRise Decor Atelier Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Nairobi Atelier</span>
            <span>•</span>
            <span>East Africa Operations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
