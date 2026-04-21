export const APP_NAME = "SLTS";
export const APP_DESCRIPTION = "Smart Law Traffic System";
export const APP_VERSION = "1.0.0";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  VIOLATIONS: "/dashboard/violations",
  VIOLATIONS_DISPUTES: "/dashboard/violations/disputes",
  VIOLATIONS_SUMMARY: "/dashboard/violations/summary",
  PLATE: "/dashboard/plate",
  OFFENDERS: "/dashboard/offenders",
  USERS: "/dashboard/users",
  REPORTS: "/dashboard/reports",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
} as const;

export const PROTECTED_ROUTES = ["/dashboard"];

export const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    FORGOTPASSSWORD: "/auth/forgot-password",
    VERIFYFORGOTPASSWORD: "/auth/verify-forgot-password",
    VERIFYOTP: "/auth/verify-login-otp",
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
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const PERSIST_KEY = "slts-root";

interface SidebarChildItem {
  title: string;
  href: string;
  isModal?: boolean;
}

interface SidebarNavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  requiredRole?: string;
  children?: SidebarChildItem[];
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Violation",
    href: "/dashboard/violations",
    icon: "AlertTriangle",
    children: [
      { title: "View Violations", href: "/dashboard/violations", isModal: true },
      { title: "Disputes", href: "/dashboard/violations/disputes", isModal: true },
      { title: "Summary", href: "/dashboard/violations/summary", isModal: true },
    ],
  },
  {
    title: "Run Plate Number",
    href: "/dashboard/plate",
    icon: "Search",
  },
  {
    title: "Offenders",
    href: "/dashboard/offenders",
    icon: "Users",
  },
  {
    title: "User Manager",
    href: "/dashboard/users",
    icon: "UserCog",
    requiredRole: "admin",
    children: [
      { title: "All Users", href: "/dashboard/users", isModal: false },
      { title: "Roles", href: "/dashboard/users/roles", isModal: false },
    ],
  },
  {
    title: "Report",
    href: "/dashboard/reports",
    icon: "BarChart2",
  },
];

export const THEMES = ["light", "dark", "system"] as const;

export const TOAST_DURATION = 4000;

export const PAGINATION_PAGE_SIZE = 10;

export const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production-please";
export const JWT_EXPIRY = "7d";