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

const REJECTION_REASONS = [
  "Insufficient evidence",
  "Bus Insufficient evidence",
  "Duplicate violation",
  "Wrong offender identified",
  "Equipment/camera malfunction",
  "Violation issued in error",
  "Other (requires comment)",
]

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

// A labelled row inside an info card
function CardRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
        {label}
      </p>
      <div className="text-sm font-medium text-slate-800">{children}</div>
    </div>
  )
}

// Info cards wrapper
function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1 min-w-0">
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      {children}
    </div>
  )
}

function EvidenceThumbnail({ item, onClick }: { item: Evidence; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5 group">
      <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center group-hover:border-slate-400 group-hover:bg-slate-200 transition-all">
        {item.type === "image"
          ? <Camera className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
          : <Video className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
        }
      </div>
      <span className="text-xs text-slate-500">{item.filename}</span>
    </button>
  )
}

// Modal plumbing 
function ModalBackdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function ViolationReference({ v }: { v: Violation }) {
  return (
    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Violation reference</p>
        <p className="text-sm font-semibold text-slate-800">
          {v.pcn} — {v.offender_first_name} {v.offender_last_name} · {v.plate_number}
        </p>
      </div>
      <StatusBadge status={v.approval_status} />
    </div>
  )
}

// Reject modal
function RejectModal({ v, onClose }: { v: Violation; onClose: () => void }) {
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    if (!reason) return
    // TODO: PATCH /violations/:id/reject  → { reason, notes }
    console.log("Reject:", { reason, notes })
    onClose()
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Reject Violation?</h2>
            <p className="text-sm text-slate-500">This action will mark the violation as rejected</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <ViolationReference v={v} />

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            The marshal who captured this violation will be notified. This violation will no longer be eligible for payment unless re-submitted.
          </p>
        </div>

        {/* Reason dropdown */}
        <div className="mt-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Reason for rejection <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-slate-400"
            >
              <span className={reason ? "text-slate-800" : "text-slate-400"}>
                {reason || "e.g Incorrect vehicle information"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${open
                  ? "rotate-180"
                  : ""}`
                } 
              />
            </button>
            {open && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                {REJECTION_REASONS.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setReason(r); setOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                      ${reason === r ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="e.g Acura"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
          />
          <p className="text-xs text-slate-400 text-right mt-1">{notes.length}/500 characters</p>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="button" onClick={handleConfirm} disabled={!reason} className="px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Confirm Rejection</button>
        </div>
      </div>
    </ModalBackdrop>
  )
}

// Approve modal
const APPROVE_CHECKLIST = [
  "Evidence reviewed and valid",
  "Plate number confirmed",
  "Vehicle not on whitelist",
  "No active dispute on this violation",
]

function ApproveModal({ v, onClose }: { v: Violation; onClose: () => void }) {
  const [notes, setNotes] = useState("")

  const handleConfirm = () => {
    // TODO: PATCH /violations/:id/approve  → { notes }
    console.log("Approve:", { notes })
    onClose()
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Approve violation</h2>
            <p className="text-sm text-slate-500">This will mark the violation as approved and notify the offender</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <ViolationReference v={v} />

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Offense type", value: v.offence, highlight: false },
            { label: "Violation date", value: v.violation_date, highlight: false },
            { label: "Capturing marshal", value: "James Danladi", highlight: false },
            { label: "Fine amount", value: v.fine, highlight: true },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`p-3 rounded-xl ${highlight ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50"}`}>
              <p className="text-xs text-slate-500 mb-0.5">{label}</p>
              <p className={`text-sm font-semibold ${highlight ? "text-emerald-700" : "text-slate-800"}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {APPROVE_CHECKLIST.map(item => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-500" />
              </div>
              <span className="text-sm text-slate-700">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700">
            Once approved, the offender will be notified and the fine of <strong>{v.fine}</strong> becomes due for payment. This action is logged and cannot be undone without a new review.
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} maxLength={500} rows={3} placeholder="e.g Acura"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-slate-400 placeholder:text-slate-400" />
          <p className="text-xs text-slate-400 text-right mt-1">{notes.length}/500 characters</p>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="button" onClick={handleConfirm} className="px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">Confirm Approval</button>
        </div>
      </div>
    </ModalBackdrop>
  )
}

function EditModal({ v, onClose }: { v: Violation; onClose: () => void }) {
  const [form, setForm] = useState({
    offender_name: `${v.offender_first_name} ${v.offender_last_name}`,
    plate_number: v.plate_number,
    offense: v.offence,
    fine_amount: "5000",
    marshal: "James Danladi (MRS-00412)",
    violation_date: "02-15-2026",
    violation_time: "08:30 AM",
    location: "",
    notes: "",
  })

  // Generic field updater — one function handles every input
  const update = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = () => {
    // TODO: PATCH /violations/:id  → { ...form }
    console.log("Edit:", form)
    onClose()
  }

  const inp = "w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-400"

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit violation</h2>
            <p className="text-sm text-slate-500">Correct violation details before approving</p>
          </div>
          <button
            type="button"
            onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <ViolationReference v={v} />

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">Only correct factual errors. All edits are logged and visible in the action history. You can approve or reject after saving.</p>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Offender Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={form.offender_name} onChange={update("offender_name")} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Plate number <span className="text-red-500">*</span></label>
              <input type="text" value={form.plate_number} onChange={update("plate_number")} className={inp} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select Offence <span className="text-red-500">*</span></label>
            {/* TODO: replace with <select> from GET /offense-types */}
            <input type="text" value={form.offense} onChange={update("offense")} className={inp} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fine Amount <span className="text-red-500">*</span></label>
              <input type="text" value={form.fine_amount} onChange={update("fine_amount")} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assigned Marshal</label>
              {/* TODO: replace with searchable marshal dropdown */}
              <input type="text" value={form.marshal} onChange={update("marshal")} className={inp} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Violation date <span className="text-red-500">*</span></label>
              <input type="text" value={form.violation_date} onChange={update("violation_date")} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Violation time</label>
              <input type="text" value={form.violation_time} onChange={update("violation_time")} className={inp} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={update("location")} placeholder="Enter location" className={inp} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Additional notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={update("notes")}
              maxLength={500} rows={3}
              placeholder="e.g Acura"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-slate-400 placeholder:text-slate-400" />
            <p className="text-xs text-slate-400 text-right mt-1">{form.notes.length}/500 characters</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">Save Changes</button>
        </div>
      </div>
    </ModalBackdrop>
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

      {/* Info cards */}
      <div className="flex flex-1 flex-col lg:flex-row gap-4 mb-6">
        {/* Offence Info */}
        <InfoCard title="Offence Info">
          <CardRow label="Offence">{v.offence}</CardRow>
          <CardRow label="Fine">₦{Number(v.fine.replace(/[^0-9]/g, "")).toLocaleString()}.00</CardRow>
          <CardRow label="Event Type">{v.event_type}</CardRow>
          <CardRow label="Command">{v.command}</CardRow>
          <CardRow label="Zone">{v.zone}</CardRow>
          <CardRow label="Violation Date">{v.violation_datetime}</CardRow>
        </InfoCard>

        {/* Vehicle Info */}
        <InfoCard title="Vehicle Info">
          <CardRow label="Brand">{v.brand}</CardRow>
          <CardRow label="Type">{v.vehicle_type}</CardRow>
          <CardRow label="Vehicle Color">{v.vehicle_color}</CardRow>
          <CardRow label="Plate Number">{v.plate_number}</CardRow>
          <CardRow label="Plate Type">{v.plate_type}</CardRow>
          <CardRow label="Plate Color">{v.plate_color}</CardRow>
        </InfoCard>

        {/* Offender Info */}
        <InfoCard title="Offender Info">
          <CardRow label="Full Name">{v.offender_first_name} {v.offender_last_name}</CardRow>
          <CardRow label="Phone Number">{v.phone_number}</CardRow>
          <CardRow label="Email Address">{v.email_address}</CardRow>
          <CardRow label="Violation Status">{v.violation_status}</CardRow>
          <CardRow label="Payment Status"><PaymentBadge status={v.payment_status} /></CardRow>
        </InfoCard>
      </div>

      {/* Evidence */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Evidence</h2>
        <div className="flex flex-wrap gap-4">
          {v.evidence.map(item => (
            <EvidenceThumbnail
              key={item.id}
              item={item}
              onClick={() => setEvidenceItem(item)}
            />
          ))}
        </div>
      </div>

      {/* Action History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 mb-5">Action history</h2>
        {v.action_history.map((item, i) => (
          <div key={i} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0 mt-1" />
              {i < v.action_history.length - 1 && (
                <div className="w-px flex-1 bg-slate-200 mt-1" />
              )}
            </div>

            <div className="flex-1 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.event}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.actor}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 ml-4 whitespace-nowrap">{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {activeModal === "reject" && <RejectModal v={v} onClose={() => setActiveModal(null)} />}
      {activeModal === "approve" && <ApproveModal v={v} onClose={() => setActiveModal(null)} />}
      {activeModal === "edit" && <EditModal v={v} onClose={() => setActiveModal(null)} />}
    </div>
  )
}