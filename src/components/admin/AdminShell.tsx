"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Package,
  Cpu,
  BarChart3,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Flame,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string;
  role?: string;
  locale?: string;
}

export function AdminShell({
  children,
  userEmail = "owner@marvelrisedecor.co.ke",
  role = "owner",
  locale = "en",
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Leads & Pipeline",
      href: `/${locale}/admin/leads`,
      icon: Users,
      badge: "Hot Leads",
    },
    {
      label: "Product Catalogue & Rates",
      href: `/${locale}/admin/products`,
      icon: Package,
    },
    {
      label: "AI Token Guard",
      href: `/${locale}/admin/ai-budget`,
      icon: Cpu,
    },
    {
      label: "Conversion Funnel",
      href: `/${locale}/admin/analytics`,
      icon: BarChart3,
    },
    {
      label: "Scoring & Settings",
      href: `/${locale}/admin/settings`,
      icon: Sliders,
    },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}/admin/leads` && (pathname === `/${locale}/admin` || pathname === `/${locale}/admin/leads`)) {
      return true;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-brand-navy text-brand-ivory flex">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-brand-navy-card/95 backdrop-blur-md border-r border-brand-gold/20 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-0 max-lg:-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-brand-gold/15 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-gold">
                Director Command
              </span>
            </div>
            <h1 className="font-display text-xl text-brand-ivory uppercase tracking-wider font-medium mt-1">
              MarvelRise Decor
            </h1>
            <p className="text-[11px] font-mono text-brand-ivory/50">
              Ruiru Membley Showroom
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-brand-ivory/70 hover:text-brand-ivory p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge */}
        <div className="px-6 py-4 bg-brand-navy/60 border-b border-brand-gold/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center font-display text-brand-gold text-base font-semibold">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-sans text-brand-ivory font-medium truncate block">
                {userEmail}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-brand-gold" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold">
                {role === "owner" ? "Atelier Owner" : "Atelier Staff"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-sm text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/40 shadow-sm"
                    : "text-brand-ivory/70 hover:text-brand-ivory hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-brand-gold" : "text-brand-ivory/60"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] bg-brand-gold/25 text-brand-gold border border-brand-gold/40">
                    <Flame className="w-2.5 h-2.5 text-brand-gold" />
                    <span>{item.badge}</span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Return to Public Showroom */}
        <div className="p-4 border-t border-brand-gold/15 bg-brand-navy/40">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-sm border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/10 text-xs font-mono uppercase tracking-wider transition-all"
          >
            <span>View Live Showroom</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar for Mobile */}
        <header className="lg:hidden h-16 border-b border-brand-gold/20 bg-brand-navy-card/90 backdrop-blur-md px-4 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-brand-gold hover:text-brand-gold-light"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display text-lg uppercase tracking-wider text-brand-ivory">
            Director Dashboard
          </span>
          <span className="w-6" />
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

