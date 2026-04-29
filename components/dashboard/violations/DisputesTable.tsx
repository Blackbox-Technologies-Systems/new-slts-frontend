"use client";

import { useMemo } from "react";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Eye } from "lucide-react";
import { cn, formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	BaseTable,
	BaseTableColumn,
} from "@/components/dashboard/shared/BaseTable";
import { useLocalTableData } from "@/hooks/useLocalTableData";
import type { Dispute, DisputeStatus } from "@/types";

interface DisputesTableProps {
	disputes: Dispute[];
	className?: string;
	showFilters?: boolean;
	title?: string;
}

const DISPUTE_STATUS_STYLES: Record<DisputeStatus, string> = {
	under_review: "border-red-400 text-red-500 bg-transparent",
	escalated: "bg-amber-50 text-amber-600 border-amber-200",
	upheld: "bg-emerald-50 text-emerald-600 border-emerald-200",
	open: "border-slate-400 text-slate-500 bg-transparent",
	overturned: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
	under_review: "Under Review",
	escalated: "Escalated",
	upheld: "Upheld",
	open: "Open",
	overturned: "Overturned",
};

export function DisputesTable({
	disputes,
	className,
	showFilters = false,
	title = "Dispute Records",
}: DisputesTableProps) {
	const {
		currentPage,
		setCurrentPage,
		searchQuery,
		setSearchQuery,
		dateRange,
		setDateRange,
		totalPages,
		totalItems,
		paginatedData,
	} = useLocalTableData<Dispute>({
		data: disputes,
		itemsPerPage: 10,
		filterFn: (d, query, range) => {
			// Text Filter
			const matchesSearch =
				!showFilters ||
				!query ||
				d.offender.name.toLowerCase().includes(query.toLowerCase()) ||
				d.pcn.toLowerCase().includes(query.toLowerCase()) ||
				d.offenseType.toLowerCase().includes(query.toLowerCase()) ||
				d.plateNo.toLowerCase().includes(query.toLowerCase());

			// Date Filter
			let matchesDate = true;
			if (range?.from) {
				const disputeDate = new Date(d.disputeDate);
				const fromDate = startOfDay(range.from);
				const toDate = range.to ? endOfDay(range.to) : endOfDay(range.from);
				matchesDate = isWithinInterval(disputeDate, {
					start: fromDate,
					end: toDate,
				});
			}

			return matchesSearch && matchesDate;
		},
	});

	const columns: BaseTableColumn[] = [
		{ key: "sn", label: "S/N" },
		{ key: "offender", label: "OFFENDER NAME" },
		{ key: "pcn", label: "PCN" },
		{ key: "offenseType", label: "OFFENCE TYPE" },
		{ key: "plateNo", label: "PLATE NO." },
		{ key: "disputeDate", label: "DISPUTE DATE" },
		{ key: "amount", label: "AMOUNT" },
		{ key: "status", label: "DISPUTE STATUS" },
		{ key: "actions", label: "ACTION", className: "w-24" },
	];

	const renderRow = (dispute: Dispute, index: number) => {
		const rowBgClass = index % 2 === 1 ? "bg-background" : "";

		return (
			<tr key={dispute.id} className={cn("transition-colors", rowBgClass)}>
				<td className="px-4 py-4 text-sm text-muted-foreground">
					{dispute.sn}
				</td>
				<td className="px-4 py-4">
					<span className="text-sm font-medium text-primary">
						{dispute.offender.name}
					</span>
				</td>
				<td className="px-4 py-4">
					<span className="text-sm text-muted-foreground">{dispute.pcn}</span>
				</td>
				<td className="px-4 py-4">
					<span className="text-sm text-primary">{dispute.offenseType}</span>
				</td>
				<td className="px-4 py-4">
					<span className="text-sm font-bold">{dispute.plateNo}</span>
				</td>
				<td className="px-4 py-4">
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							{formatDate(dispute.disputeDate)}
						</span>
						<span className="text-xs text-muted-foreground">
							{formatTime(dispute.disputeDate)}
						</span>
					</div>
				</td>
				<td className="px-4 py-4">
					<span className="text-sm font-bold text-primary">
						₦{formatCurrency(dispute.amount)}
					</span>
				</td>
				<td className="px-4 py-4">
					<Badge
						variant="outline"
						className={cn(
							"text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap",
							DISPUTE_STATUS_STYLES[dispute.status],
						)}
					>
						{DISPUTE_STATUS_LABELS[dispute.status]}
					</Badge>
				</td>
				<td className="px-4 py-4">
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-muted-foreground hover:text-primary"
						>
							<Eye className="h-4 w-4" />
						</Button>
					</div>
				</td>
			</tr>
		);
	};

	return (
		<BaseTable<Dispute>
			title={title}
			data={paginatedData}
			columns={columns}
			className={className}
			renderRow={renderRow}
			showFilters={showFilters}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
			searchPlaceholder="Search by name, PCN..."
			dateRange={dateRange}
			onDateChange={setDateRange}
			currentPage={currentPage}
			totalPages={totalPages}
			totalItems={totalItems}
			onPageChange={setCurrentPage}
		/>
	);
}
