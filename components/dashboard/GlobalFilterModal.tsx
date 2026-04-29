"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUI } from "@/hooks";
import { MODAL_KEYS } from "@/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimePeriod = "Daily" | "Weekly" | "Monthly" | "Custom range";

const TIME_PERIODS: TimePeriod[] = ["Daily", "Weekly", "Monthly", "Custom range"];

interface GlobalFilterState {
  timePeriod: TimePeriod | null;
  dateRange: string;
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

// Converts a Date object to "YYYY-MM-DD" string
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Returns the computed date range string based on the selected period
function getDateRange(period: TimePeriod | null): string {
  const today = new Date();

  switch (period) {
    case "Daily":
      // Just today's date
      return formatDate(today);

    case "Weekly": {
      // 7 days ago → today
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return `${formatDate(weekAgo)} → ${formatDate(today)}`;
    }

    case "Monthly": {
      // First day of current month → today
      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return `${formatDate(firstOfMonth)} → ${formatDate(today)}`;
    }

    case "Custom range":
      // User fills this in manually
      return "";

    default:
      return "";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GlobalFilterModal() {
  const { activeModal, closeModal } = useUI();
  const isOpen = activeModal === MODAL_KEYS.GLOBAL_FILTER;

  const [filter, setFilter] = useState<GlobalFilterState>({
    timePeriod: null,
    dateRange: "",
  });

  const handlePeriodSelect = (period: TimePeriod) => {
    // Clicking the same pill deselects it — otherwise select and auto-fill date range
    const newPeriod = filter.timePeriod === period ? null : period;
    setFilter({
      timePeriod: newPeriod,
      dateRange: getDateRange(newPeriod),
    });
  };

  const handleReset = () => setFilter({ timePeriod: null, dateRange: "" });

  const handleApply = () => {
    // TODO: wire up when endpoint is available
    // await apiClient.get("/dashboard/filter", {
    //   params: { period: filter.timePeriod, dateRange: filter.dateRange }
    // });
    console.log("Applying global filter:", filter);
    closeModal();
  };

  const isCustomRange = filter.timePeriod === "Custom range";

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && closeModal()}>
      <DialogContent className={cn(
    "fixed top-16 right-4",           // ← anchor to top-right
    "translate-x-0 translate-y-0",    // ← cancel the default centering transforms
    "left-auto",                       // ← cancel the default left-1/2
    "max-w-[480px] w-[90vw]",
    "gap-0 p-0 overflow-hidden",
    "animate-in fade-in-0 slide-in-from-top-2 duration-200"
  )}>

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border gap-1">
          <DialogTitle className="text-xl font-bold">Global Filter</DialogTitle>
          <DialogDescription>
            Applies to: Dashboard · Violations · Payments · Reports
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Time Period pills */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-foreground">Time Period</label>
            <div className="flex flex-wrap gap-2">
              {TIME_PERIODS.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => handlePeriodSelect(period)}
                  className={cn(
                    "px-4 py-1.5 rounded-full border text-sm transition-all",
                    filter.timePeriod === period
                      ? "bg-[#0B1629] text-white border-[#0B1629]"
                      : "bg-white text-foreground border-border hover:border-[#1B3A6B]/50 hover:bg-[#1B3A6B]/5"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-foreground">Date Range</label>
            <div className="relative">
              <Input
                // Custom range → real date input; others → text showing computed range
                type={isCustomRange ? "date" : "text"}
                placeholder="Select date range"
                value={filter.dateRange}
                onChange={(e) =>
                  // Only allow typing when Custom range is selected
                  isCustomRange &&
                  setFilter((prev) => ({ ...prev, dateRange: e.target.value }))
                }
                readOnly={!isCustomRange}
                className={cn(
                  "rounded-lg pr-10",
                  "hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5",
                  "focus-visible:ring-[#1B3A6B]/20",
                  !filter.dateRange && "text-muted-foreground",
                  !isCustomRange && "cursor-default"
                )}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Helper text showing what was computed */}
            {filter.dateRange && !isCustomRange && (
              <p className="text-xs text-muted-foreground">
                Auto-filled based on selected period
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={handleReset}
            className="mr-auto text-sm text-foreground hover:text-[#1B3A6B] transition-colors"
          >
            Reset
          </button>
          <Button
            variant="outline"
            onClick={closeModal}
            className="min-w-[80px] hover:bg-[#1B3A6B]/5 hover:border-[#1B3A6B]/40"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="min-w-[110px] bg-[#0B1629] text-white hover:bg-[#1B3A6B]"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}