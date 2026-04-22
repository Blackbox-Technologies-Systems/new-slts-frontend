"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
	ChevronLeft,
	ChevronRight,
	Search,
	Download,
	Filter,
	Eye,
	Edit2,
	Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ResendPaymentModal } from "@/components/dashboard/ResendPaymentModal";
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
	// unpaid: "bg-slate-100 text-slate-700 border-slate-200",
	pending: "bg-amber-50 text-amber-700 border-amber-200",
	unpaid: "bg-red-50 text-red-700 border-red-200",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
	paid: "Paid",
	unpaid: "Unpaid",
	pending: "Pending",
};

const getRowClass = (rowIndex: number) => {
	return rowIndex % 2 === 1 ? "bg-background" : "";
};

export function ViolationsTable({
	violations,
	className,
	variant = "compact",
	showFilters = false,
	showCheckboxes = false,
	showPaymentColumn = false,
	showActions = false,
	onCreateViolation,
	title = "Recent Violations",
}: ViolationsTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [isResendModalOpen, setIsResendModalOpen] = useState(false);
	const itemsPerPage = 10;

	// Calculate selected amount
	const totalSelectedAmount = violations
		.filter((v) => selectedRows.has(v.id))
		.reduce((sum, v) => sum + v.amount, 0);

	// Filter violations based on search query and date range
	const filteredViolations = violations.filter((v) => {
		// Text filter
		const matchesSearch =
			!showFilters ||
			!searchQuery ||
			v.offender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			v.pcn.toLowerCase().includes(searchQuery.toLowerCase()) ||
			v.offenseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
			v.plateNo.toLowerCase().includes(searchQuery.toLowerCase());

		// Date filter
		let matchesDate = true;
		if (dateRange?.from) {
			const violationDate = new Date(v.violationDate);
			const fromDate = startOfDay(dateRange.from);
			const toDate = dateRange.to
				? endOfDay(dateRange.to)
				: endOfDay(dateRange.from);
			matchesDate = isWithinInterval(violationDate, {
				start: fromDate,
				end: toDate,
			});
		}

		return matchesSearch && matchesDate;
	});

	const totalPages = Math.ceil(filteredViolations.length / itemsPerPage);

	const paginatedViolations = filteredViolations.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

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

	const toggleRowSelection = (id: string) => {
		const newSelected = new Set(selectedRows);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedRows(newSelected);
	};

	const toggleAllRows = () => {
		if (selectedRows.size === paginatedViolations.length) {
			setSelectedRows(new Set());
		} else {
			setSelectedRows(new Set(paginatedViolations.map((v) => v.id)));
		}
	};

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
			} else {
				pages.push(1, "...", currentPage, "...", totalPages);
			}
		}

		return pages;
	};

	// Build headers dynamically based on props
	const buildHeaders = () => {
		const headers: { key: string; label: string; className?: string }[] = [];

		if (showCheckboxes) {
			headers.push({
				key: "checkbox",
				label: "",
				className: "w-10",
			});
		}

		headers.push(
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
			headers.push({ key: "payment", label: "PAYMENT" });
		}

		if (showActions) {
			headers.push({ key: "actions", label: "ACTION", className: "w-24" });
		}

		return headers;
	};

	const headers = buildHeaders();

	return (
		<div className={cn("bg-white rounded-xl overflow-hidden", className)}>
			{/* Header Section */}
			{showFilters ? (
				<div className="flex flex-col gap-4 px-6 py-4">
					{/* Title Row with Create Button */}
					<div className="flex items-center justify-between gap-4 flex-wrap">
						<h3 className="text-lg text-primary font-semibold">{title}</h3>
						{/* <Button
							size="sm"
							onClick={onCreateViolation}
							className="bg-primary hover:bg-primary/90 text-white"
						>
							<Plus className="h-4 w-4 mr-1.5" />
							Create Violation
						</Button> */}
						<div className="flex items-center justify-between gap-4 flex-wrap">
							<div className="relative flex-1 max-w-md border-2 border-muted-foreground rounded-md">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search by name, PCN..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 h-9"
								/>
							</div>
							<div className="flex items-center gap-2">
								<DateRangePicker
									date={dateRange}
									onDateChange={setDateRange}
									className="h-9 border border-muted-foreground rounded-md cursor-pointer"
								/>
								<Button
									variant="ghost"
									size="sm"
									className="h-9 border border-muted-foreground text-sm cursor-pointer"
								>
									<Filter className="h-4 w-4 mr-1.5" />
									Filter
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="h-9 cursor-pointer"
								>
									<Download className="h-4 w-4 mr-1.5" />
									Export
								</Button>
							</div>
						</div>
					</div>
					{/* Filter Row */}
				</div>
			) : (
				/* Compact Header */
				<div className="flex items-center justify-between px-6 py-4">
					<h3 className="text-lg text-primary font-semibold">{title}</h3>
					<Button
						variant="ghost"
						size="sm"
						className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
					>
						View All →
					</Button>
				</div>
			)}

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-background">
						<tr className="text-left">
							{headers.map((header) => (
								<th
									key={header.key}
									className={cn(
										"px-4 py-3 text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap",
										header.className,
									)}
								>
									{header.key === "checkbox" ? (
										<input
											type="checkbox"
											checked={
												selectedRows.size === paginatedViolations.length &&
												paginatedViolations.length > 0
											}
											onChange={toggleAllRows}
											className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
											aria-label="Select all rows"
										/>
									) : (
										header.label
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y">
						{paginatedViolations.map((violation, index) => (
							<tr
								key={violation.id}
								className={cn("transition-colors", getRowClass(index))}
							>
								{showCheckboxes && (
									<td className="px-4 py-4">
										<input
											type="checkbox"
											checked={selectedRows.has(violation.id)}
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
									<span className="text-sm text-muted-foreground">
										{violation.pcn}
									</span>
								</td>
								<td className="px-4 py-4">
									<span className="text-sm text-primary">
										{violation.offenseType}
									</span>
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
												PAYMENT_STATUS_STYLES[
													violation.paymentStatus || "unpaid"
												],
											)}
										>
											{
												PAYMENT_STATUS_LABELS[
													violation.paymentStatus || "unpaid"
												]
											}
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
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex items-center bg-background justify-between px-6 py-4">
				<div className="text-sm text-muted-foreground">
					Showing {(currentPage - 1) * itemsPerPage + 1} -
					{Math.min(currentPage * itemsPerPage, filteredViolations.length)} of{" "}
					{new Intl.NumberFormat("en-US").format(filteredViolations.length)}{" "}
					results
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="secondary"
						size="icon"
						className="h-8 w-8 hover:cursor-pointer border border-muted-foreground"
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>

					{getPageNumbers().map((page, i) => (
						<div key={i}>
							{page === "..." ? (
								<span className="px-2 text-muted-foreground">... </span>
							) : (
								<Button
									variant={currentPage === page ? "default" : "ghost"}
									size="sm"
									className={cn(
										"h-8 w-8 text-xs hover:cursor-pointer",
										currentPage === page &&
											"bg-primary hover:bg-primary/80 hover:cursor-default",
									)}
									onClick={() => setCurrentPage(page as number)}
								>
									{page}
								</Button>
							)}
						</div>
					))}

					<Button
						variant="secondary"
						size="icon"
						className="h-8 w-8 hover:cursor-pointer border border-muted-foreground"
						onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Floating Bulk Action Bar */}
			{selectedRows.size > 0 && (
				<div className="bg-primary rounded-lg shadow-xl px-6 py-4 flex items-center justify-between text-white z-40 animate-in slide-in-from-bottom-5">
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-emerald-500" />
							<span className="font-medium">
								{selectedRows.size} violation
								{selectedRows.size !== 1 ? "s" : ""} selected
							</span>
						</div>
						<div className="hidden sm:block h-6 w-px bg-primary" />
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
							onClick={() => setSelectedRows(new Set())}
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
			)}

			<ResendPaymentModal
				isOpen={isResendModalOpen}
				onClose={() => setIsResendModalOpen(false)}
				selectedCount={selectedRows.size}
				onSend={(email, phone) => {
					console.log(
						`Sending payment links to ${selectedRows.size} violations`,
						{ email, phone },
					);
					setSelectedRows(new Set());
				}}
			/>
		</div>
	);
}
