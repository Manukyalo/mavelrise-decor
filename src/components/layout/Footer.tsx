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
    <footer id="contact" className="relative bg-brand-black border-t border-white/10 text-brand-sand-300 pt-20 pb-12 overflow-hidden">
      {/* Background Architectural Watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.03] select-none text-[18vw] font-display font-bold leading-none text-brand-white">
        MRD
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Manifesto (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-brand-black-elevated border border-brand-orange/40">
                <svg viewBox="0 0 40 40" className="w-6 h-6 stroke-brand-white fill-none">
                  <path d="M 20 4 L 36 20 L 20 36 L 4 20 Z" strokeWidth="1.2" className="stroke-brand-orange/50" />
                  <path d="M 11 26 L 11 14 L 16 21 L 20 14 L 24 21 L 29 14 L 29 26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="14" r="1.5" className="fill-brand-orange stroke-none" />
                </svg>
              </div>
              <div>
                <span className="font-display text-2xl tracking-[0.16em] text-brand-white uppercase block leading-tight">
                  {brandT("name")}
                </span>
                <span className="text-[10px] font-mono tracking-[0.25em] text-brand-sand-400 uppercase">
                  {brandT("tagline")}
                </span>
              </div>
            </div>

            <p className="text-sm font-sans text-brand-sand-400 leading-relaxed max-w-sm">
              {t("tagline")}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-[11px] font-mono tracking-wider text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                <span>NCA Certified Finishers</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-[11px] font-mono tracking-wider text-brand-orange">
                <Compass className="w-3.5 h-3.5" />
                <span>Precision Joinery</span>
              </span>
            </div>
          </div>

          {/* Column 2: Architectural Services (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-brand-white">
              {navT("collections")}
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <a href="#ceilings" className="hover:text-brand-orange transition-colors">
                  {navT("ceilings")}
                </a>
              </li>
              <li>
                <a href="#wall-panels" className="hover:text-brand-orange transition-colors">
                  {navT("wallPanels")}
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-brand-orange transition-colors">
                  {navT("projects")}
                </a>
              </li>
              <li>
                <a href="#custom" className="hover:text-brand-orange transition-colors">
                  {navT("custom")}
                </a>
              </li>
              <li>
                <a href="#studio" className="hover:text-brand-orange transition-colors">
                  {navT("about")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Showroom & Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-brand-white">
              {t("showroomTitle")}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p className="text-brand-sand-200">{t("showroomId")}</p>
                  <p className="text-brand-sand-400 text-xs mt-0.5">{t("city")}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-mono tracking-wider text-brand-orange hover:text-white uppercase transition-colors"
                  >
                    <span>{t("viewOnMaps")}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                <Clock className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-brand-sand-400">
                  <p>{t("hoursWeekdays")}</p>
                  <p>{t("hoursSaturday")}</p>
                  <p className="text-brand-sand-500">{t("hoursSunday")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Direct Channels (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-brand-white">
              {t("contactTitle")}
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${showroomPhone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 hover:text-brand-white transition-colors group"
              >
                <div className="p-2 rounded-sm bg-brand-black-elevated border border-white/10 group-hover:border-brand-orange/40">
                  <Phone className="w-3.5 h-3.5 text-brand-orange" />
                </div>
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-brand-sand-400 uppercase block">
                    Showroom Desk
                  </span>
                  <span className="font-mono text-sm text-brand-sand-200">{showroomPhone}</span>
                </div>
              </a>

              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-2.5 hover:text-brand-white transition-colors group"
              >
                <div className="p-2 rounded-sm bg-brand-black-elevated border border-white/10 group-hover:border-brand-orange/40">
                  <Mail className="w-3.5 h-3.5 text-brand-orange" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-mono tracking-wider text-brand-sand-400 uppercase block">
                    Technical Inquiries
                  </span>
                  <span className="font-mono text-xs text-brand-sand-200 truncate block">
                    {supportEmail}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-brand-black-muted">
          <p>© {new Date().getFullYear()} {brandT("name")}. {t("rights")}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-brand-sand-300 transition-colors">
              {t("privacy")}
            </a>
            <span className="text-white/10">•</span>
            <a href="#" className="hover:text-brand-sand-300 transition-colors">
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

