import React from "react";
import type { Metadata } from "next";
import { PlannerShell } from "@/components/planner/PlannerShell";

export const metadata: Metadata = {
  title: "Room Planner | MarvelRise Decor",
  description:
    "Design your space: enter your room measurements, choose SPC flooring colours, and watch planks laid in real time. Get an instant box count for your quote.",
};

export default function PlannerPage() {
  return <PlannerShell />;
}

