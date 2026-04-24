"use client";

import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUI } from "@/hooks";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimePeriod = "Daily" | "Weekly" | "Monthly" | "Custom range";

interface GlobalFilterState {
  timePeriod: TimePeriod | null;
  dateRange: string;
}

const TIME_PERIODS: TimePeriod[] = ["Daily", "Weekly", "Monthly", "Custom range"];

// ─── GlobalFilterModal ────────────────────────────────────────────────────────

export function GlobalFilterModal() {
  const { activeModal, closeModal } = useUI();
  const isOpen = activeModal === "global-filter";

  const [filter, setFilter] = useState<GlobalFilterState>({
    timePeriod: null,
    dateRange: "",
  });

  const handleReset = () => {
    setFilter({ timePeriod: null, dateRange: "" });
  };

  const handleApply = async () => {
    // NOTE: Global filter endpoint not yet available.
    // Once live, call your API here with the filter state:
    //
    // await apiClient.get("/dashboard/filter", {
    //   params: {
    //     period: filter.timePeriod,
    //     dateRange: filter.dateRange,
    //   }
    // });
    //
    // Then dispatch results to Redux or pass via context/callback.
    console.log("Applying global filter:", filter);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — blurred so dashboard content is dimmed but visible */}
      <div
        className="fixed inset-0 z-40 bg-black/40 "
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal — centered */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-filter-title"
        className={cn(
          "fixed z-50 top-0 right-0 mt-16 flex items-center justify-center p-4 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "relative w-full max-w-[480px] bg-white dark:bg-card",
            "rounded-2xl shadow-2xl border border-border",
            "flex flex-col pointer-events-auto",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 h-6 w-6 rounded-full bg-[#94A3B8] hover:bg-[#1B3A6B] flex items-center justify-center transition-colors"
            aria-label="Close filter"
          >
            <X className="h-3 w-3 text-white" />
          </button>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <h2
              id="global-filter-title"
              className="text-xl font-bold text-foreground"
            >
              Global Filter
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Applies to: Dashboard · Violations · Payments · Reports
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">

            {/* Time Period */}
            <div className="space-y-2.5">
              <label className="text-sm font-medium text-foreground">
                Time Period
              </label>
              <div className="flex flex-wrap gap-2">
                {TIME_PERIODS.map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        timePeriod: prev.timePeriod === period ? null : period,
                      }))
                    }
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
              <label className="text-sm font-medium text-foreground">
                Date Range
              </label>
              <div className="relative">
                <Input
                  type={filter.timePeriod === "Custom range" ? "date" : "text"}
                  placeholder="Select date range"
                  value={filter.dateRange}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, dateRange: e.target.value }))
                  }
                  className={cn(
                    "rounded-lg pr-10 text-sm",
                    "hover:border-[#1B3A6B]/40 hover:bg-[#1B3A6B]/5",
                    "focus-visible:ring-[#1B3A6B]/20",
                    !filter.dateRange && "text-muted-foreground"
                  )}
                  readOnly={filter.timePeriod !== "Custom range"}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            {/* Reset — plain text style, leftmost */}
            <button
              type="button"
              onClick={handleReset}
              className="mr-auto text-sm text-foreground hover:text-[#1B3A6B] transition-colors"
            >
              Reset
            </button>

            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="min-w-[80px] hover:bg-[#1B3A6B]/5 hover:border-[#1B3A6B]/40"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleApply}
              className="min-w-[110px] bg-[#0B1629] text-white hover:bg-[#1B3A6B]"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
