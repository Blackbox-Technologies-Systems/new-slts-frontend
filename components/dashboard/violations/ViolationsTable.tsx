"use client";

import { useState, useMemo } from "react";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Eye, Edit2 } from "lucide-react";
import { cn, formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	BaseTable,
	BaseTableColumn,
} from "@/components/dashboard/shared/BaseTable";
import { useLocalTableData } from "@/hooks/useLocalTableData";
import { ResendPaymentModal } from "@/components/dashboard/violations/ResendPaymentModal";
import type { Violation, ViolationStatus } from "@/types";

interface ViolationsTableProps {
	violations: Violation[];
	className?: string;
	variant?: "compact" | "full";
	showFilters?: boolean;
	showCheckboxes?: boolean;
	showPaymentColumn?: boolean;
	showActions?: boolean;
	onCreateViolation?: () => void;
	title?: string;
}

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

const PAYMENT_STATUS_STYLES: Record<string, string> = {
	paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
	pending: "bg-amber-50 text-amber-700 border-amber-200",
	unpaid: "bg-red-50 text-red-700 border-red-200",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
	paid: "Paid",
	unpaid: "Unpaid",
	pending: "Pending",
};

export function ViolationsTable({
	violations,
	className,
	variant = "compact",
	showFilters = false,
	showCheckboxes = false,
	showPaymentColumn = false,
	showActions = false,
	title = "Recent Violations",
}: ViolationsTableProps) {
	const [isResendModalOpen, setIsResendModalOpen] = useState(false);

	// We will use the local table data helper hook for now
	// This would be changed to an api call later to fetch table data
	const {
		currentPage,
		setCurrentPage,
		searchQuery,
		setSearchQuery,
		dateRange,
		setDateRange,
		selectedRows,
		toggleRowSelection,
		toggleAllRows,
		clearSelection,
		totalPages,
		totalItems,
		paginatedData,
	} = useLocalTableData<Violation>({
		data: violations,
		itemsPerPage: 10,
		filterFn: (v, query, range) => {
			// Text Filter
			const matchesSearch =
				!showFilters ||
				!query ||
				v.offender.name.toLowerCase().includes(query.toLowerCase()) ||
				v.pcn.toLowerCase().includes(query.toLowerCase()) ||
				v.offenseType.toLowerCase().includes(query.toLowerCase()) ||
				v.plateNo.toLowerCase().includes(query.toLowerCase());

			// Date Filter
			let matchesDate = true;
			if (range?.from) {
				const violationDate = new Date(v.violationDate);
				const fromDate = startOfDay(range.from);
				const toDate = range.to ? endOfDay(range.to) : endOfDay(range.from);
				matchesDate = isWithinInterval(violationDate, {
					start: fromDate,
					end: toDate,
				});
			}

			return matchesSearch && matchesDate;
		},
	});

	const totalSelectedAmount = violations
		.filter((v) => selectedRows.has(v.id))
		.reduce((sum, v) => sum + v.amount, 0);

	// Build headers dynamically
	const columns: BaseTableColumn[] = [];
	columns.push(
		{ key: "sn", label: "S/N" },
		{ key: "offender", label: "OFFENDER NAME" },
		{ key: "pcn", label: "PCN" },
		{ key: "offenseType", label: "OFFENSE TYPE" },
		{ key: "plateNo", label: "PLATE NO." },
		{ key: "amount", label: "AMOUNT" },
		{ key: "violationDate", label: "VIOLATION DATE" },
		{ key: "status", label: "STATUS" },
	);

	if (showPaymentColumn) {
		columns.push({ key: "payment", label: "PAYMENT" });
	}

	if (showActions) {
		columns.push({ key: "actions", label: "ACTION", className: "w-24" });
	}

	// Row Renderer
	const renderRow = (violation: Violation, index: number) => {
		const isSelected = selectedRows.has(violation.id);
		const rowBgClass = index % 2 === 1 ? "bg-background" : "";

		return (
			<tr key={violation.id} className={cn("transition-colors", rowBgClass)}>
				{showCheckboxes && (
					<td className="px-4 py-4">
						<input
							type="checkbox"
							checked={isSelected}
							onChange={() => toggleRowSelection(violation.id)}
							className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
							aria-label={`Select row ${violation.sn}`}
						/>
					</td>
				)}
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
				{showPaymentColumn && (
					<td className="px-4 py-4">
						<Badge
							variant="outline"
							className={cn(
								"text-xs font-medium px-2.5 py-0.5 rounded-full",
								PAYMENT_STATUS_STYLES[violation.paymentStatus || "unpaid"],
							)}
						>
							{PAYMENT_STATUS_LABELS[violation.paymentStatus || "unpaid"]}
						</Badge>
					</td>
				)}
				{showActions && (
					<td className="px-4 py-4">
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-muted-foreground hover:text-primary"
							>
								<Eye className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-muted-foreground hover:text-primary"
							>
								<Edit2 className="h-4 w-4" />
							</Button>
						</div>
					</td>
				)}
			</tr>
		);
	};

	// Bulk Actions Component Injection
	const renderBulkActions = () => {
		if (selectedRows.size === 0) return null;

		return (
			<div className="bg-primary rounded-lg shadow-xl px-6 py-4 flex items-center justify-between text-white z-40 animate-in slide-in-from-bottom-5 w-full">
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						<span className="font-medium">
							{selectedRows.size} violation{selectedRows.size !== 1 ? "s" : ""}{" "}
							selected
						</span>
					</div>
					<div className="hidden sm:block h-6 w-px bg-primary/20" />
					<div className="font-semibold hidden sm:block">
						Total ₦{formatCurrency(totalSelectedAmount)}
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="font-semibold sm:hidden mr-2">
						Total ₦{formatCurrency(totalSelectedAmount)}
					</div>
					<Button
						variant="outline"
						className="bg-transparent border-muted-foreground text-white hover:bg-primary/80 hover:text-white"
						onClick={clearSelection}
					>
						Clear Selection
					</Button>
					<Button
						className="bg-white text-primary hover:bg-slate-200 hover:text-primary cursor-pointer"
						onClick={() => setIsResendModalOpen(true)}
					>
						{selectedRows.size} Violation{selectedRows.size !== 1 ? "s" : ""}{" "}
						Resend Payment Link
					</Button>
				</div>
			</div>
		);
	};

	// Check if all selected violations belong to the same offender
	const isSameUser = useMemo(() => {
		if (selectedRows.size <= 1) return true;

		const selectedViolationsList = violations.filter((v) =>
			selectedRows.has(v.id),
		);
		if (selectedViolationsList.length === 0) return true;

		const firstOffenderId = selectedViolationsList[0].offender.id;
		return selectedViolationsList.every(
			(v) => v.offender.id === firstOffenderId,
		);
	}, [selectedRows, violations]);

	return (
		<>
			<BaseTable<Violation>
				title={title}
				data={paginatedData}
				columns={columns}
				className={className}
				renderRow={renderRow}
				showFilters={showFilters}
				showCheckboxes={showCheckboxes}
				selectedIds={selectedRows}
				onToggleAll={toggleAllRows}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				searchPlaceholder="Search by name, PCN..."
				dateRange={dateRange}
				onDateChange={setDateRange}
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={totalItems}
				onPageChange={setCurrentPage}
				renderBulkActions={renderBulkActions}
			/>

			<ResendPaymentModal
				isOpen={isResendModalOpen}
				onClose={() => setIsResendModalOpen(false)}
				selectedCount={selectedRows.size}
				isSameUser={isSameUser}
				onSend={(email, phone) => {
					console.log(
						`Sending payment links to ${selectedRows.size} violations`,
						{ email, phone },
					);
					clearSelection();
				}}
			/>
		</>
	);
}
