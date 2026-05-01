"use client"

// States:
//   idle     → empty search, "Results will appear here" placeholder
//   typing   → shows recent searches dropdown
//   results  → stat strip + 2 cards + violations table

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronRight, Eye, Clock } from "lucide-react"
import type { PlateResult, PlateViolation, RecentSearch } from "@/types/violations"
import { CardRow, InfoCard, PaymentBadge } from "@/components/violations"

// Mock data
// TODO: replace with apiClient.post("/plate/search", { plate_number }) on submit

const MOCK_RESULT: PlateResult = {
  plate_number: "ABC-123-DE",
  pcn: "EDTKT74764",
  phone_number: "08065412389",
  brand: "Toyota",
  vehicle_type: "Car",
  vehicle_color: "Gray",
  plate_type: "Visitor",
  full_name: "John Wick",
  email_address: "johnwick@example.com",
  violation_status: "Active",
  payment_status: "Unpaid",
  violations: [
    { id: "1", pcn: "EDTKT74764", offense_type: "Obstruction on Highway", date: "15 FEB 2026 8:30 AM", approval_status: "Rejected", payment_status: "Unpaid" },
    { id: "2", pcn: "EDTKT74765", offense_type: "Traffic Light Violation", date: "15 FEB 2026 9:30 AM", approval_status: "Submitted", payment_status: "Pending" },
    { id: "3", pcn: "EDTKT74766", offense_type: "Illegal Parking", date: "15 FEB 2026 11:30 AM", approval_status: "Approved", payment_status: "Paid" },
  ],
}

const MOCK_RECENT: RecentSearch[] = [
  { plate: "ABC-123-DE", label: "2 mins ago" },
  { plate: "KJA-445-ST", label: "1 hour ago" },
  { plate: "FNS-427-P", label: "Yesterday" },
]

// Table header cell
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  )
}

{/* Page */ }

type PageState = "idle" | "typing" | "results"

export default function PlateNumberPage() {
  const [query, setQuery] = useState("")
  const [pageState, setPageState] = useState<PageState>("idle")
  const [result, setResult] = useState<PlateResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    if (pageState === "idle") setPageState("typing")
  }

  const handleChange = (value: string) => {
    setQuery(value)
    setPageState(value.length ? "typing" : "idle")
    if (result) setResult(null) // clear previous results when typing again
  }

  const handleSubmit = async (plate: string) => {
    if (!plate.trim()) return
    setQuery(plate)
    setPageState("results")
    setLoading(true)

    // TODO: replace with real API call:
    //   const data = await apiClient.post("/plate/search", { plate_number: plate })
    //   setResult(data)
    await new Promise(r => setTimeout(r, 600)) // simulate latency
    setResult(MOCK_RESULT)
    setLoading(false)
  }

  // Close recent dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        if (pageState === "typing" && !result) setPageState("idle")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [pageState, result])

  return (
    <div className="p-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
        <Link href="/dashboard" className="hover:text-slate-700 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-medium">Run plate number</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Run Plate Number</h1>

      {/* Search box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 relative">
        <div className="flex gap-3">
          <div className="flex-1 relative" ref={inputRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => handleChange(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={e => e.key === "Enter" && handleSubmit(query)}
              placeholder="Enter plate number e.g., ABC-123-DE"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
            />

            {/* Recent searches dropdown — visible while typing */}
            {pageState === "typing" && !result && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Recent search
                </p>
                {MOCK_RECENT.map(s => (
                  <button
                    key={s.plate}
                    type="button"
                    onClick={() => handleSubmit(s.plate)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {s.plate}
                    </span>
                    <span className="text-xs text-slate-400">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSubmit(query)}
            disabled={loading || !query.trim()}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Searching…" : "Submit"}
          </button>
        </div>
      </div>

      {/*  Idle state  */}
      {pageState === "idle" && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="mb-4 opacity-30">
            <rect x="4" y="18" width="48" height="32" rx="6" fill="currentColor" />
            <circle cx="58" cy="54" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
            <line x1="67" y1="63" x2="72" y2="68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <p className="text-sm">Results will appear here</p>
        </div>
      )}

      {/* ── Results ── */}
      {pageState === "results" && result && !loading && (
        <>
          {/* 3-column stat strip */}
          <div className="flex flex-wrap gap-10 mb-6">
            {[
              { label: "Plate Number", value: result.plate_number },
              { label: "PCN NO", value: result.pcn },
              { label: "Phone Number", value: result.phone_number },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-lg font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* 2 info cards — Vehicle Info + Offender Info */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <InfoCard title="Vehicle Info">
              <CardRow label="Brand">{result.brand}</CardRow>
              <CardRow label="Type">{result.vehicle_type}</CardRow>
              <CardRow label="Vehicle Color">{result.vehicle_color}</CardRow>
              <CardRow label="Plate Number">{result.plate_number}</CardRow>
              <CardRow label="Plate Type">{result.plate_type}</CardRow>
            </InfoCard>

            <InfoCard title="Offender Info">
              <CardRow label="Full Name">{result.full_name}</CardRow>
              <CardRow label="Phone Number">{result.phone_number}</CardRow>
              <CardRow label="Email Address">{result.email_address}</CardRow>
              <CardRow label="Violation Status">{result.violation_status}</CardRow>
              <CardRow label="Payment Status"><PaymentBadge status={result.payment_status} /></CardRow>
            </InfoCard>
          </div>
          
        </>
      )}
    </div>


  )
}