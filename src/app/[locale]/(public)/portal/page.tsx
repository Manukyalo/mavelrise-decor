import React from "react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/auth/actions";
import {
  FolderKanban,
  FileText,
  Clock,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

interface PortalPageProps {
  params: {
    locale: string;
  };
}

export default async function ClientPortalPage({ params: { locale } }: PortalPageProps) {
  const t = await getTranslations("portal");

  let user = null;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error("Portal server auth error:", err);
    user = null;
  }

  // If unauthenticated, redirect to login
  if (!user) {
    redirect(`/${locale}/auth/login?next=/${locale}/portal`);
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Architectural Partner";

  const handleSignOut = signOutAction.bind(null, locale);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-brand-navy bg-noise relative text-brand-ivory">
      {/* Background Ambience in Champagne Gold */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] rounded-full bg-brand-gold/10 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 space-y-10">
        {/* Top Portal Banner */}
        <Reveal direction="down" distance={15}>
          <div className="p-6 sm:p-8 rounded-sm bg-brand-navy-card border border-brand-gold/25 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-brand-ivory uppercase font-light">
                {t("title")}
              </h1>
              <p className="text-xs sm:text-sm font-sans text-brand-ivory/70">
                {t("welcome")}:{" "}
                <span className="text-brand-gold font-mono font-bold">
                  {fullName}
                </span>{" "}
                ({user.email})
              </p>
            </div>

            {/* Sign Out Action */}
            <form action={handleSignOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-brand-navy hover:bg-red-950/40 text-brand-ivory/70 hover:text-red-400 border border-brand-gold/20 hover:border-red-500/30 text-xs font-mono uppercase tracking-widest transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("signOut")}</span>
              </button>
            </form>
          </div>
        </Reveal>

        {/* Project Metrics Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-brand-gold font-bold">
              <span>{t("activeCommissions")}</span>
              <FolderKanban className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="text-3xl font-display font-light text-brand-ivory">01</div>
            <div className="text-[11px] font-sans text-brand-ivory/60">Westlands Penthouse Suite</div>
          </div>

          <div className="p-5 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-brand-gold font-bold">
              <span>{t("completedMilestones")}</span>
              <CheckCircle2 className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="text-3xl font-display font-light text-brand-ivory">03 / 05</div>
            <div className="text-[11px] font-sans text-brand-ivory/60">Framing & Acoustic Insulation Complete</div>
          </div>

          <div className="p-5 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-brand-gold font-bold">
              <span>{t("technicalDocs")}</span>
              <FileText className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="text-3xl font-display font-light text-brand-ivory">04</div>
            <div className="text-[11px] font-sans text-brand-ivory/60">DWG & PDF Specifications Verified</div>
          </div>
        </div>

        {/* Active Commission Details Card */}
        <div className="p-6 sm:p-8 rounded-sm bg-brand-navy-card border border-brand-gold/25 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/15">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase block mb-1 font-bold">
                COMMISSION ID: MRD-2026-NBO-089
              </span>
              <h2 className="font-display text-2xl text-brand-ivory uppercase">
                Westlands Luxury Penthouse — Acoustic Ceiling & Fluted Timber
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-xs font-mono tracking-wider text-brand-gold uppercase self-start sm:self-auto font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>In Fabrication</span>
            </span>
          </div>

          {/* Progress Timeline Stepper */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono text-brand-gold">
              <span>Progress: Stage 3 of 5</span>
              <span>65% Complete</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-brand-navy overflow-hidden border border-brand-gold/20">
              <div className="w-[65%] h-full bg-brand-gold rounded-full" />
            </div>
          </div>

          {/* Milestone List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xs bg-brand-navy border border-brand-gold/20 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-brand-gold font-bold">
                <span>01. Spatial Laser Survey</span>
                <span className="text-brand-gold">Verified</span>
              </div>
              <p className="text-xs text-brand-ivory/60">
                Completed on 22 Oct 2026 • Tolerances confirmed ±0.5mm
              </p>
            </div>

            <div className="p-4 rounded-xs bg-brand-navy border border-brand-gold/20 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-brand-gold font-bold">
                <span>02. Material Fabrication</span>
                <span className="text-brand-gold">Verified</span>
              </div>
              <p className="text-xs text-brand-ivory/60">
                Acoustic fluted slats cut at Enterprise Road Atelier
              </p>
            </div>

            <div className="p-4 rounded-xs bg-brand-navy border border-brand-gold/30 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-brand-gold font-bold">
                <span>03. Subgrid Framework</span>
                <span className="text-brand-gold">In Progress</span>
              </div>
              <p className="text-xs text-brand-ivory/60">
                Level 5 ceiling galvanized subgrid suspension in progress
              </p>
            </div>

            <div className="p-4 rounded-xs bg-brand-navy/60 border border-brand-gold/15 space-y-1 opacity-70">
              <div className="flex items-center justify-between text-xs font-mono text-brand-ivory/50">
                <span>04. Diurnal Lighting & Finish</span>
                <span>Scheduled</span>
              </div>
              <p className="text-xs text-brand-ivory/40">
                48V low-voltage magnetic track installation
              </p>
            </div>
          </div>

          {/* Atelier Technical Concierge Dispatch */}
          <div className="pt-4 border-t border-brand-gold/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-brand-ivory/60">
              Project Architect Lead: Emmanuel N. (Nairobi Atelier)
            </span>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent("Hello MarvelRise Lead Finisher, I am checking on Commission MRD-2026-NBO-089.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-lg shadow-brand-gold/20"
            >
              <span>Message Site Supervisor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
