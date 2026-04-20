"use client";

import { Wallet, Clock, Activity, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
	/** Value between 0–100 representing percentage filled */
	value: number;
	/** Optional accessible label, e.g. "₦38,000 of ₦95.8M collected" */
	label?: string;
}

interface RevenueStatsCardProps {
	label: string;
	value: string;
	prefix?: string;
	subtitle?: string;
	icon?: "money" | "wallet" | "clock" | "activity";
	miniChart?: boolean;
	/** When provided, renders a progress bar at the bottom of the card */
	progress?: ProgressBarProps;
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
	progress,
	className,
}: RevenueStatsCardProps) {
	const progressValue = progress
		? Math.min(100, Math.max(0, progress.value))
		: 0;

	return (
		<div
			className={cn(
				"rounded-2xl bg-card border-l-4 border-primary pt-4 px-4 dark:bg-card dark:border-border",
				progress || miniChart ? "pb-0" : "pb-0",
				className,
			)}
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
				<span className="text-2xl font-bold text-primary tracking-tighter">
					{prefix}
					{value}
				</span>
			</div>

			{/* Subtitle */}
			{subtitle && (
				<p className="text-xs text-muted-foreground mt-3">{subtitle}</p>
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

			{/* Optional Progress Bar */}
			{progress && (
				<div className="mt-3">
					<div
						role="progressbar"
						aria-valuenow={progressValue}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label={progress.label ?? `${progressValue}% progress`}
						className="h-1.5 w-full rounded-full bg-[#F3F4F6] overflow-hidden"
					>
						<div
							className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
							style={{ width: `${progressValue}%` }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
