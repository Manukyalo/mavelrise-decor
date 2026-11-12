import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  variant?: "default" | "gold" | "emerald" | "amber";
  badge?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "default",
  badge,
}: StatCardProps) {
  const borderStyles = {
    default: "border-admin-border hover:border-admin-border-gold",
    gold: "border-admin-border-gold shadow-sm",
    emerald: "border-emerald-500/30 hover:border-emerald-500/50 shadow-sm",
    amber: "border-amber-500/30 hover:border-amber-500/50 shadow-sm",
  }[variant];

  const iconColors = {
    default: "text-admin-gold bg-admin-gold/10 border-admin-gold/25",
    gold: "text-admin-gold bg-admin-gold/15 border-admin-gold/35",
    emerald: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    amber: "text-amber-400 bg-amber-500/15 border-amber-500/30",
  }[variant];

  return (
    <div
      className={`p-5 rounded-xl bg-admin-surface border ${borderStyles} transition-all duration-200 shadow-xs flex flex-col justify-between gap-3`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-admin-text-muted">
          {label}
        </span>
        <div
          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${iconColors}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold tracking-tight text-admin-text tabular-nums">
            {value}
          </span>
          {badge && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {badge}
            </span>
          )}
        </div>

        {subtext && (
          <p className="text-[11px] text-admin-text-muted mt-1 leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

