type ApprovalStatus = "Submitted" | "Approved" | "Rejected"
type PaymentStatus = "Unpaid" | "Pending" | "Paid" | "Overdue"
type EvidenceType = "image" | "video"

interface Evidence {
  id: string
  type: EvidenceType
  filename: string
  url: string
}

interface ActionHistoryItem {
  event: string
  actor: string
  timestamp: string
}

interface Violation {
  // Identity
  pcn: string
  offender_first_name: string
  offender_last_name: string
  plate_number: string
  violation_date: string   // e.g. "15 Feb 2026"
  approval_status: ApprovalStatus

  // Offence Info card
  offence: string          // e.g. "Disobeying traffic lights"
  fine: string             // formatted, e.g. "₦10,000.00"
  event_type: string       // e.g. "Red Light Running"
  command: string          // e.g. "Command 1"
  zone: string             // e.g. "Zone 1"
  violation_datetime: string // e.g. "25-March-2026 : 00:40:36"

  // Vehicle Info card
  brand: string
  vehicle_type: string
  vehicle_color: string
  plate_type: string
  plate_color: string

  // Offender Info card
  phone_number: string
  email_address: string
  violation_status: string
  payment_status: PaymentStatus

  // Evidence + history
  evidence: Evidence[]
  action_history: ActionHistoryItem[]
}