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

  // Tracks which dropdown groups are open (independent of active state)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  /**
   * `selectedItem` is the ONLY thing that decides which parent item is active.
   * pathname is used purely to set the correct initial value on first render /
   * page refresh — after that, clicks are in full control.
   */
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

  const [openModal, setOpenModal] = useState<string | null>(null);

  const navItems = SIDEBAR_NAV_ITEMS.filter((item) => {
    if (item.requiredRole && user?.role !== item.requiredRole) return false;
    return true;
  });

  /** Called when a dropdown parent is clicked */
  const handleParentClick = (href: string) => {
    setSelectedItem(href);                                    // make this the only active item
    setOpenGroups((prev) => ({ ...prev, [href]: !prev[href] })); // toggle dropdown
  };

  /** Called when a leaf (non-dropdown) link is clicked */
  const handleLeafClick = (href: string) => {
    setSelectedItem(href);
  };

  /**
   * Called when a child item is clicked.
   * Always highlights the PARENT (not the child).
   * If the child is modal-only, prevent navigation and open the modal instead.
   */
  const handleChildClick = (
    parentHref: string,
    child: { href: string; isModal?: boolean },
    e: React.MouseEvent
  ) => {
    setSelectedItem(parentHref); // parent stays lit
    if (child.isModal) {
      e.preventDefault();
      setOpenModal(child.href);
    }
  };

  /**
   * Active check — selectedItem ONLY.
   * No pathname fallback here; that would keep the previous page's item
   * highlighted when modal children never change the URL.
   */
  const isParentActive = (item: (typeof SIDEBAR_NAV_ITEMS)[0]): boolean =>
    selectedItem === item.href;

  // Shared class blocks keep the layout stable (border-transparent = no shift)
  const activeRow =
    "bg-white/10 text-white border-l-4 border-white pl-2";
  const inactiveRow =
    "text-white/50 hover:text-white hover:bg-white/5 border-l-4 border-transparent pl-2";

  return (
    <>
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
            <Image
              src="/images/slts-logo.png"
              alt="SLTS Logo"
              width={84}
              height={84}
              className="shrink-0"
            />
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
                  {/* ── Parent row ── */}
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
                      {!sidebarCollapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                    </Link>
                  )}

                  {/* ── Sub-items (no border — parent carries the indicator) ── */}
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
                                childActive
                                  ? "text-white font-semibold"
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

        {/* ── User profile ── */}
        <div className="shrink-0 border-t border-white/5 px-3 py-3">
          <div
            className={cn(
              "flex items-center gap-3",
              sidebarCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
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
                aria-label="Settings"
              >
                <Settings className="h-4 w-4 text-white" />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* ── Modal renderer ── */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="bg-[#0B1629] rounded-lg p-6 max-w-md w-full mx-4 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-xl font-bold mb-4">Modal</h2>
            <p className="text-white/70 mb-4">Content for: {openModal}</p>
            <button
              onClick={() => setOpenModal(null)}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
