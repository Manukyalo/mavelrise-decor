"use client";

import React, { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { signUpAction, type AuthActionResult } from "@/lib/auth/actions";
import { Lock, Mail, User, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const locale = useLocale();

  const [state, formAction] = React.useState<AuthActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("locale", locale);

    startTransition(async () => {
      const result = await signUpAction(null, formData);
      if (result) {
        formAction(result);
      }
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-brand-black bg-noise relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-brand-green/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Reveal direction="up" distance={20} duration={0.8}>
          <div className="p-8 sm:p-10 rounded-sm bg-brand-black-elevated border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-green via-brand-orange to-transparent" />

            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-brand-sand-400 hover:text-brand-orange uppercase transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("returnHome")}</span>
              </Link>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="font-display text-2xl sm:text-3xl text-brand-white uppercase font-light tracking-wide">
                {t("registerTitle")}
              </h1>
              <p className="text-xs font-sans text-brand-sand-400 leading-relaxed">
                {t("registerSubtitle")}
              </p>
            </div>

            {state?.success && state.error && (
              <div
                role="status"
                className="mb-6 p-3.5 rounded-sm bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            {!state?.success && state?.error && (
              <div
                role="alert"
                className="mb-6 p-3.5 rounded-sm bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-sand-300">
                  {t("fullNameLabel")}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Arch. David Kimani"
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-brand-black border border-white/15 focus:border-brand-green text-brand-white text-xs font-mono placeholder:text-brand-black-muted focus:outline-none transition-colors"
                  />
                </div>
                {state?.fieldErrors?.fullName && (
                  <p className="text-[11px] text-red-400 font-mono mt-1">
                    {state.fieldErrors.fullName[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-sand-300">
                  {t("emailLabel")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="kimani@architects.co.ke"
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-brand-black border border-white/15 focus:border-brand-green text-brand-white text-xs font-mono placeholder:text-brand-black-muted focus:outline-none transition-colors"
                  />
                </div>
                {state?.fieldErrors?.email && (
                  <p className="text-[11px] text-red-400 font-mono mt-1">
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-sand-300">
                  {t("passwordLabel")}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-brand-black border border-white/15 focus:border-brand-green text-brand-white text-xs font-mono placeholder:text-brand-black-muted focus:outline-none transition-colors"
                  />
                </div>
                {state?.fieldErrors?.password && (
                  <p className="text-[11px] text-red-400 font-mono mt-1">
                    {state.fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-brand-sand-300">
                  {t("confirmPasswordLabel")}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm bg-brand-black border border-white/15 focus:border-brand-green text-brand-white text-xs font-mono placeholder:text-brand-black-muted focus:outline-none transition-colors"
                  />
                </div>
                {state?.fieldErrors?.confirmPassword && (
                  <p className="text-[11px] text-red-400 font-mono mt-1">
                    {state.fieldErrors.confirmPassword[0]}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-sm bg-brand-green hover:bg-brand-green-subtle disabled:opacity-50 disabled:cursor-not-allowed text-brand-white text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg shadow-brand-green/20"
              >
                <span>{isPending ? t("submitting") : t("registerBtn")}</span>
                {!isPending && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs font-sans text-brand-sand-400">
                {t("hasAccount")}{" "}
                <Link
                  href="/auth/login"
                  className="text-brand-orange hover:text-white font-mono text-[11px] uppercase tracking-wider underline underline-offset-4 ml-1 transition-colors"
                >
                  {t("signInLink")}
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
