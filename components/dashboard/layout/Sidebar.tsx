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
  Camera,
  LogOut,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUI, useAuth } from "@/hooks";
import { SIDEBAR_NAV_ITEMS } from "@/constants";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  Search: <Search className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  UserCog: <UserCog className="h-5 w-5" />,
  BarChart2: <BarChart2 className="h-5 w-5" />,
  Camera: <Camera className="h-5 w-5" />,
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
  const { sidebarCollapsed, toggleSidebar, openModal } = useUI();
  const { user } = useAuth();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [selectedItem, setSelectedItem] = useState<string>(() => {
    const match = SIDEBAR_NAV_ITEMS.find(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        item.children?.some(
          (c) => pathname === c.href || pathname.startsWith(c.href + "/")
        )
    );
    return match?.href ?? "";
  });

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfilePopupOpen(false);
      }
    }
    if (profilePopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profilePopupOpen]);

  const navItems = SIDEBAR_NAV_ITEMS.filter((item) => {
    if (item.requiredRole && user?.role !== item.requiredRole) return false;
    return true;
  });

  const handleParentClick = (href: string) => {
    setSelectedItem(href);
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const handleLeafClick = (href: string) => {
    setSelectedItem(href);
  };

  const handleChildClick = (
    parentHref: string,
    child: { href: string; isModal?: boolean },
    e: React.MouseEvent
  ) => {
    setSelectedItem(parentHref);
    if (child.isModal) {
      e.preventDefault();
      openModal(child.href);
    }
  };

  const isParentActive = (item: (typeof SIDEBAR_NAV_ITEMS)[0]): boolean =>
    selectedItem === item.href;

  const activeRow = "bg-white/10 text-white border-l-4 border-white pl-2";
  const inactiveRow = "text-white/50 hover:text-white hover:bg-white/5 border-l-4 border-transparent pl-2";

  // ── Logout handler placeholder ──────────────────────────────────────────────
  // Auth/logout functionality is handled separately  wire up here when ready:
  // const { logout } = useAuth();
  const handleLogout = () => {
    setProfilePopupOpen(false);
    // logout();
    console.log("Logout triggered — wire up auth handler here");
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col transition-all duration-300 ease-in-out border-r border-white/5",
        "bg-[#0B1629]",
        sidebarCollapsed ? "w-0 overflow-hidden md:w-24" : "w-64"
      )}
    >
      {/* ── Logo / header ── */}
      <div
        className={cn(
          "flex items-center justify-between h-16 px-4 border-b border-white/5 shrink-0",
          sidebarCollapsed && "px-2 justify-center"
        )}
      >
        {!sidebarCollapsed ? (
          <Image src="/images/slts-logo.png" alt="SLTS Logo" width={84} height={84} className="shrink-0" />
        ) : (
          <button
            onClick={toggleSidebar}
            className="text-white hover:bg-white/10 p-1 rounded-md transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-8 w-8" />
          </button>
        )}
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="h-5 w-5 rounded-full bg-white flex items-center justify-center text-[#0B1629] hover:bg-white/80 transition-colors shrink-0"
            aria-label="Collapse sidebar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 scrollbar-thin scrollbar-thumb-white/10">
        <ul className="space-y-4">
          {navItems.map((item) => {
            const active = isParentActive(item);
            const hasChildren = !!(item.children?.length);
            const isOpen = openGroups[item.href];

            return (
              <li key={item.href}>
                {hasChildren ? (
                  <button
                    onClick={() => handleParentClick(item.href)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                      active ? activeRow : inactiveRow,
                      sidebarCollapsed && "justify-center border-l-0 px-3 pl-3"
                    )}
                    title={sidebarCollapsed ? item.title : undefined}
                  >
                    <span className="shrink-0">{ICON_MAP[item.icon]}</span>
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
                    onClick={() => handleLeafClick(item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                      active ? activeRow : inactiveRow,
                      sidebarCollapsed && "justify-center border-l-0 px-3 pl-3"
                    )}
                    title={sidebarCollapsed ? item.title : undefined}
                  >
                    <span className="shrink-0">{ICON_MAP[item.icon]}</span>
                    {!sidebarCollapsed && <span className="flex-1">{item.title}</span>}
                  </Link>
                )}

                {hasChildren && isOpen && !sidebarCollapsed && (
                  <ul className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-0.5">
                    {item.children!.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={(e) => handleChildClick(item.href, child, e)}
                            className={cn(
                              "block px-3 py-1.5 text-sm rounded-md transition-colors",
                              childActive ? "text-white font-semibold" : "text-white/40 hover:text-white/70"
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

      {/* ── User profile + popup ── */}
      <div ref={profileRef} className="shrink-0 border-t border-white/5 px-3 py-3 relative">

        {/* Popup — appears above the profile row */}
        {profilePopupOpen && !sidebarCollapsed && (
          <div
            className={cn(
              "absolute bottom-full left-3 right-3 mb-2",
              "bg-[#112240] border border-white/10 rounded-xl shadow-xl",
              "overflow-hidden",
              "animate-in fade-in-0 slide-in-from-bottom-2 duration-150"
            )}
          >
            {/* User info header inside popup */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name ?? "Ahmad Shehu"}
              </p>
              <p className="text-xs text-white/40 truncate">
                {user?.email ?? "ahmad@slts.gov.ng"}
              </p>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              <Link
                href="/dashboard/profile"
                onClick={() => setProfilePopupOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <UserCircle className="h-4 w-4 shrink-0" />
                View Profile
              </Link>

              <Link
                href="/dashboard/settings"
                onClick={() => setProfilePopupOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 shrink-0" />
               Profile Settings
              </Link>

              {/* Divider */}
              <div className="my-1.5 border-t border-white/10" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Log out
              </button>
            </div>
          </div>
        )}

        {/* Profile row — clicking toggles the popup */}
        <button
          type="button"
          onClick={() => !sidebarCollapsed && setProfilePopupOpen((p) => !p)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg p-1.5 transition-colors",
            !sidebarCollapsed && "hover:bg-white/5 cursor-pointer",
            sidebarCollapsed && "justify-center cursor-default"
          )}
        >
          {/* Avatar */}
          <div className={cn(
            "h-9 w-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 ring-2 transition-all",
            profilePopupOpen ? "ring-white/40" : "ring-transparent"
          )}>
            <span className="text-xs font-semibold text-white">
              {getInitials(user?.name)}
            </span>
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                {user?.name ?? "Ahmad Shehu"}
              </p>
              <p className="text-xs text-white/40 truncate capitalize">
                {user?.role ?? "Administrator"}
              </p>
            </div>
          )}

          {/* Settings icon — separate link, stops propagation so it doesn't open popup */}
          {!sidebarCollapsed && (
            <Link
              href="/dashboard/settings"
              onClick={(e) => e.stopPropagation()}
              className="h-7 w-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
          )}
        </button>
      </div>
    </aside>
  );
}