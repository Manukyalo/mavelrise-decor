"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Cpu,
  BarChart3,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Flame,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string;
  role?: string;
  locale?: string;
  hotLeadsCount?: number;
}

export function AdminShell({
  children,
  userEmail = "owner@marvelrisedecor.co.ke",
  role = "owner",
  locale = "en",
  hotLeadsCount = 2,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Restore sidebar state from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mrd_admin_sidebar_collapsed");
      if (stored !== null) {
        setSidebarCollapsed(stored === "true");
      }
    } catch {
      // Local storage unavailable
    }
  }, []);

  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      localStorage.setItem("mrd_admin_sidebar_collapsed", String(next));
    } catch {
      // ignore
    }
  };

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Global keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("admin-global-search");
        input?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    {
      label: "Overview",
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Leads & Pipeline",
      href: `/${locale}/admin/leads`,
      icon: Users,
      badge: hotLeadsCount > 0 ? `${hotLeadsCount} hot` : undefined,
    },
    {
      label: "Catalogue & Rates",
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

  const isCurrentActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Generate clean breadcrumb title
  const getBreadcrumbs = () => {
    if (pathname.includes("/admin/leads")) return ["Atelier", "Client Leads & Pipeline"];
    if (pathname.includes("/admin/products")) return ["Atelier", "Catalogue & Rates"];
    if (pathname.includes("/admin/ai-budget")) return ["Atelier", "AI Token Guard"];
    if (pathname.includes("/admin/analytics")) return ["Atelier", "Conversion Funnel"];
    if (pathname.includes("/admin/settings")) return ["Atelier", "Scoring & Settings"];
    return ["Atelier", "Executive Overview"];
  };

  const breadcrumbs = getBreadcrumbs();

  const switchLocale = (newLocale: "en" | "sw") => {
    if (newLocale === locale) return;
    const target = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(target);
  };

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text font-sans antialiased flex flex-col lg:flex-row">
      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ========================================================================= */}
      {/* FIXED / COLLAPSIBLE SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-admin-surface border-r border-admin-border transition-all duration-300 ease-in-out lg:static shrink-0 ${sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"
          } ${mobileDrawerOpen
            ? "translate-x-0 w-[280px]"
            : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Brand Block */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-admin-border">
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-3 overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-gold/50 rounded-md"
          >
            {/* Architectural Monogram Mark */}
            <div className="w-9 h-9 rounded-md bg-admin-surface-raised border border-admin-border-gold flex items-center justify-center shrink-0 shadow-sm group-hover:border-admin-gold transition-colors">
              <svg viewBox="0 0 36 36" className="w-5 h-5 fill-none">
                <path
                  d="M18 3L33 18L18 33L3 18Z"
                  stroke="#C8A15A"
                  strokeWidth="1.2"
                />
                <path
                  d="M10 24L10 13L14.5 19.5L18 13L21.5 19.5L26 13L26 24"
                  stroke="#F6F1E7"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="18" cy="13" r="1.2" fill="#F25C05" />
              </svg>
            </div>

            {/* Brand text (hidden when collapsed on desktop) */}
            <div
              className={`flex flex-col transition-opacity duration-200 ${sidebarCollapsed ? "lg:hidden" : "block"
                }`}
            >
              <span className="font-sans font-semibold text-sm tracking-wide text-admin-text leading-tight group-hover:text-admin-gold transition-colors">
                MarvelRise Decor
              </span>
              <span className="text-[11px] text-admin-text-muted leading-tight">
                Ruiru Membley Showroom
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-raised transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isCurrentActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group ${active
                    ? "bg-admin-surface-raised text-admin-text border border-admin-border shadow-sm font-semibold"
                    : "text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-hover"
                  } ${sidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
              >
                {/* Active Gold Left Indicator */}
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-admin-gold shadow-sm shadow-admin-gold/40" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${active
                      ? "text-admin-gold"
                      : "text-admin-text-muted group-hover:text-admin-text"
                    }`}
                />

                <span
                  className={`truncate flex-1 ${sidebarCollapsed ? "lg:hidden" : "block"
                    }`}
                >
                  {item.label}
                </span>

                {/* Hot badge */}
                {item.badge && !sidebarCollapsed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Flame className="w-2.5 h-2.5" />
                    <span>{item.badge}</span>
                  </span>
                )}

                {/* Dot badge when collapsed */}
                {item.badge && sidebarCollapsed && (
                  <span className="hidden lg:block absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: Owner Profile & Actions */}
        <div className="p-3 border-t border-admin-border bg-admin-surface-raised/40 space-y-2">
          {/* User Badge */}
          <div
            className={`flex items-center gap-3 p-2 rounded-lg bg-admin-surface border border-admin-border-subtle ${sidebarCollapsed ? "lg:justify-center lg:p-1.5" : ""
              }`}
          >
            <div className="w-8 h-8 rounded-full bg-admin-gold/20 border border-admin-gold/40 flex items-center justify-center text-admin-gold font-sans font-bold text-xs shrink-0">
              {userEmail.charAt(0).toUpperCase()}
            </div>

            <div
              className={`overflow-hidden min-w-0 flex-1 ${sidebarCollapsed ? "lg:hidden" : "block"
                }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-admin-text truncate block">
                  {userEmail}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-admin-gold shrink-0" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-admin-gold font-semibold">
                  Atelier Owner
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Sidebar Toggle Button */}
          <div className="hidden lg:flex items-center justify-between pt-1">
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 p-1.5 rounded-md text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-raised text-[11px] font-mono transition-colors w-full justify-center"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-admin-gold" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 text-admin-gold" />
                  <span className="text-admin-text-muted">Collapse Menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER (Top Bar + Scrollable Content) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Bar (64px) */}
        <header className="sticky top-0 z-30 h-16 bg-admin-surface/90 backdrop-blur-md border-b border-admin-border px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Drawer Trigger + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-md text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-raised transition-colors shrink-0"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5 text-admin-gold" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-admin-text-muted min-w-0"
            >
              <span className="truncate">{breadcrumbs[0]}</span>
              <span className="text-admin-border-gold">/</span>
              <span className="text-admin-text font-medium truncate">
                {breadcrumbs[1]}
              </span>
            </nav>
          </div>

          {/* Center: Global Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div
              className={`relative w-full flex items-center rounded-lg bg-admin-surface-raised border transition-all duration-200 ${searchFocused
                  ? "border-admin-gold ring-1 ring-admin-gold/30"
                  : "border-admin-border hover:border-admin-border-gold"
                }`}
            >
              <Search className="w-4 h-4 text-admin-text-muted absolute left-3 shrink-0 pointer-events-none" />
              <input
                id="admin-global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search leads, quote ref or products..."
                className="w-full pl-9 pr-14 py-2 bg-transparent text-xs text-admin-text placeholder:text-admin-text-muted/60 focus:outline-none"
              />
              <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-admin-text-muted bg-admin-surface rounded border border-admin-border pointer-events-none">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Language Switcher, Live Store Link, Status Pill */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Showroom Live Status */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Showroom Live</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center rounded-md border border-admin-border p-0.5 bg-admin-surface-raised">
              <button
                onClick={() => switchLocale("en")}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${locale === "en"
                    ? "bg-admin-gold text-brand-navy font-bold shadow-xs"
                    : "text-admin-text-muted hover:text-admin-text"
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLocale("sw")}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${locale === "sw"
                    ? "bg-admin-gold text-brand-navy font-bold shadow-xs"
                    : "text-admin-text-muted hover:text-admin-text"
                  }`}
              >
                SW
              </button>
            </div>

            {/* View Live Store */}
            <Link
              href={`/${locale}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-admin-border hover:border-admin-border-gold text-xs font-medium text-admin-text-muted hover:text-admin-text bg-admin-surface hover:bg-admin-surface-raised transition-all"
              title="Open public showroom website in a new tab"
            >
              <span>Public Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-admin-gold" />
            </Link>
          </div>
        </header>

        {/* Content Area with consistent 24-32px padding and max width */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
