import React from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/auth/actions";
import {
  ShieldCheck,
  LogOut,
  FolderKanban,
  FileText,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export default async function PortalPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("portal");
  const navT = await getTranslations("navigation");

  // Server-side Authentication Verification (Strict check via getUser)
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
    <div className="min-h-screen pt-28 pb-20 bg-brand-black bg-noise relative">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 space-y-10">
        {/* Top Portal Banner */}
        <Reveal direction="down" distance={15}>
          <div className="p-6 sm:p-8 rounded-sm bg-brand-black-elevated border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                <span>{t("badge")}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-brand-white uppercase font-light">
                {t("title")}
              </h1>
              <p className="text-xs sm:text-sm font-sans text-brand-sand-400">
                {t("welcome")}:{" "}
                <span className="text-brand-orange font-mono font-medium">
                  {fullName}
                </span>{" "}
                ({user.email})
              </p>
            </div>

            {/* Sign Out Action */}
            <form action={handleSignOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-white/5 hover:bg-red-950/40 text-brand-sand-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-mono uppercase tracking-widest transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("signOut")}</span>
              </button>
            </form>
          </div>
        </Reveal>

        {/* Project Metrics Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-sm bg-brand-black-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-brand-sand-400">
              <span>{t("activeCommissions")}</span>
              <FolderKanban className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-3xl font-display font-light text-brand-white">01</div>
            <div className="text-[11px] font-sans text-brand-sand-500">Westlands Penthouse Suite</div>
          </div>

          <div className="p-5 rounded-sm bg-brand-black-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-brand-sand-400">
              <span>{t("completedMilestones")}</span>
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
            </div>
            <div className="text-3xl font-display font-light text-brand-white">03 / 05</div>
            <div className="text-[11px] font-sans text-brand-sand-500">Framing & Acoustic Insulation Complete</div>
          </div>

          <div className="p-5 rounded-sm bg-brand-black-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-brand-sand-400">
              <span>{t("technicalDocs")}</span>
              <FileText className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-3xl font-display font-light text-brand-white">04</div>
            <div className="text-[11px] font-sans text-brand-sand-500">DWG & PDF Specifications Verified</div>
          </div>
        </div>

        {/* Active Commission Details Card */}
        <div className="p-6 sm:p-8 rounded-sm bg-brand-black-elevated border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-brand-orange uppercase block mb-1">
                COMMISSION ID: MRD-2026-NBO-089
              </span>
              <h2 className="font-display text-2xl text-brand-white uppercase">
                Westlands Luxury Penthouse — Acoustic Ceiling & Fluted Timber
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-xs font-mono tracking-wider text-brand-orange uppercase self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>In Fabrication</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-brand-sand-200">
                Installation Parameters
              </h3>
              <ul className="space-y-2 text-brand-sand-400">
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Primary System:</span>
                  <span className="text-brand-white font-mono">Multi-tier Floating Acoustic Gypsum</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Wall Cladding:</span>
                  <span className="text-brand-white font-mono">Calibrated Natural White Oak Slatting</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Illumination:</span>
                  <span className="text-brand-white font-mono">Recessed 48V Magnetic Microprism Profile</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Site Location:</span>
                  <span className="text-brand-white font-mono">Westlands, Nairobi, Kenya</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-brand-sand-200">
                Verified Atelier Documents
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xs bg-brand-black border border-white/10 flex items-center justify-between hover:border-brand-orange/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-brand-orange" />
                    <div>
                      <span className="font-mono text-xs text-brand-sand-200 block">MRD_Structural_Framing_Rev3.dwg</span>
                      <span className="text-[10px] text-brand-sand-500">24.8 MB • Approved by Lead Engineer</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-brand-sand-400" />
                </div>

                <div className="p-3 rounded-xs bg-brand-black border border-white/10 flex items-center justify-between hover:border-brand-orange/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-mono text-xs text-brand-sand-200 block">Photometric_Lighting_Simulation.pdf</span>
                      <span className="text-[10px] text-brand-sand-500">12.1 MB • 3000K Diurnal Calibration</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-brand-sand-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent("Hello MarvelRise Atelier Lead, I would like to review the technical specification for my active commission.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-mono uppercase tracking-widest font-semibold transition-colors shadow-lg shadow-brand-orange/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("initiateBrief")}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

