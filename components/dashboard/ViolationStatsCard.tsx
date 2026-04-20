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
	ChartNoAxesColumn,
} from "lucide-react";
import type { DashboardStat } from "@/types";

const ICON_MAP: Record<string, React.ReactNode> = {
	BarChart3: <BarChart3 className="h-5 w-5" />,
	ChartNoAxesColumn: <ChartNoAxesColumn className="h-5 w-5" />,
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
		<div className={`rounded-2xl bg-card p-4 dark:border-border ${className}`}>
			<div className="flex items-start">
				<div className="flex-1">
					{/* Title row with icon and change indicator */}
					<div className="flex justify-between gap-2 mb-3">
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full p-2	bg-icon-accent text-primary`}
						>
							{ICON_MAP[stat.icon] || <BarChart3 className="h-5 w-5" />}
						</div>
						{stat.change && (
							<div className="flex items-center gap-1 text-xs h-8 font-medium px-1.5 py-0 rounded-3xl bg-icon-accent">
								{stat.change.trend === "up" ? (
									<ArrowUp className="h-3 w-3" />
								) : stat.change.trend === "down" ? (
									<ArrowDown className="h-3 w-3" />
								) : null}
								<span>
									{stat.change.trend === "up"
										? "+"
										: stat.change.trend === "down"
											? "-"
											: ""}
									{stat.change.value}
									{stat.change.trend === "up" || stat.change.trend === "down"
										? "%"
										: ""}
									{stat.suffix ? ` ${stat.suffix}` : ""}
								</span>
							</div>
						)}
					</div>

					{/* Value */}
					<div className="inline-flex items-baseline gap-1">
						{stat.prefix && (
							<span className="text-lg font-semibold text-primary">
								{stat.prefix}
							</span>
						)}
						<span className="text-3xl font-semibold text-primary">
							{formatValue(stat.value)}
						</span>
					</div>

					{/* Title */}
					<p className="text-sm text-muted-foreground mt-3">{stat.title}</p>
				</div>
			</div>
		</div>
	);
}
