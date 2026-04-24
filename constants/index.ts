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
  ASSET_MANAGEMENT: "/dashboard/asset-management",
  REPORTS_OVERVIEW: "/dashboard/reports/overview",
} as const;

export const MODAL_KEYS = {
  CREATE_VIOLATION: "create-violation",
  GLOBAL_FILTER: "global-filter"
} as const;

export const PROTECTED_ROUTES = ["/dashboard"];
export const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://slts-cpy-staging.up.railway.app/api";

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
  VIOLATIONS: {
    LIST: "/violations",
    CREATE: "/violations",          // POST — not live yet
    DETAIL: (id: string) => `/violations/${id}`,
    DISPUTES: "/violations/disputes",
    SUMMARY: "/violations/summary",
  },
  PLATE: {
    RUN: "/plate/run",
  },
  OFFENDERS: {
    LIST: "/offenders",
    DETAIL: (id: string) => `/offenders/${id}`,
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

// ─── Sidebar Types ─────────────────────────────────────────────────────────────

interface SidebarChildItem {
  title: string;
  href: string;        // a ROUTE path, OR a MODAL_KEY if isModal is true
  isModal?: boolean;
}

interface SidebarNavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  requiredRole?: string;
  isModal?: boolean;
  children?: SidebarChildItem[];
}

// ─── Sidebar Nav ───────────────────────────────────────────────────────────────

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
  },
  {
    title: "Violation",
    href: ROUTES.VIOLATIONS,
    icon: "AlertTriangle",
    children: [
      { title: "View Violations", href: "/dashboard/violations", isModal: false },
      { title: "Disputes", href: "/dashboard/violations/disputes", isModal: true },
      { title: "Summary", href: "/dashboard/violations/summary", isModal: true },
    ],
  },
  {
    title: "Run Plate Number",
    href: ROUTES.PLATE,
    icon: "Search",
  },
  {
    title: "Offenders",
    href: ROUTES.OFFENDERS,
    icon: "Users",
  },
  {
    title: "User Manager",
    href: ROUTES.USERS,
    icon: "UserCog",
    requiredRole: "admin",
    children: [
      { title: "All Users", href: ROUTES.USERS, isModal: false },
      { title: "Roles", href: `${ROUTES.USERS}/roles`, isModal: false },
    ],
  },
  {
    title: "Asset Management",
    href: ROUTES.ASSET_MANAGEMENT,        // ← add this route too
    icon: "Camera",
  },
  {
    title: "Report",
    href: ROUTES.REPORTS,
    icon: "BarChart2",
    children: [
      { title: "Overview", href: `${ROUTES.REPORTS}/overview`, isModal: false },
      { title: "Violation report", href: `${ROUTES.REPORTS}/violations`, isModal: false },
      { title: "Revenue report", href: `${ROUTES.REPORTS}/revenue`, isModal: false },
      { title: "Offender report", href: `${ROUTES.REPORTS}/offenders`, isModal: false },
      { title: "Marshal report", href: `${ROUTES.REPORTS}/marshal`, isModal: false },
      { title: "Zone report", href: `${ROUTES.REPORTS}/zone`, isModal: false },
      { title: "Dispute report", href: `${ROUTES.REPORTS}/disputes`, isModal: false },
      { title: "My report", href: `${ROUTES.REPORTS}/my-report`, isModal: false },
    ],
  },
];
export const THEMES = ["light", "dark", "system"] as const;
export const TOAST_DURATION = 4000;
export const PAGINATION_PAGE_SIZE = 10;
export const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production-please";
export const JWT_EXPIRY = "7d";
