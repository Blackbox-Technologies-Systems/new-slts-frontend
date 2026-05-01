export type ApprovalStatus = "Submitted" | "Approved" | "Rejected"
export type PaymentStatus = "Unpaid" | "Pending" | "Paid" | "Overdue"
export type EvidenceType = "image" | "video"

export interface Evidence {
  id: string
  type: EvidenceType
  filename: string
  url: string // populated by backend; empty string while mocking
}

export interface ActionHistoryItem {
  event: string
  actor: string
  timestamp: string
}

export interface Violation {
  // ── Identity (stat strip) ──
  pcn: string
  offender_first_name: string
  offender_last_name: string
  plate_number: string
  violation_date: string     // display string e.g. "15 Feb 2026"
  approval_status: ApprovalStatus

  // ── Offence Info card ──
  offence: string
  fine: string               // formatted: "₦10,000.00"
  event_type: string
  command: string
  zone: string
  violation_datetime: string // e.g. "25-March-2026 : 00:40:36"

  // ── Vehicle Info card ──
  brand: string
  vehicle_type: string
  vehicle_color: string
  plate_type: string
  plate_color: string

  // ── Offender Info card ──
  phone_number: string
  email_address: string
  violation_status: string
  payment_status: PaymentStatus

  // ── Evidence + history ──
  evidence: Evidence[]
  action_history: ActionHistoryItem[]
}

// Lighter shape used in the plate-number violations table
export interface PlateViolation {
  id: string
  pcn: string
  offense_type: string
  date: string
  approval_status: ApprovalStatus
  payment_status: PaymentStatus
}

export interface PlateResult {
  plate_number: string
  pcn: string
  phone_number: string
  // Vehicle Info card
  brand: string
  vehicle_type: string
  vehicle_color: string
  plate_type: string
//   plate_color: string
  // Offender Info card
  full_name: string
  email_address: string
  violation_status: string
  payment_status: PaymentStatus
  // Linked violations
  violations: PlateViolation[]
}

export interface RecentSearch {
  plate: string
  label: string // "2 mins ago" | "1 hour ago" | "Yesterday"
}