"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Menu, X, ArrowUpRight, Compass, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("navigation");
  const brandT = useTranslations("brand");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = (newLocale: "en" | "sw") => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  const navLinks = [
    { label: t("collections"), href: "/collections" },
    { label: t("projects"), href: "/projects" },
    { label: "Room Planner", href: "/planner" },
    { label: t("about"), href: "/#how-it-works" },
    { label: t("contact"), href: "/#room-planner" },
  ];

  // Absolute guarantee: never render marketing header inside admin portal
  if (pathname?.includes("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-luxury",
          isScrolled
            ? "py-3 glass-panel border-b border-white/10 shadow-2xl shadow-black/80"
            : "py-6 bg-transparent"
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Brand Logo & MRD Mark (Supplied Logo with Signature Orange & Green Accents) */}
          <Link
            href="/"
            className="group flex items-center gap-3.5 focus:outline-none"
            aria-label="MarvelRise Decor Homepage"
          >
            {/* Precision Architectural Mark */}
            <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-sm bg-brand-navy-elevated border border-brand-gold/30 transition-all duration-300 group-hover:border-brand-gold">
              <svg
                viewBox="0 0 40 40"
                className="w-6 h-6 fill-none stroke-current text-brand-ivory transition-colors duration-300 group-hover:text-brand-gold"
              >
                <path
                  d="M 20 4 L 36 20 L 20 36 L 4 20 Z"
                  strokeWidth="1.2"
                  className="stroke-brand-gold/40 group-hover:stroke-brand-gold transition-colors"
                />
                <path
                  d="M 11 26 L 11 14 L 16 21 L 20 14 L 24 21 L 29 14 L 29 26"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Official Logo Orange Dot */}
                <circle cx="20" cy="14" r="1.5" className="fill-[#F25C05] stroke-none" />
              </svg>
              {/* Official Logo Green Badge */}
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#0F4C3A] border border-brand-navy" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg md:text-xl font-normal tracking-[0.18em] text-brand-ivory uppercase leading-none">
                  MarvelRise
                </span>
                <span className="text-[10px] font-mono px-1 py-0.2 bg-brand-gold/15 text-brand-gold border border-brand-gold/30 rounded-xs font-semibold">
                  MRD
                </span>
              </div>
              <span className="text-[9px] md:text-[10px] font-mono tracking-[0.25em] text-brand-ivory/60 uppercase leading-none mt-1">
                Decor • Nairobi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-brand-ivory/80"
          >
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="relative py-1 transition-colors duration-200 hover:text-brand-gold group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-brand-gold transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Header Actions: Language Switcher + Request Quote */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Switcher Pill */}
            <div
              className="flex items-center rounded-full p-0.5 bg-brand-navy-elevated border border-brand-gold/25 text-[11px] font-mono tracking-wider"
              role="radiogroup"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => switchLocale("en")}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all duration-300",
                  locale === "en"
                    ? "bg-brand-gold text-brand-navy font-bold shadow-sm"
                    : "text-brand-ivory/70 hover:text-brand-ivory"
                )}
                aria-checked={locale === "en"}
                role="radio"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => switchLocale("sw")}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all duration-300",
                  locale === "sw"
                    ? "bg-brand-gold text-brand-navy font-bold shadow-sm"
                    : "text-brand-ivory/70 hover:text-brand-ivory"
                )}
                aria-checked={locale === "sw"}
                role="radio"
              >
                SW
              </button>
            </div>

            {/* Client Portal Link */}
            <Link
              href="/portal"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-brand-ivory/80 hover:text-brand-gold border border-brand-gold/20 hover:border-brand-gold/50 text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <span>{t("portal")}</span>
            </Link>

            {/* Request Quote Button */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-semibold text-xs font-mono uppercase tracking-widest transition-all duration-300 shadow-lg shadow-brand-gold/20"
            >
              <span>{t("requestQuote")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-sm bg-brand-black-elevated text-brand-white border border-white/10 hover:border-white/20 focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-brand-navy-deep/98 backdrop-blur-2xl flex flex-col pt-24 pb-8 px-6 justify-between animate-fadeIn border-t border-brand-gold/20"
          role="dialog"
          aria-modal="true"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/15 text-xs font-mono uppercase tracking-widest text-brand-gold">
              <span>{brandT("name")}</span>
              <span className="text-brand-gold font-bold">Nairobi</span>
            </div>

            <nav className="flex flex-col gap-4 text-xl font-display uppercase tracking-widest text-brand-ivory">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-brand-gold/10 hover:text-brand-gold transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-brand-gold/60" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4 pt-6 border-t border-brand-gold/15">
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-brand-navy-elevated border border-brand-gold/25 text-brand-ivory text-xs font-mono uppercase tracking-widest font-semibold"
            >
              <span>{t("portal")}</span>
              <ArrowUpRight className="w-4 h-4 text-brand-gold" />
            </Link>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold shadow-lg shadow-brand-gold/20"
            >
              <span>{t("requestQuote")}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <div className="text-center text-[10px] font-mono tracking-widest text-brand-gold/60 uppercase">
              Enterprise Road • Nairobi, Kenya
            </div>
          </div>
        </div>
      )}
    </>
  );
}

