import React from "react";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  subValue?: string;
  icon: LucideIcon;
  badgeText?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  badgeText,
  highlight = false,
}) => {
  return (
    <div
      className={`bg-surface border rounded-xl p-6 space-y-4 transition-all hover:border-accent/40 ${
        highlight ? "border-accent/30 shadow-lg shadow-accent/5" : "border-surface-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase font-semibold tracking-widest text-secondary">
          {label}
        </span>
        <div className="p-2.5 rounded-lg bg-surface-raised border border-surface-border text-accent">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-primary">
          {value}
        </div>
        {subValue && (
          <p className="text-xs text-secondary font-medium">
            {subValue}
          </p>
        )}
      </div>

      {badgeText && (
        <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between text-[11px]">
          <span className="text-accent flex items-center space-x-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>{badgeText}</span>
          </span>
          <span className="text-secondary/60 text-[10px]">Active</span>
        </div>
      )}
    </div>
  );
};
