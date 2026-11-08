import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PlannerErrorBoundary } from "@/components/planner/PlannerErrorBoundary";

export const metadata: Metadata = {
  title: "Room Planner | MarvelRise Decor",
  description:
    "Design your space: enter your room measurements, choose SPC flooring colours, and watch planks laid in real time. Get an instant box count for your quote.",
};

const DynamicPlannerShell = dynamic(
  () => import("@/components/planner/PlannerShell").then((m) => m.PlannerShell),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 top-[72px] sm:top-[80px] bg-brand-navy flex flex-col items-center justify-center z-40">
        <div className="w-12 h-12 rounded-sm bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center animate-pulse mb-4">
          <div className="w-4 h-4 rounded-full bg-brand-gold" />
        </div>
        <p className="text-xs font-mono text-brand-gold uppercase tracking-widest font-semibold">
          Initializing Architectural Studio...
        </p>
        <p className="text-[10px] font-sans text-brand-ivory/50 mt-1">
          Loading orthographic cutaway engine
        </p>
      </div>
    ),
  }
);

export default function PlannerPage() {
  return (
    <PlannerErrorBoundary>
      <DynamicPlannerShell />
    </PlannerErrorBoundary>
  );
}
