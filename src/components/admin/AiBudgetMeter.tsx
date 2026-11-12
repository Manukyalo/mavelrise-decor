"use client";

import React, { useState } from "react";
import type { AiBudget } from "@/types/admin";
import {
  Cpu,
  ShieldAlert,
  Power,
  Sliders,
  DollarSign,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";

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

  const getMeterColor = (pct: number) => {
    if (pct >= 90) return "bg-red-500 text-red-400";
    if (pct >= 70) return "bg-amber-500 text-amber-400";
    return "bg-brand-gold text-brand-gold";
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Master Kill Switch & Status */}
      <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-sm border flex items-center justify-center ${
              budget.is_enabled
                ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400"
                : "border-red-500/40 bg-red-950/40 text-red-400"
            }`}
          >
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  budget.is_enabled ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-brand-ivory font-semibold">
                AI Design Assistant: {budget.is_enabled ? "ACTIVE & GUARDED" : "OFFLINE (HARD STOP)"}
              </span>
            </div>
            <p className="text-xs font-sans text-brand-ivory/60 mt-0.5">
              Strict monthly spend ceiling protects the showroom against surprise API bills.
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider font-bold transition-all ${
            budget.is_enabled
              ? "bg-red-950/50 hover:bg-red-900/60 border border-red-500/50 text-red-300"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{budget.is_enabled ? "Emergency Shut Off" : "Enable AI Concierge"}</span>
        </button>
      </div>

      {/* Usage Meter Card */}
      <div className="p-8 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-brand-gold uppercase tracking-[0.2em] block">
              Billing Cycle: {budget.month}
            </span>
            <h3 className="font-display text-2xl text-brand-ivory font-light mt-0.5">
              Monthly KSh Spend Allocation
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-brand-ivory/60 block">
              Current Spend / Ceiling
            </span>
            <span className="font-mono text-xl text-brand-gold font-bold">
              KSh {spentKes.toFixed(2)}{" "}
              <span className="text-brand-ivory/40 text-sm">
                / KSh {budget.budget_kes.toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-brand-navy rounded-full overflow-hidden p-0.5 border border-brand-gold/20">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage >= 90
                  ? "bg-red-500 shadow-lg shadow-red-500/50"
                  : percentage >= 70
                  ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                  : "bg-brand-gold shadow-lg shadow-brand-gold/50"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-brand-ivory/60">
            <span>0%</span>
            <span className={percentage >= 70 ? "text-amber-400 font-bold" : ""}>
              70% Alert
            </span>
            <span className={percentage >= 90 ? "text-red-400 font-bold" : ""}>
              90% Alert
            </span>
            <span className="text-brand-gold font-bold">{percentage}% Consumed</span>
          </div>
        </div>

        {/* Milestone Threshold Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-brand-gold/10">
          <div
            className={`p-4 rounded-sm border ${
              percentage >= 70
                ? "bg-amber-950/30 border-amber-500/40 text-amber-300"
                : "bg-brand-navy/40 border-brand-gold/15 text-brand-ivory/60"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {percentage >= 70 ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-brand-gold/50" />
              )}
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                70% Pre-alert
              </span>
            </div>
            <p className="text-[11px] font-sans">
              Notifies director when usage crosses 70% threshold.
            </p>
          </div>

          <div
            className={`p-4 rounded-sm border ${
              percentage >= 90
                ? "bg-red-950/30 border-red-500/40 text-red-300"
                : "bg-brand-navy/40 border-brand-gold/15 text-brand-ivory/60"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {percentage >= 90 ? (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-brand-gold/50" />
              )}
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                90% Warning
              </span>
            </div>
            <p className="text-[11px] font-sans">
              Warning sent to email and dashboard header banner.
            </p>
          </div>

          <div
            className={`p-4 rounded-sm border ${
              percentage >= 100
                ? "bg-red-950/60 border-red-500 text-red-200"
                : "bg-brand-navy/40 border-brand-gold/15 text-brand-ivory/60"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                100% Hard Stop
              </span>
            </div>
            <p className="text-[11px] font-sans">
              Redirects all public visitors directly to WhatsApp & Room Planner.
            </p>
          </div>
        </div>
      </div>

      {/* Adjust Budget & Visitor Limits Form */}
      <div className="p-8 rounded-sm bg-brand-navy-card border border-brand-gold/20">
        <h3 className="font-display text-xl text-brand-ivory uppercase tracking-wider font-medium mb-1">
          Adjust Monthly Budget & Spam Safeguards
        </h3>
        <p className="text-xs font-sans text-brand-ivory/60 mb-6">
          Changes take effect immediately across all client sessions.
        </p>

        <form onSubmit={handleSaveBudget} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold">
              Monthly Budget Ceiling (KSh)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-brand-gold/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="500"
                step="500"
                value={budgetInput}
                onChange={(e) => setBudgetInput(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-brand-navy border border-brand-gold/25 focus:border-brand-gold text-brand-ivory text-xs font-mono"
              />
            </div>
            <span className="text-[10px] font-mono text-brand-ivory/40">
              Estimated tokens: ~{(budgetInput / 0.000075).toLocaleString()} tokens
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold">
              Per-Visitor Token Limit (Anti-bot)
            </label>
            <div className="relative">
              <ShieldAlert className="w-4 h-4 text-brand-gold/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1000"
                step="500"
                value={visitorLimitInput}
                onChange={(e) => setVisitorLimitInput(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-brand-navy border border-brand-gold/25 focus:border-brand-gold text-brand-ivory text-xs font-mono"
              />
            </div>
            <span className="text-[10px] font-mono text-brand-ivory/40">
              Stops scrapers and runaway loops automatically.
            </span>
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ceiling settings saved successfully.</span>
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs font-mono uppercase tracking-widest disabled:opacity-50 transition-all"
            >
              {isSaving ? "Saving..." : "Save Budget Ceiling"}
            </button>
          </div>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-gold" />
            <h4 className="font-display text-lg text-brand-ivory uppercase tracking-wider">
              Recent AI Invocations & Token Audit
            </h4>
          </div>
          <span className="text-[11px] font-mono text-brand-ivory/50">
            Last {logs.length} requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-brand-gold/15 text-[10px] text-brand-gold uppercase tracking-wider">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Visitor Fingerprint</th>
                <th className="py-2.5 px-3 text-right">Tokens Consumed</th>
                <th className="py-2.5 px-3 text-right">Estimated Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gold/10">
              {logs.map((log, i) => (
                <tr key={log.id || i} className="hover:bg-brand-navy/40">
                  <td className="py-2.5 px-3 text-brand-ivory/60">
                    {new Date(log.created_at).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-2.5 px-3 text-brand-ivory">{log.visitor_id || "Anonymous"}</td>
                  <td className="py-2.5 px-3 text-right text-brand-gold font-bold">
                    {log.total_tokens?.toLocaleString() || 0}
                  </td>
                  <td className="py-2.5 px-3 text-right text-brand-ivory">
                    KSh {Number(log.cost_kes || 0).toFixed(3)}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-brand-ivory/40">
                    No token activity recorded yet for this billing cycle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

