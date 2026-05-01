"use client"

import { useState } from "react"
import { ModalBackdrop } from "./ModalBackdrop"
import { ViolationReference } from "../ViolationReference"
import { Check, Info, X } from "lucide-react"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"

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

    const handleConfirm = () => {
        // TODO: PATCH /violations/:id/approve  → { notes }
        // On success: toast.success() + refetch violation + onClose()
        console.log("Approve payload:", { notes })
        onClose()
    }

    return (
        <ModalBackdrop open={open} onClose={onClose}>
            <div className="flex items-start justify-between">
                <div>
                    <DialogTitle className="text-lg font-bold text-[#010427]">Approve violation</DialogTitle>
                    <DialogDescription className="text-sm text-[#64728B]">This will mark the violation as approved and notify the offender</DialogDescription>
                </div>
                {/* <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                    <X className="w-5 h-5" />
                </button> */}
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

            {/* Checklist */}
            <div className="mt-4 space-y-2">
                {CHECKLIST.map(item => (
                    <div key={item} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-[#12823B] flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#12823B]" />
                        </div>
                        <span className="text-sm text-slate-700">{item}</span>
                    </div>
                ))}
            </div>

            {/* Notice */}
            <div className="mt-4 p-3 bg-[#F2FFFB] border border-[#12823B] rounded-xl flex gap-2">
                <Info className="w-4 h-4 text-[#12823B] shrink-0 mt-0.5" />
                <p className="text-sm text-[#12823B]">
                    Once approved, the offender will be notified and the fine of <strong>{v.fine}</strong> becomes due for payment. This action is logged and cannot be undone without a new review.
                </p>
            </div>

            {/* Notes */}
            <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Additional notes (optional)
                </label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    maxLength={500} rows={3} placeholder="e.g Acura"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-400 text-right mt-1">{notes.length}/500 characters</p>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
                <button type="button" onClick={onClose}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                </button>
                <button type="button" onClick={handleConfirm}
                    className="px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
                    Confirm Approval
                </button>
            </div>
        </ModalBackdrop>
    )
}