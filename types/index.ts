// ─── User Types ───────────────────────────────────────────────────────────────

export interface User {
	id: string;
	name: string;
	email: string;
	roles: string[];
	permissions: string[];
	last_login_at: string;
	status: string;
	avatar?: string;
	created_at: string;
	updated_at: string;
}

// export type UserRole = "admin" | "user" | "moderator";

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
	requiredRole?: User;
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

// ─── Violation Types ───────────────────────────────────────────────────────────

export type ViolationStatus = "submitted" | "approved" | "rejected" | "pending";

export interface Offender {
	id: string;
	name: string;
	avatar?: string;
}

export interface Violation {
	id: string;
	sn: number;
	offender: Offender;
	pcn: string;
	offenseType: string;
	plateNo: string;
	amount: number;
	violationDate: string;
	status: ViolationStatus;
}

export interface DashboardStat {
	title: string;
	value: number;
	prefix?: string;
	suffix?: string;
	change?: {
		value: number;
		trend?: "up" | "down";
	};
	subtitle?: string;
	icon: string;
	variant?: "default" | "primary" | "secondary" | "danger";
}

export interface RevenueStat {
	label: string;
	value: string;
	prefix: string;
	subtitle?: string;
	icon?: string;
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

export interface ViolationFormData {
  // Vehicle Info
  plateNumber: string;
  plateType: string;
  plateColor: string;
  vehicleBrand: string;
  vehicleType: string;
  vehicleColor: string;
  // Offence
  offence: string;
  eventType: string;
  violationDate: string;
  zone: string;
  command: string;
  offenderFirstName: string;
  offenderSurname: string;
  phoneNumber: string;
  emailAddress: string;
  // Files
  files: File[];
}

export interface SelectFieldProps {
  label: string;
  placeholder: string;
  required?: boolean;
  options?: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export interface SectionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  noBorder?: boolean;
}

export interface UploadFile {
  file: File;
  progress: number; // 0–100
}


