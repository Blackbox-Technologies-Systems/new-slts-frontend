"use client";

import { ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import {
	ChevronLeft,
	ChevronRight,
	Search,
	Download,
	Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export interface BaseTableColumn {
	key: string;
	label: string;
	className?: string;
}

export interface BaseTableProps<T> {
	title: string;
	data: T[];
	columns: BaseTableColumn[];
	className?: string;

	// Custom Rendering
	renderRow: (item: T, index: number) => ReactNode;

	// Feature Toggles
	showFilters?: boolean;
	showCheckboxes?: boolean;

	// Selection State
	selectedIds?: Set<string>;
	onToggleAll?: (pageIds: string[]) => void;

	// Search & Filter State
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
	searchPlaceholder?: string;

	dateRange?: DateRange;
	onDateChange?: (range: DateRange | undefined) => void;

	// Pagination State
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage?: number;
	onPageChange: (page: number) => void;

	// Bulk Actions
	renderBulkActions?: () => ReactNode;
}

export function BaseTable<T extends { id: string }>({
	title,
	data,
	columns,
	className,
	renderRow,
	showFilters = false,
	showCheckboxes = false,
	selectedIds = new Set(),
	onToggleAll,
	searchQuery = "",
	onSearchChange,
	searchPlaceholder = "Search...",
	dateRange,
	onDateChange,
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage = 10,
	onPageChange,
	renderBulkActions,
}: BaseTableProps<T>) {
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

	const pageIds = data.map((item) => item.id);
	const isAllSelected =
		pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

	return (
		<div
			className={cn("bg-white rounded-xl overflow-hidden relative", className)}
		>
			{/* Header Section */}
			{showFilters ? (
				<div className="flex flex-col gap-4 px-6 py-4">
					<div className="flex items-center justify-between gap-4 flex-wrap">
						<h3 className="text-lg text-primary font-semibold">{title}</h3>
						<div className="flex items-center justify-between gap-4 flex-wrap">
							{onSearchChange && (
								<div className="relative flex-1 max-w-md border-2 border-muted-foreground rounded-md">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder={searchPlaceholder}
										value={searchQuery}
										onChange={(e) => onSearchChange(e.target.value)}
										className="pl-10 h-9"
									/>
								</div>
							)}
							<div className="flex items-center gap-2">
								{onDateChange && (
									<DateRangePicker
										date={dateRange}
										onDateChange={onDateChange}
										className="h-9 border border-muted-foreground rounded-md cursor-pointer"
									/>
								)}
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
				</div>
			) : (
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

			{/* Table Section */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-background">
						<tr className="text-left">
							{showCheckboxes && (
								<th className="w-10 px-4 py-3 text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap">
									<input
										type="checkbox"
										checked={isAllSelected}
										onChange={() => onToggleAll?.(pageIds)}
										className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
										aria-label="Select all rows"
									/>
								</th>
							)}
							{columns.map((header) => (
								<th
									key={header.key}
									className={cn(
										"px-4 py-3 text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap",
										header.className,
									)}
								>
									{header.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y">
						{data.map((item, index) => renderRow(item, index))}
					</tbody>
				</table>
			</div>

			{/* Pagination Section */}
			<div className="flex items-center bg-background justify-between px-6 py-4">
				<div className="text-sm text-muted-foreground">
					Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
					{Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
					{new Intl.NumberFormat("en-US").format(totalItems)} results
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="secondary"
						size="icon"
						className="h-8 w-8 hover:cursor-pointer border border-muted-foreground"
						onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
									onClick={() => onPageChange(page as number)}
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
						onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Bulk Actions Section */}
			{renderBulkActions && renderBulkActions()}
		</div>
	);
}
