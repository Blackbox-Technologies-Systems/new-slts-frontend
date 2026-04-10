"use client";

import { Menu, Bell, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUI } from "@/hooks";
import { cn } from "@/lib/utils";

interface TopbarProps {
  notificationCount?: number;
}

export function Topbar({ notificationCount = 3 }: TopbarProps) {

    const { sidebarCollapsed, toggleSidebar } = useUI();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4  px-4 md:pr-6 md:pl-3",
        "bg-[#0B1629] border-b border-white/5"
      )}
    >
      {/* Left – sidebar toggle + logo */}
      <div className="flex items-center gap-3 shrink-0">
       
        {sidebarCollapsed && ( <div className="hidden md:flex items-center gap-2">
          <Image
            src="/images/slts-logo.png"
            alt="SLTS Logo"
            width={100}
            height={100}
            className="shrink-0"
          />
         
        </div> )}
      </div>

      {/* Center – search */}
      <div className="flex-1 flex justify-end px-4">
        <div className="relative w-full max-w-xl">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
            />
          </svg>
          <Input
            placeholder="violations, offenders, disputes, reports..."
            className={cn(
              "pl-6 h-9 text-sm rounded-lg",
              "bg-white/5 border-white b0order-2 text-white placeholder:text-white/25",
              "focus-visible:ring-white/20 focus-visible:border-white/20",
              "transition-colors"
            )}
          />
        </div>
      </div>

      {/* Right – actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification bell */}
        <button className="relative h-9 w-9 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <Bell className="h-5 w-5 text-white" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0B1629]" />
          )}
        </button>

        {/* Global Filter button */}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-4 text-sm font-medium rounded-md gap-1.5",
            "bg-transparent border-white/15 text-white",
            "hover:bg-white/10 hover:border-white/25 hover:text-white",
            "transition-colors"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Global Filter
        </Button>
      </div>
    </header>
  );
}
