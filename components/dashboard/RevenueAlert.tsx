"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RevenueAlertProps {
  title?: string;
  message?: string;
  className?: string;
}

export function RevenueAlert({
  title = "Revenue Collection Alert",
  message = "Collection rate is significantly low (0.13% collected). Current collection: ₦120,000 out of ₦95.8M potential revenue. Consider reviewing collection processes and enforcement strategies.",
  className,
}: RevenueAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border-l-4 border-l-primary bg-white p-4 shadow-sm",
        "dark:bg-card dark:border-border",
        className
      )}
    >
      {/* Alert Icon */}
      <div className="flex-shrink-0 mt-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900">
          <Bell className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{message}</p>
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 h-8 w-8 rounded-full"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
