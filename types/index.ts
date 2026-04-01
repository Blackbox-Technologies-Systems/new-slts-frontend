// ─── User Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export type UserRole = "admin" | "user" | "moderator";

// ─── Auth Types ────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// ─── API Types ─────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// ─── Navigation Types ──────────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  requiredRole?: UserRole;
}

// ─── Dashboard Types ───────────────────────────────────────────────────────────

export interface StatsCard {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: string;
}

export interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
}

// ─── Redux Store Types ─────────────────────────────────────────────────────────

export interface RootState {
  auth: AuthState;
  ui: UIState;
  notifications: NotificationState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  activeModal: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}
