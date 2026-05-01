"use client"

import { useState } from "react"
import { ModalBackdrop } from "./ModalBackdrop"
import { ViolationReference } from "../ViolationReference"
import { X } from "lucide-react"

const CHECKLIST = [
    "Evidence reviewed and valid",
    "Plate number confirmed",
    "Vehicle not on whitelist",
    "No active dispute on this violation",
]

interface ApproveModalProps {
    open: boolean
    v: Violation
    onClose: () => void
}

export function ApproveModal({ open, v, onClose }: ApproveModalProps) {
    const [notes, setNotes] = useState("")

    return (
        <ModalBackdrop open={open} onClose={onClose}>
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold text-[#010427]">Approve violation</h2>
                    <p className="text-sm text-[#64728B]">This will mark the violation as approved and notify the offender</p>
                </div>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <ViolationReference v={v} />

            {/* Summary grid */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                    { label: "Offense type", value: v.offence, highlight: false },
                    { label: "Violation date", value: v.violation_date, highlight: false },
                    { label: "Capturing marshal", value: "James Danladi", highlight: false },
                    { label: "Fine amount", value: v.fine, highlight: true },
                ].map(({ label, value, highlight }) => (
                    <div key={label} className={`p-3 rounded-xl ${highlight ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50"}`}>
                        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                        <p className={`text-sm font-semibold ${highlight ? "text-emerald-700" : "text-[#010427]"}`}>{value}</p>
                    </div>
                ))}
            </div>
        </ModalBackdrop>
    )
}