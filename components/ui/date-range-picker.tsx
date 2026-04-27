"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
	className?: string;
	date?: DateRange;
	onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
	className,
	date,
	onDateChange,
}: DateRangePickerProps) {
	const [open, setOpen] = React.useState(false);

	// Default to last 7 days if no date provided
	const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
		date ?? {
			from: addDays(new Date(), -7),
			to: new Date(),
		},
	);

	const selectedDate = date ?? internalDate;

	const handleSelect = (newDate: DateRange | undefined) => {
		if (onDateChange) {
			onDateChange(newDate);
		} else {
			setInternalDate(newDate);
		}
	};

	const handleApply = () => {
		setOpen(false);
	};

	const handleClear = () => {
		handleSelect(undefined);
	};

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant="ghost"
						className={cn(
							"h-9 justify-start text-left font-normal cursor-pointer",
							!selectedDate && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{selectedDate?.from ? (
							selectedDate.to ? (
								<>
									{format(selectedDate.from, "d MMM, yyyy")} -{" "}
									{format(selectedDate.to, "d MMM, yyyy")}
								</>
							) : (
								format(selectedDate.from, "d MMM, yyyy")
							)
						) : (
							<span>Pick a date range</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="end">
					<div className="p-3">
						<Calendar
							initialFocus
							mode="range"
							defaultMonth={selectedDate?.from}
							selected={selectedDate}
							onSelect={handleSelect}
							numberOfMonths={1}
							className="border-0 cursor-pointer"
						/>
						<div className="flex items-center justify-end gap-2 border-t p-3 pt-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClear}
								className="text-muted-foreground cursor-pointer"
							>
								Clear
							</Button>
							<Button
								size="sm"
								onClick={handleApply}
								className="cursor-pointer"
							>
								Apply
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
