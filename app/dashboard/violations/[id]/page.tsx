"use client"

import { useState, use } from "react"
import Link from "next/link"
import {
  ChevronRight, Edit2, X, Check,
  Camera, Video, AlertTriangle, Info, ChevronDown,
} from "lucide-react"

// Types 
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

// Mock data 
// TODO: Delete and replace with:
//   const violation = await apiClient.get(`/violations/${id}`).then(r => r.data)

const MOCK_VIOLATION: Violation = {
  pcn: "EDTKT74764",
  offender_first_name: "John",
  offender_last_name: "Wick",
  plate_number: "ABC-123-DE",
  violation_date: "15 Feb 2026",
  approval_status: "Approved",

  offence: "Disobeying traffic lights",
  fine: "₦10,000.00",
  event_type: "Red Light Running",
  command: "Command 1",
  zone: "Zone 1",
  violation_datetime: "25-March-2026 : 00:40:36",

  brand: "Toyota",
  vehicle_type: "Car",
  vehicle_color: "Gray",
  plate_type: "Visitor",
  plate_color: "White",

  phone_number: "08065412389",
  email_address: "johnwick@example.com",
  violation_status: "Active",
  payment_status: "Unpaid",

  evidence: [
    { id: "1", type: "image", filename: "IMG_001.jpg", url: "" },
    { id: "2", type: "image", filename: "IMG_001.jpg", url: "" },
    { id: "3", type: "video", filename: "VID_001.jpg", url: "" },
    { id: "4", type: "video", filename: "VID_001.jpg", url: "" },
    { id: "5", type: "video", filename: "VID_001.jpg", url: "" },
    { id: "6", type: "video", filename: "VID_001.jpg", url: "" },
    { id: "7", type: "video", filename: "VID_001.jpg", url: "" },
    { id: "8", type: "video", filename: "VID_001.jpg", url: "" },
  ],

  action_history: [
    { event: "Violation rejected", actor: "By Ahmad Shehu (Administrator)", timestamp: "16 FEB 2026 · 10:14 AM" },
    { event: "Violation submitted for review", actor: "By James Danladi (Marshal MRS-00412)", timestamp: "15 FEB 2026 · 9:02 AM" },
    { event: "Violation captured", actor: "Auto-captured — CCTV Unit 07", timestamp: "15 FEB 2026 · 8:30 AM" },
  ],
}

// Small shared atoms

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const s: Record<ApprovalStatus, string> = {
    Approved: "text-green-600 bg-green-50 border-green-400",
    Rejected: "text-red-500  bg-red-50   border-red-400",
    Submitted: "text-gray-600 bg-gray-50  border-gray-400",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s[status]}`}>
      {status}
    </span>
  )
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const s: Record<PaymentStatus, string> = {
    Paid: "text-green-600  bg-green-50   border-green-400",
    Unpaid: "text-red-500   bg-red-50    border-red-400",
    Pending: "text-yellow-600 bg-yellow-50  border-yellow-400",
    Overdue: "text-orange-600 bg-orange-50  border-orange-400",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s[status]}`}>
      {status}
    </span>
  )
}


// Main page

type ActiveModal = "reject" | "approve" | "edit" | null

export default function ViolationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  // TODO: replace with real fetch once backend is ready:
  //   const v = await apiClient.get(`/violations/${id}`).then(r => r.data)
  const v = MOCK_VIOLATION
  void id

  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [evidenceItem, setEvidenceItem] = useState<Evidence | null>(null)

  return (
    <div className="p-6">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
        <Link
          href="/dashboard/violations"
          className="hover:text-slate-700 transition-colors"
        >
          Violation
        </Link>

        <ChevronRight className="w-3.5 h-3.5" />

        <Link
          href="/dashboard/violations"
          className="hover:text-slate-700 transition-colors"
        >
          View Violation
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-medium">{v.pcn}</span>
      </nav>

      {/* ── Page heading + action buttons ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 pr-2">Violation</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveModal("edit")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("reject")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#BE0D00] text-white rounded-lg hover:bg-red-600 transition-colors hover:cursor-pointer"
          >
            <X className="w-4 h-4" />
            Reject
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("approve")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#12823B] text-white rounded-lg hover:bg-green-600 transition-colors hover:cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
        </div>
      </div>

      {/* 5-column stat strip */}
      <div className="flex flex-wrap gap-10 mb-8">
        {[
          { label: "Offender", value: `${v.offender_first_name} ${v.offender_last_name}`, badge: false },
          { label: "PCN NO", value: v.pcn, badge: false },
          { label: "Plate Number", value: v.plate_number, badge: false },
          { label: "Date", value: v.violation_date, badge: false },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-lg font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
        <div>
          <StatusBadge status={v.approval_status} />
          <p className="text-xs text-slate-400 mt-1.5">Status</p>
        </div>
      </div>
    </div>
  )
}