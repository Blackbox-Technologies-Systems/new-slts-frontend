"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BarChart3, Users, Settings,
  UserCircle, LogOut, ChevronLeft, Zap, BookOpen,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useUI, useAuth } from "@/hooks";
import { SIDEBAR_NAV_ITEMS, ROUTES } from "@/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  BarChart3: <BarChart3 className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
  UserCircle: <UserCircle className="h-4 w-4" />,
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const { user, logout } = useAuth();

  const navItems = SIDEBAR_NAV_ITEMS.filter((item) => {
    if (item.requiredRole && user?.role !== item.requiredRole) return false;
    return true;
  });

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2 p-4 h-16 border-b", sidebarCollapsed && "justify-center px-2")}>
        <Image
          src="/images/bb-logo-box.png"
          alt="BB Logo"
          width={32}
          height={32}
          className="shrink-0"
        />
        {!sidebarCollapsed && (
          <span className="font-bold text-lg tracking-tight">BB Starter</span>
        )}
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-[4.5rem] z-10 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-accent"
      >
        <ChevronLeft
          className={cn("h-3 w-3 transition-transform", sidebarCollapsed && "rotate-180")}
        />
      </Button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : "text-muted-foreground",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <span className="shrink-0">{ICON_MAP[item.icon]}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {"badge" in item && item.badge && (
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t space-y-1">
        <Separator className="mb-2" />
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            sidebarCollapsed ? "justify-center px-2" : "justify-start gap-3"
          )}
          title={sidebarCollapsed ? "Log out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Log out</span>}
        </Button>
      </div>
    </aside>
  );
}
