import React from "react";
import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center rounded-xl bg-admin-surface border border-dashed border-admin-border flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-admin-surface-raised border border-admin-border flex items-center justify-center text-admin-gold mb-3.5 shadow-sm">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="font-sans font-semibold text-base text-admin-text mb-1">
        {title}
      </h3>

      <p className="text-xs text-admin-text-muted leading-relaxed max-w-xs mb-5">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-admin-gold hover:bg-admin-gold-hover text-brand-navy font-semibold text-xs transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

