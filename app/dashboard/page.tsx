"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { ViolationStatsCard } from "@/components/dashboard/ViolationStatsCard";
import { RevenueStatsCard } from "@/components/dashboard/RevenueStatsCard";
import {
	BaseTable,
	BaseTableColumn,
} from "@/components/dashboard/shared/BaseTable";
import { RevenueAlert } from "@/components/dashboard/shared/RevenueAlert";
import { useLocalTableData } from "@/hooks/useLocalTableData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DashboardStat, Violation, ViolationStatus } from "@/types";

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
// Would replace these with API calls when ready

const TOP_STATS: DashboardStat[] = [
	{
		title: "Total Violations",
		value: 20584,
		change: { value: 12, trend: "up" },
		icon: "ChartNoAxesColumn",
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
		change: { value: 18 },
		suffix: "Repeat",
		icon: "Users",
	},
];

const REVENUE_STATS = [
	{
		label: "Revenue Generated",
		value: "7,752,000",
		subtitle: "From 13,908 violations",
		icon: "money" as const,
	},
	{
		label: "Revenue Collected",
		value: "38,000",
		icon: "wallet" as const,
		progress: { value: 3, label: "₦5,000 of ₦100k collected" },
	},
	{
		label: "Outstanding",
		value: "7,713,200",
		subtitle: "847 overdue",
		icon: "clock" as const,
	},
	{
		label: "Activity (24h)",
		value: "3,600",
		icon: "activity" as const,
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
		status: (["submitted", "approved", "rejected"] as const)[i % 3],
	})),
];

const STATUS_STYLES: Record<ViolationStatus, string> = {
	submitted: "bg-slate-100 text-slate-700 border-slate-200",
	approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
	rejected: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<ViolationStatus, string> = {
	submitted: "Submitted",
	approved: "Approved",
	rejected: "Rejected",
};

const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date
		.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		})
		.toUpperCase();
};

const formatTime = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
};

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-NG").format(amount);
};

export default function DashboardPage() {
	const { currentPage, totalPages, totalItems, paginatedData, setCurrentPage } =
		useLocalTableData<Violation>({
			data: VIOLATIONS_DATA,
			itemsPerPage: 5, // Keep it compact for the dashboard overview
		});

	const columns: BaseTableColumn[] = [
		{ key: "sn", label: "S/N" },
		{ key: "offender", label: "OFFENDER NAME" },
		{ key: "pcn", label: "PCN" },
		{ key: "offenseType", label: "OFFENSE TYPE" },
		{ key: "plateNo", label: "PLATE NO." },
		{ key: "amount", label: "AMOUNT" },
		{ key: "violationDate", label: "VIOLATION DATE" },
		{ key: "status", label: "STATUS" },
	];

	const renderRow = (violation: Violation, index: number) => {
		const rowBgClass = index % 2 === 1 ? "bg-background" : "";
		return (
			<tr key={violation.id} className={cn("transition-colors", rowBgClass)}>
				<td className="px-4 py-4 text-sm text-muted-foreground">
					{violation.sn}
				</td>
				<td className="px-4 py-4">
					<span className="text-sm font-medium text-primary">
						{violation.offender.name}
					</span>
				</td>
				<td className="px-4 py-4">
					<span className="text-sm text-muted-foreground">{violation.pcn}</span>
				</td>
				<td className="px-4 py-4">
					<span className="text-sm text-primary">{violation.offenseType}</span>
				</td>
				<td className="px-4 py-4">
					<span className="text-sm font-bold">{violation.plateNo}</span>
				</td>
				<td className="px-4 py-4">
					<span className="text-sm font-bold text-primary">
						₦{formatCurrency(violation.amount)}
					</span>
				</td>
				<td className="px-4 py-4">
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							{formatDate(violation.violationDate)}
						</span>
						<span className="text-xs text-muted-foreground">
							{formatTime(violation.violationDate)}
						</span>
					</div>
				</td>
				<td className="px-4 py-4">
					<Badge
						variant="outline"
						className={cn(
							"text-xs font-medium px-2.5 py-0.5 rounded-full",
							STATUS_STYLES[violation.status],
						)}
					>
						{STATUS_LABELS[violation.status]}
					</Badge>
				</td>
			</tr>
		);
	};

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
						progress={revenue.progress}
					/>
				))}
			</div>

			{/* Recent Violations Table */}
			<BaseTable<Violation>
				title="Recent Violations"
				data={paginatedData}
				columns={columns}
				renderRow={renderRow}
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={totalItems}
				itemsPerPage={5}
				onPageChange={setCurrentPage}
			/>

			{/* Revenue Alert */}
			<RevenueAlert />
		</div>
	);
}
