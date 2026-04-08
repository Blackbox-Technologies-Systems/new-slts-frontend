"use client";

import { cn } from "@/lib/utils";
import {
	BarChart3,
	CheckCircle2,
	AlertTriangle,
	Users,
	Wallet,
	Clock,
	Activity,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import type { DashboardStat } from "@/types";

const ICON_MAP: Record<string, React.ReactNode> = {
	BarChart3: <BarChart3 className="h-5 w-5" />,
	CheckCircle2: <CheckCircle2 className="h-5 w-5" />,
	AlertTriangle: <AlertTriangle className="h-5 w-5" />,
	Users: <Users className="h-5 w-5" />,
	Wallet: <Wallet className="h-5 w-5" />,
	Clock: <Clock className="h-5 w-5" />,
	Activity: <Activity className="h-5 w-5" />,
};

interface ViolationStatsCardProps {
	stat: DashboardStat;
	className?: string;
}

export function ViolationStatsCard({
	stat,
	className,
}: ViolationStatsCardProps) {
	const formatValue = (value: number) => {
		return new Intl.NumberFormat("en-US").format(value);
	};

	return (
		<div
			className={cn(
				"rounded-xl bg-white p-5 shadow-sm",
				"dark:bg-card dark:border-border",
				className,
			)}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					{/* Title row with icon and change indicator */}
					<div className="flex justify-between gap-2 mb-3">
						<div
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-lg",
								stat.variant === "danger"
									? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
									: "bg-primary/10 text-primary",
							)}
						>
							{ICON_MAP[stat.icon] || <BarChart3 className="h-5 w-5" />}
						</div>
						{stat.change && (
							<div className="flex items-center gap-1 text-xs font-medium p-2 rounded-3xl bg-muted">
								{stat.change.trend === "up" ? (
									<ArrowUp className="h-3 w-3" />
								) : (
									<ArrowDown className="h-3 w-3" />
								)}
								<span>
									{stat.change.trend === "up" ? "+" : "-"}
									{stat.change.value}%
								</span>
							</div>
						)}
					</div>

					{/* Value */}
					<div className="flex items-baseline gap-1">
						{stat.prefix && (
							<span className="text-lg font-semibold text-muted-foreground">
								{stat.prefix}
							</span>
						)}
						<span className="text-2xl font-bold tracking-tight">
							{formatValue(stat.value)}
						</span>
					</div>

					{/* Title */}
					<p className="text-sm text-muted-foreground mt-1">{stat.title}</p>

					{/* Subtitle */}
					{stat.subtitle && (
						<p className="text-xs text-muted-foreground/70 mt-1">
							{stat.subtitle}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
