"use client";

import React, { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { signInAction, type AuthActionResult } from "@/lib/auth/actions";
import { Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Shield } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || `/${locale}/portal`;
  const urlError = searchParams.get("error");

  const [state, formAction] = React.useState<AuthActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("locale", locale);
    formData.set("next", next);

    startTransition(async () => {
      const result = await signInAction(null, formData);
      if (result) {
        formAction(result);
      }
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-brand-navy bg-noise relative">
      {/* Background Ambience in Champagne Gold */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-brand-gold/15 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Reveal direction="up" distance={20} duration={0.8}>
          <div className="p-8 sm:p-10 rounded-sm bg-brand-navy-card border border-brand-gold/25 shadow-2xl relative overflow-hidden">
            {/* Top architectural gold rule */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

            {/* Back link */}
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-brand-gold/70 hover:text-brand-gold uppercase transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("returnHome")}</span>
              </Link>
            </div>

            {/* Header */}
            <div className="space-y-2 mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">
                <Shield className="w-3 h-3" />
                <span>Atelier Security</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-brand-ivory uppercase font-light tracking-wide">
                {t("loginTitle")}
              </h1>
              <p className="text-xs font-sans text-brand-ivory/70 leading-relaxed">
                {t("loginSubtitle")}
              </p>
            </div>

            {/* Error alerts */}
            {(state?.error || urlError) && (
              <div
                role="alert"
                className="mb-6 p-3.5 rounded-sm bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{state?.error || urlError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-gold">
                  {t("emailLabel")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-gold/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="architect@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-brand-navy border border-brand-gold/25 focus:border-brand-gold text-brand-ivory text-xs font-mono placeholder:text-brand-ivory/30 focus:outline-none transition-colors"
                  />
                </div>
                {state?.fieldErrors?.email && (
                  <p className="text-[11px] text-red-400 font-mono mt-1">
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-gold">
                    {t("passwordLabel")}
                  </label>
                  <span className="text-[10px] font-mono text-brand-ivory/50">
                    Encrypted
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-gold/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-brand-navy border border-brand-gold/25 focus:border-brand-gold text-brand-ivory text-xs font-mono placeholder:text-brand-ivory/30 focus:outline-none transition-colors"
                  />
                </div>
                {state?.fieldErrors?.password && (
                  <p className="text-[11px] text-red-400 font-mono mt-1">
                    {state.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-60 text-brand-navy font-bold text-xs font-mono uppercase tracking-widest transition-all duration-300 shadow-xl shadow-brand-gold/25"
              >
                <span>{isPending ? t("signingIn") : t("submitLogin")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-8 pt-6 border-t border-brand-gold/15 text-center space-y-2">
              <p className="text-xs font-sans text-brand-ivory/70">
                {t("noAccountQuestion")}
              </p>
              <Link
                href={`/auth/register?next=${encodeURIComponent(next)}`}
                className="inline-block text-xs font-mono text-brand-gold hover:text-brand-gold-light uppercase tracking-wider font-semibold transition-colors"
              >
                {t("createAccountCta")} →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
