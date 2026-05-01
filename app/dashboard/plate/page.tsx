"use client"

// States:
//   idle     → empty search, "Results will appear here" placeholder
//   typing   → shows recent searches dropdown
//   results  → stat strip + 2 cards + violations table

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"



{/* Page */ }

type PageState = "idle" | "typing" | "results"

export default function PlateNumberPage() {
  const [query, setQuery] = useState("")
  const [pageState, setPageState] = useState<PageState>("idle")
  const [result, setResult] = useState<any>(null)
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

  }

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

      {/* Idle state */}
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

    </div>
  )
}