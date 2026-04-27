"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months:
					"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
				month: "space-y-4",
				month_caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-semibold text-primary",
				nav: "space-x-1 flex items-center",
				button_previous: cn(
					"h-7 w-7 absolute left-1 top-0 z-10 bg-transparent p-0 flex items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors",
				),
				button_next: cn(
					"h-7 w-7 absolute right-1 top-0 z-10 bg-transparent p-0 flex items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors",
				),
				month_grid: "w-full border-collapse space-y-1",
				weekdays: "flex",
				weekday:
					"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] pb-2",
				week: "flex w-full mt-2 justify-between",
				day: "h-9 w-9 text-center text-sm p-0 m-0 relative flex items-center justify-center [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
				day_button: cn(
					"h-9 w-9 p-0 m-0 font-normal rounded-md transition-all duration-200 flex items-center justify-center",
					"hover:bg-accent hover:text-accent-foreground",
					"aria-selected:opacity-100",
				),
				selected: cn(
					"bg-primary text-primary-foreground",
					"hover:bg-primary hover:text-primary-foreground",
					"focus:bg-primary focus:text-primary-foreground",
				),
				today: cn("bg-accent text-accent-foreground", "font-semibold"),
				outside:
					"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
				disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
				range_end: "day-range-end",
				range_middle: cn(
					"aria-selected:bg-primary/90 aria-selected:text-primary-foreground",
					"rounded-none",
				),
				hidden: "invisible",
				...classNames,
			}}
			components={{
				Chevron: ({ orientation }) => {
					if (orientation === "left") {
						return <ChevronLeft className="h-4 w-4" />;
					}
					return <ChevronRight className="h-4 w-4" />;
				},
				IconLeft: () => <ChevronLeft className="h-4 w-4" />,
				IconRight: () => <ChevronRight className="h-4 w-4" />,
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
