export const APP_NAME = "BB Starter Pack";
export const APP_DESCRIPTION = "Blackbox Technologies' Next.js starter pack for software developers";
export const APP_VERSION = "1.0.0";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
  ANALYTICS: "/dashboard/analytics",
  USERS: "/dashboard/users",
  DOCS: "/dashboard/docs",
} as const;

export const PROTECTED_ROUTES = ["/dashboard"];

export const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
    DELETE: "/user/delete",
  },
} as const;

export const COOKIE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PREFERENCES: "user_prefs",
} as const;

export const COOKIE_OPTIONS = {
  expires: 7,       // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const PERSIST_KEY = "nexstarter-root";

interface SidebarNavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  requiredRole?: string;
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: "BarChart3",
    badge: "New",
  },
  {
    title: "Docs",
    href: "/dashboard/docs",
    icon: "BookOpen",
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: "Users",
    requiredRole: "admin",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "UserCircle",
  },
];

export const THEMES = ["light", "dark", "system"] as const;

export const TOAST_DURATION = 4000;

export const PAGINATION_PAGE_SIZE = 10;

// ─── JWT ───────────────────────────────────────────────────────────────────────

export const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production-please";
export const JWT_EXPIRY = "7d";
