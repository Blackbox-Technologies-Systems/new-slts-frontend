"use client";

import { Wallet, Clock, Activity, Banknote } from "lucide-react";

interface RevenueStatsCardProps {
	label: string;
	value: string;
	prefix?: string;
	subtitle?: string;
	icon?: "money" | "wallet" | "clock" | "activity";
	miniChart?: boolean;
	className?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
	money: <Banknote className="h-4 w-4" />,
	wallet: <Wallet className="h-4 w-4" />,
	clock: <Clock className="h-4 w-4" />,
	activity: <Activity className="h-4 w-4" />,
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
			className={`rounded-2xl bg-card border-l-4 border-primary p-4 dark:bg-card dark:border-border ${className}`}
		>
			{/* Label with icon */}
			<div className="flex items-center gap-2 mb-3">
				<div className="flex h-6 w-6 items-center justify-center text-primary">
					{ICON_MAP[icon] || <Wallet className="h-4 w-4" />}
				</div>
				<span className="text-sm text-primary font-medium">{label}</span>
			</div>

			{/* Value */}
			<div className="flex items-baseline gap-1">
				{/* <span className="text-4xl font-semibold text-primary">{prefix}</span> */}
				<span className="text-4xl font-bold text-primary tracking-tight">
					{prefix}
					{value}
				</span>
			</div>
			{/* Subtitle */}
			{subtitle && (
				<p className="text-xs text-muted-foreground/70 mt-2">{subtitle}</p>
			)}

			{/* Mini bar chart */}
			{miniChart && (
				<div className="mt-4 flex items-end gap-1 h-8">
					{[30, 45, 25, 60, 40, 55, 35, 50].map((height, i) => (
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
