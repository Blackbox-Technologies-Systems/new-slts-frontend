"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { ViolationStatsCard } from "@/components/dashboard/ViolationStatsCard";
import { RevenueStatsCard } from "@/components/dashboard/RevenueStatsCard";
import { ViolationsTable } from "@/components/dashboard/ViolationsTable";
import { RevenueAlert } from "@/components/dashboard/RevenueAlert";
import type { DashboardStat, Violation } from "@/types";

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
// Would replace these with API calls when ready

const TOP_STATS: DashboardStat[] = [
	{
		title: "Total Violations",
		value: 20584,
		change: { value: 12, trend: "up" },
		icon: "BarChart3",
	},
	{
		title: "Approved Violations",
		value: 13908,
		change: { value: 12, trend: "up" },
		icon: "CheckCircle2",
	},
	{
		title: "Disputed Violations",
		value: 268,
		change: { value: 3, trend: "down" },
		icon: "AlertTriangle",
		variant: "danger",
	},
	{
		title: "Total Unique Offenders",
		value: 191,
		change: { value: 18, trend: "up" },
		suffix: "Repeat",
		icon: "Users",
	},
];

const REVENUE_STATS = [
	{
		label: "Revenue Generated",
		value: "7,752,000",
		subtitle: "From 13,908 violations",
		icon: "wallet" as const,
	},
	{
		label: "Revenue Collected",
		value: "38,000",
		icon: "clock" as const,
	},
	{
		label: "Outstanding",
		value: "7,713,200",
		subtitle: "847 overdue",
		icon: "activity" as const,
	},
	{
		label: "Activity (24h)",
		value: "3,600",
		icon: "trending" as const,
		miniChart: true,
	},
];

const VIOLATIONS_DATA: Violation[] = [
	{
		id: "v1",
		sn: 1,
		offender: {
			id: "o1",
			name: "John Wick",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=John",
		},
		pcn: "EDTKT74764",
		offenseType: "Obstruction on Highway",
		plateNo: "ABC-123-DE",
		amount: 5000,
		violationDate: "2020-05-15T08:30:00Z",
		status: "rejected",
	},
	{
		id: "v2",
		sn: 2,
		offender: {
			id: "o2",
			name: "Muneerah A.",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Muneerah",
		},
		pcn: "EDTKT74764",
		offenseType: "Traffic Light Violation",
		plateNo: "FNS-427-P",
		amount: 10000,
		violationDate: "2020-05-15T09:30:00Z",
		status: "submitted",
	},
	{
		id: "v3",
		sn: 3,
		offender: {
			id: "o3",
			name: "David Oshodi",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
		},
		pcn: "LAG482910",
		offenseType: "Illegal Parking",
		plateNo: "KJA-821-AA",
		amount: 5000,
		violationDate: "2020-05-15T11:30:00Z",
		status: "approved",
	},
	// Generate more dummy data for pagination
	...Array.from({ length: 20581 }, (_, i) => ({
		id: `v${i + 4}`,
		sn: i + 4,
		offender: {
			id: `o${i + 4}`,
			name: `Offender ${i + 4}`,
			avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${i + 4}`,
		},
		pcn: `PCN${100000 + i}`,
		offenseType: [
			"Speeding",
			"Illegal Parking",
			"Traffic Light Violation",
			"Obstruction",
		][i % 4],
		plateNo: `PLT-${1000 + i}`,
		amount: [5000, 10000, 20000][i % 3],
		violationDate: new Date(
			Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
		).toISOString(),
		status: (["submitted", "approved", "rejected", "pending"] as const)[i % 4],
	})),
];

export default function DashboardPage() {
	return (
		<div className="space-y-6 animate-fade-in">
			<PageHeader title="Dashboard" />

			{/* Top Stats Row - Total Violations, Approved, Disputed, Offenders */}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{TOP_STATS.map((stat) => (
					<ViolationStatsCard key={stat.title} stat={stat} />
				))}
			</div>

			{/* Revenue Stats Row */}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{REVENUE_STATS.map((revenue) => (
					<RevenueStatsCard
						key={revenue.label}
						label={revenue.label}
						value={revenue.value}
						subtitle={revenue.subtitle}
						icon={revenue.icon}
						miniChart={revenue.miniChart}
					/>
				))}
			</div>

			{/* Recent Violations Table */}
			<ViolationsTable violations={VIOLATIONS_DATA} />

			{/* Revenue Alert */}
			<RevenueAlert />
		</div>
	);
}
