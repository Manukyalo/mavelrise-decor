"use client";

import React, { useState, useEffect } from "react";
import type { LeadScoreWeight } from "@/types/admin";
import { Sliders, Save, CheckCircle2, RotateCw } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

export default function AdminSettingsPage() {
  const [weights, setWeights] = useState<LeadScoreWeight[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setWeights(data.weights || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePointsChange = (key: string, newPts: number) => {
    setWeights((prev) =>
      prev.map((w) => (w.key === key ? { ...w, points: newPts } : w))
    );
  };

  const saveWeight = async (weight: LeadScoreWeight) => {
    setSavingKey(weight.key);
    setSuccessKey(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: weight.key, points: weight.points }),
      });
      if (res.ok) {
        setSuccessKey(weight.key);
        setTimeout(() => setSuccessKey(null), 2500);
      }
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-medium tracking-wider text-admin-gold uppercase">
            Rules & Qualification Logic
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-admin-text tracking-tight mt-1">
            Lead Scoring & Algorithm Weights
          </h1>
          <p className="text-xs sm:text-sm text-admin-text-muted font-sans mt-1">
            Assign point allocations to behavioral triggers. Leads are ranked 0–100 and classified into Hot (≥70), Warm (≥40), and Cold (&lt;40).
          </p>
        </div>

        <button
          onClick={fetchWeights}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-center px-3.5 py-2 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-border-gold text-xs font-sans font-medium text-admin-text transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 text-admin-gold ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Weights</span>
        </button>
      </div>

      {/* Threshold Explainer Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-admin-surface border border-admin-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-emerald-400">≥70</span>
          </div>
          <div>
            <span className="text-xs font-sans font-semibold text-admin-text block">Hot Opportunity</span>
            <span className="text-xs text-admin-text-muted">Auto-flagged for 15-minute phone callback</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-admin-surface border border-admin-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-amber-400">40-69</span>
          </div>
          <div>
            <span className="text-xs font-sans font-semibold text-admin-text block">Warm Prospect</span>
            <span className="text-xs text-admin-text-muted">WhatsApp follow-up reminder after 24 hrs</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-admin-surface border border-admin-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-500/10 border border-slate-500/30 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-slate-400">&lt;40</span>
          </div>
          <div>
            <span className="text-xs font-sans font-semibold text-admin-text block">Cold Exploration</span>
            <span className="text-xs text-admin-text-muted">Anonymous room quote browsing</span>
          </div>
        </div>
      </div>

      {/* Weights Configuration Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-admin-surface border border-admin-border space-y-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-4 h-4 text-admin-gold" />
          <h2 className="font-serif text-lg text-admin-text font-light tracking-tight">
            Trigger Weights Table
          </h2>
        </div>

        <div className="divide-y divide-admin-border/60">
          {weights.map((w) => (
            <div
              key={w.key}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
            >
              <div>
                <span className="text-xs sm:text-sm font-sans font-medium text-admin-text block">
                  {w.label}
                </span>
                <span className="text-[11px] font-mono text-admin-text-muted/60">
                  Event Identifier: {w.key}
                </span>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-admin-gold font-bold">+</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={w.points}
                    onChange={(e) => handlePointsChange(w.key, Number(e.target.value))}
                    className="w-16 px-2.5 py-1.5 rounded-lg bg-admin-surface-raised border border-admin-border focus:border-admin-border-gold text-admin-text text-xs font-mono font-bold text-center tabular-nums focus:outline-none transition-colors"
                  />
                  <span className="text-xs font-mono text-admin-text-muted">pts</span>
                </div>

                <button
                  onClick={() => saveWeight(w)}
                  disabled={savingKey === w.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-gold/15 hover:bg-admin-gold/25 text-admin-gold border border-admin-gold/40 text-xs font-sans font-medium transition-colors disabled:opacity-50"
                >
                  {successKey === w.key ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Saved</span>
                    </>
                  ) : savingKey === w.key ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Update</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {weights.length === 0 && !loading && (
          <div className="py-8 text-center text-xs text-admin-text-muted font-sans">
            No custom weights configured.
          </div>
        )}
      </div>
    </div>
  );
}
