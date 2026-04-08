"use client";

import { cn } from "@/lib/utils";
import { Wallet, Clock, Activity, TrendingUp } from "lucide-react";

interface RevenueStatsCardProps {
  label: string;
  value: string;
  prefix?: string;
  subtitle?: string;
  icon?: "wallet" | "clock" | "activity" | "trending";
  miniChart?: boolean;
  className?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  wallet: <Wallet className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
  activity: <Activity className="h-4 w-4" />,
  trending: <TrendingUp className="h-4 w-4" />,
};

export function RevenueStatsCard({
  label,
  value,
  prefix = "₦",
  subtitle,
  icon = "wallet",
  miniChart = false,
  className,
}: RevenueStatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-5 shadow-sm flex flex-col",
        "dark:bg-card dark:border-border",
        className
      )}
    >
      {/* Label with icon */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {ICON_MAP[icon] || <Wallet className="h-4 w-4" />}
        </div>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-semibold text-muted-foreground">{prefix}</span>
        <span className="text-3xl font-bold tracking-tight">{value}</span>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-2">{subtitle}</p>
      )}

      {/* Mini bar chart */}
      {miniChart && (
        <div className="mt-4 flex items-end gap-1 h-8">
          {[30, 45, 25, 60, 40, 55, 35, 50, 45, 65].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/80 rounded-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
