"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  Search,
  Users,
  UserCog,
  BarChart2,
  ChevronDown,
  X,
  Settings,
  Menu,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUI, useAuth } from "@/hooks";
import { SIDEBAR_NAV_ITEMS } from "@/constants";
import { Button } from "../ui/button";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  Search: <Search className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  UserCog: <UserCog className="h-5 w-5" />,
  BarChart2: <BarChart2 className="h-5 w-5" />,
};

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const { user } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const navItems = SIDEBAR_NAV_ITEMS.filter((item) => {
    if (item.requiredRole && user?.role !== item.requiredRole) return false;
    return true;
  });

  const toggleGroup = (href: string) => {
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const isGroupActive = (item: (typeof SIDEBAR_NAV_ITEMS)[0]) => {
    if (pathname === item.href || pathname.startsWith(item.href + "/")) return true;
    if (item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/")))
      return true;
    return false;
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col transition-all duration-300 ease-in-out border-r border-white/5",
        "bg-[#0B1629]",
        sidebarCollapsed ? "w-0 overflow-hidden md:w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center justify-between h-16 px-4 border-b border-white/5 shrink-0",
          sidebarCollapsed && "px-2 justify-center"
        )}
      >
       {!sidebarCollapsed ? ( <div className="flex items-center gap-2">
          <Image
                      src="/images/slts-logo.png"
                      alt="SLTS Logo"
                      width={84}
                      height={84}
                      className="shrink-0"
                    />
              </div>
          ) : (
            <div>
             <button        
                    onClick={toggleSidebar}
                      className="text-white hover:text-white hover:bg-white/10"
                    >
                      <Menu className="h-8 w-8" />
                    </button> </div>
          )}
      

        {/* Close button (mobile / desktop collapse) */}
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="h-5 w-5 rounded-full text-[#0B1629] flex items-center text bg-white  justify-center text-black hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-3.5 w-3.5 " />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 scrollbar-thin scrollbar-thumb-white/10">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = isGroupActive(item);
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openGroups[item.href] ?? active;

            return (
              <li key={item.href}>
                {/* Parent item */}
                {hasChildren ? (
                  <button
                    onClick={() => toggleGroup(item.href)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:text-white hover:bg-white/5",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                    title={sidebarCollapsed ? item.title : undefined}
                  >
                    <span className="shrink-0 text-white/70">
                      {ICON_MAP[item.icon]}
                    </span>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-white/40 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:text-white hover:bg-white/5",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                    title={sidebarCollapsed ? item.title : undefined}
                  >
                    <span className="shrink-0 text-white/70">
                      {ICON_MAP[item.icon]}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="flex-1">{item.title}</span>
                    )}
                  </Link>
                )}

                {/* Sub-items */}
                {hasChildren && isOpen && !sidebarCollapsed && (
                  <ul className="mt-0.5 ml-4 pl-4 border-l border-white/10 space-y-0.5">
                    {item.children!.map((child) => {
                      const childActive =
                        pathname === child.href ||
                        pathname.startsWith(child.href + "/");
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block px-3 py-1.5 text-sm rounded-md transition-colors",
                              childActive
                                ? "text-white font-medium"
                                : "text-white/40 hover:text-white/70"
                            )}
                          >
                            {child.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom – user profile */}
      <div className="shrink-0 border-t border-white/5 px-3 py-3">
        <div
          className={cn(
            "flex items-center gap-3",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-white">
                {getInitials(user?.name)}
              </span>
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name ?? "Ahmad Shehu"}
                </p>
                <p className="text-xs text-white/40 truncate capitalize">
                  {user?.role ?? "Administrator"}
                </p>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <Link
              href="/dashboard/settings"
              className="h-8 w-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <Settings className="h-4 w-4 text-white" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
