"use client";

import React, { useState, useEffect } from "react";
import type { LeadScoreWeight } from "@/types/admin";
import { Sliders, Save, CheckCircle2, ShieldAlert } from "lucide-react";

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
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold">
          Rules & Weights
        </span>
        <h1 className="font-display text-3xl uppercase tracking-wider text-brand-ivory font-light mt-1">
          Lead Scoring Rules & Algorithm Weights
        </h1>
        <p className="text-xs font-sans text-brand-ivory/60 mt-1">
          Adjust the point value awarded for each buyer behavior. Leads are automatically scored from 0 to 100, tagged as Hot (≥70), Warm (≥40), or Cold (&lt;40).
        </p>
      </div>

      <div className="p-6 rounded-sm bg-brand-navy-card border border-brand-gold/20 space-y-4">
        <div className="divide-y divide-brand-gold/10">
          {weights.map((w) => (
            <div
              key={w.key}
              className="py-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs font-mono text-brand-ivory font-medium block">
                  {w.label}
                </span>
                <span className="text-[10px] font-mono text-brand-ivory/40">
                  Key: {w.key}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-brand-gold font-bold">+</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={w.points}
                    onChange={(e) => handlePointsChange(w.key, Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 rounded-sm bg-brand-navy border border-brand-gold/30 text-brand-ivory text-xs font-mono font-bold text-center focus:border-brand-gold focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-brand-ivory/40">pts</span>
                </div>

                <button
                  onClick={() => saveWeight(w)}
                  disabled={savingKey === w.key}
                  className="px-3.5 py-1.5 rounded-sm bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold border border-brand-gold/40 text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {successKey === w.key ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Saved</span>
                    </span>
                  ) : savingKey === w.key ? (
                    <span>Saving...</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      <span>Update</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {weights.length === 0 && !loading && (
          <div className="py-8 text-center text-xs font-mono text-brand-ivory/40">
            No custom weights configured.
          </div>
        )}
      </div>
    </div>
  );
}

