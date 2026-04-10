"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Violation, ViolationStatus } from "@/types";

interface ViolationsTableProps {
	violations: Violation[];
	className?: string;
}

const STATUS_STYLES: Record<ViolationStatus, string> = {
	submitted: "bg-slate-100 text-slate-700 border-slate-200",
	approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
	rejected: "bg-red-50 text-red-700 border-red-200",
	pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const STATUS_LABELS: Record<ViolationStatus, string> = {
	submitted: "Submitted",
	approved: "Approved",
	rejected: "Rejected",
	pending: "Pending",
};

const getRowClass = (rowIndex: number) => {
	return rowIndex % 2 === 1 ? "bg-background" : "";
};

export function ViolationsTable({
	violations,
	className,
}: ViolationsTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(violations.length / itemsPerPage);

	const paginatedViolations = violations.slice(
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

	return (
		<div className={`bg-white rounded-xl overflow-hidden ${className}`}>
			{/* Table Header */}
			<div className="flex items-center justify-between px-6 py-4">
				<h3 className="text-lg text-primary font-semibold">
					Recent Violations
				</h3>
				<Button
					variant="ghost"
					size="sm"
					className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
				>
					View All →
				</Button>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-background">
						<tr className="text-left">
							{[
								"S/N",
								"OFFENDER NAME",
								"PCN",
								"OFFENSE TYPE",
								"PLATE NO.",
								"AMOUNT",
								"VIOLATION DATE",
								"STATUS",
							].map((header) => (
								<th
									key={header}
									className="px-4 py-3 text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap"
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y">
						{paginatedViolations.map((violation, index) => (
							<tr key={violation.id} className={cn("transition-colors", getRowClass(index))}>
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
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex items-center bg-background justify-between px-6 py-4">
				<div className="text-sm text-muted-foreground">
					Showing {(currentPage - 1) * itemsPerPage + 1} -
					{Math.min(currentPage * itemsPerPage, violations.length)} of{" "}
					{new Intl.NumberFormat("en-US").format(violations.length)} results
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
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
									variant={currentPage === page ? "default" : "outline"}
									size="sm"
									className={cn(
										"h-8 w-8 text-xs",
										currentPage === page && "bg-primary hover:bg-primary/80",
									)}
									onClick={() => setCurrentPage(page as number)}
								>
									{page}
								</Button>
							)}
						</div>
					))}

					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
