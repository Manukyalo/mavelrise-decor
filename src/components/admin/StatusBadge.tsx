import React from "react";
import type { LeadStatus } from "@/types/admin";
import { CheckCircle2, Clock, MessageSquare, Calendar, Award, XCircle, FileText } from "lucide-react";

interface StatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const configs: Record<
    LeadStatus,
    { label: string; icon: React.ElementType; styles: string }
  > = {
    quote_created: {
      label: "Quote Created",
      icon: FileText,
      styles: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    },
    quote_viewed: {
      label: "Proposal Viewed",
      icon: Clock,
      styles: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    },
    whatsapp_sent: {
      label: "WhatsApp Sent",
      icon: MessageSquare,
      styles: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    },
    visit_booked: {
      label: "Survey Booked",
      icon: Calendar,
      styles: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    sample_booked: {
      label: "Sample Booked",
      icon: Calendar,
      styles: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    won: {
      label: "Won Deal",
      icon: Award,
      styles: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    },
    lost: {
      label: "Lost",
      icon: XCircle,
      styles: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    },
  };

  const config = configs[status] || configs.quote_created;
  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 gap-1"
      : "text-[11px] px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border whitespace-nowrap ${sizeClasses} ${config.styles}`}
    >
      <Icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      <span>{config.label}</span>
    </span>
  );
}

