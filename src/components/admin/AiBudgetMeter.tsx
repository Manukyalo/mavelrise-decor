"use client";

import React, { useState } from "react";
import type { AiBudget } from "@/types/admin";
import {
  Cpu,
  ShieldAlert,
  Power,
  Coins,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

interface AiUsageItem {
  id: string;
  visitor_id: string;
  total_tokens: number;
  cost_kes: number;
  created_at: string;
}

interface AiBudgetMeterProps {
  initialBudget: AiBudget;
  initialLogs: AiUsageItem[];
}

export function AiBudgetMeter({ initialBudget, initialLogs }: AiBudgetMeterProps) {
  const [budget, setBudget] = useState<AiBudget>(initialBudget);
  const [logs] = useState<AiUsageItem[]>(initialLogs);
  const [budgetInput, setBudgetInput] = useState<number>(initialBudget.budget_kes);
  const [visitorLimitInput, setVisitorLimitInput] = useState<number>(
    initialBudget.per_visitor_limit || 5000
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const spentKes = Number(budget.cost_kes) || 0;
  const percentage = Math.min(100, Math.round((spentKes / (budget.budget_kes || 1)) * 100));

  const handleToggle = async () => {
    const nextState = !budget.is_enabled;
    setBudget((prev) => ({ ...prev, is_enabled: nextState }));
    await updateSettings({ is_enabled: nextState });
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings({
        budget_kes: budgetInput,
        per_visitor_limit: visitorLimitInput,
      });
      setBudget((prev) => ({
        ...prev,
        budget_kes: budgetInput,
        per_visitor_limit: visitorLimitInput,
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = async (payload: Partial<AiBudget>) => {
    try {
      const res = await fetch("/api/admin/ai-budget", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setBudget(data.budget);
      }
    } catch (err) {
      console.error("Failed to update AI budget:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Master Switch Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-admin-surface border border-admin-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
              budget.is_enabled
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  budget.is_enabled ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              />
              <span className="text-xs font-mono font-semibold text-admin-text tracking-wide uppercase">
                AI Assistant Status: {budget.is_enabled ? "Active & Guarded" : "Offline (Killswitch Engaged)"}
              </span>
            </div>
            <p className="text-xs text-admin-text-muted font-sans mt-0.5">
              Strict monthly budget ceiling prevents unexpected API charges for the studio.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all shadow-sm ${
            budget.is_enabled
              ? "bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{budget.is_enabled ? "Emergency Kill Switch" : "Enable AI Concierge"}</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Coins}
          label="Monthly Cap"
          value={`KSh ${budget.budget_kes.toLocaleString()}`}
          subtext={`Cycle: ${budget.month}`}
          variant="gold"
        />
        <StatCard
          icon={Activity}
          label="KSh Spent"
          value={`KSh ${spentKes.toFixed(2)}`}
          subtext={`${percentage}% of monthly budget`}
          variant={percentage >= 90 ? "amber" : "default"}
        />
        <StatCard
          icon={Layers}
          label="Total Tokens"
          value={(budget.tokens_used || 0).toLocaleString()}
          subtext="Model: Gemini 1.5 Flash"
          variant="default"
        />
        <StatCard
          icon={ShieldAlert}
          label="Per-Visitor Limit"
          value={`${(budget.per_visitor_limit || 5000).toLocaleString()}`}
          subtext="Tokens max per IP / session"
          variant="emerald"
        />
      </div>

      {/* Usage Meter Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-admin-surface border border-admin-border space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-admin-gold uppercase tracking-wider block">
              Billing Month: {budget.month}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-admin-text font-light tracking-tight mt-0.5">
              Real-time Budget Consumption
            </h3>
          </div>

          <div className="sm:text-right font-mono">
            <span className="text-xs text-admin-text-muted block">
              Consumed / Ceiling
            </span>
            <span className="text-lg sm:text-xl text-admin-gold font-bold tabular-nums">
              KSh {spentKes.toFixed(2)}{" "}
              <span className="text-admin-text-muted/60 text-xs font-normal">
                / KSh {budget.budget_kes.toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-admin-surface-raised rounded-full overflow-hidden p-0.5 border border-admin-border">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                percentage >= 90
                  ? "bg-red-500 shadow-lg shadow-red-500/50"
                  : percentage >= 70
                  ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                  : "bg-admin-gold shadow-lg shadow-admin-gold/30"
              }`}
              style={{ width: `${Math.max(percentage, 2)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-admin-text-muted">
            <span>0%</span>
            <span className={percentage >= 70 ? "text-amber-400 font-bold" : ""}>
              70% Threshold Alert
            </span>
            <span className={percentage >= 90 ? "text-red-400 font-bold" : ""}>
              90% Warning
            </span>
            <span className="text-admin-gold font-bold tabular-nums">{percentage}% Consumed</span>
          </div>
        </div>

        {/* Safeguard Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          <div
            className={`p-4 rounded-xl border transition-colors ${
              percentage >= 70
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-admin-surface-raised/40 border-admin-border text-admin-text-muted"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {percentage >= 70 ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-admin-gold/50" />
              )}
              <span className="text-xs font-sans font-semibold text-admin-text uppercase tracking-wider">
                70% Pre-alert
              </span>
            </div>
            <p className="text-xs font-sans leading-relaxed">
              Notifies atelier management when monthly quota reaches 70%.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border transition-colors ${
              percentage >= 90
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-admin-surface-raised/40 border-admin-border text-admin-text-muted"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {percentage >= 90 ? (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-admin-gold/50" />
              )}
              <span className="text-xs font-sans font-semibold text-admin-text uppercase tracking-wider">
                90% Quota Warning
              </span>
            </div>
            <p className="text-xs font-sans leading-relaxed">
              Urgent push notice to showroom director to review or raise monthly cap.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border transition-colors ${
              percentage >= 100
                ? "bg-red-500/20 border-red-500 text-red-200"
                : "bg-admin-surface-raised/40 border-admin-border text-admin-text-muted"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Lock className="w-4 h-4 text-admin-gold" />
              <span className="text-xs font-sans font-semibold text-admin-text uppercase tracking-wider">
                100% Hard Stop
              </span>
            </div>
            <p className="text-xs font-sans leading-relaxed">
              Auto-diverts clients cleanly to WhatsApp & Room Planner. Zero runaway costs.
            </p>
          </div>
        </div>
      </div>

      {/* Adjust Ceiling Form */}
      <div className="p-5 sm:p-6 rounded-xl bg-admin-surface border border-admin-border">
        <h3 className="font-serif text-xl text-admin-text font-light tracking-tight mb-1">
          Adjust Monthly Budget & Anti-Scraping Guards
        </h3>
        <p className="text-xs text-admin-text-muted font-sans mb-5">
          Modifications apply immediately to all active visitor sessions.
        </p>

        <form onSubmit={handleSaveBudget} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-sans font-semibold text-admin-text uppercase tracking-wider">
              Monthly Budget Ceiling (KSh)
            </label>
            <div className="relative">
              <span className="text-xs font-mono text-admin-text-muted absolute left-3.5 top-1/2 -translate-y-1/2">
                KSh
              </span>
              <input
                type="number"
                min="500"
                step="500"
                value={budgetInput}
                onChange={(e) => setBudgetInput(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-admin-surface-raised border border-admin-border focus:border-admin-border-gold text-admin-text text-sm font-mono tabular-nums focus:outline-none transition-colors"
              />
            </div>
            <span className="text-[11px] font-sans text-admin-text-muted block">
              Equivalent to ~{(budgetInput / 0.000075).toLocaleString()} design consultation tokens.
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-sans font-semibold text-admin-text uppercase tracking-wider">
              Per-Visitor Token Limit (Anti-Bot)
            </label>
            <div className="relative">
              <ShieldAlert className="w-4 h-4 text-admin-gold/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1000"
                step="500"
                value={visitorLimitInput}
                onChange={(e) => setVisitorLimitInput(Number(e.target.value))}
                className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-admin-surface-raised border border-admin-border focus:border-admin-border-gold text-admin-text text-sm font-mono tabular-nums focus:outline-none transition-colors"
              />
            </div>
            <span className="text-[11px] font-sans text-admin-text-muted block">
              Protects against automated scripts and runaway interactive loops.
            </span>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            {saveSuccess ? (
              <span className="text-xs font-sans font-medium text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Safeguard settings updated successfully.</span>
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-admin-gold hover:bg-admin-gold-hover text-admin-bg font-sans font-semibold text-xs tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{isSaving ? "Saving..." : "Save Budget Ceiling"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 sm:p-6 rounded-xl bg-admin-surface border border-admin-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-admin-gold" />
            <h4 className="font-serif text-lg text-admin-text font-light tracking-tight">
              Recent AI Invocations & Token Audit
            </h4>
          </div>
          <span className="text-xs font-mono text-admin-text-muted">
            Last {logs.length} interactions
          </span>
        </div>

        <div className="rounded-lg border border-admin-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-admin-border bg-admin-surface-raised/70 text-[10px] text-admin-text-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Visitor Session</th>
                  <th className="py-2.5 px-3 text-right">Tokens Consumed</th>
                  <th className="py-2.5 px-3 text-right">Cost (KSh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border/60">
                {logs.map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-admin-surface-raised/40 transition-colors">
                    <td className="py-2.5 px-3 text-admin-text-muted whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-admin-text truncate max-w-[200px]">
                      {log.visitor_id || "Anonymous"}
                    </td>
                    <td className="py-2.5 px-3 text-right text-admin-gold font-semibold tabular-nums">
                      {log.total_tokens?.toLocaleString() || 0}
                    </td>
                    <td className="py-2.5 px-3 text-right text-admin-text tabular-nums">
                      KSh {Number(log.cost_kes || 0).toFixed(3)}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-admin-text-muted font-sans">
                      No token activity recorded yet for this billing cycle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
