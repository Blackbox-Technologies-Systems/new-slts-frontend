"use client"

import { useState } from "react"
import { ModalBackdrop } from "./ModalBackdrop"
import { AlertTriangle, ChevronDown, X } from "lucide-react"
import { ViolationReference } from "../ViolationReference"

const REJECTION_REASONS = [
    "Insufficient evidence",
    "Bus Insufficient evidence",
    "Duplicate violation",
    "Wrong offender identified",
    "Equipment/camera malfunction",
    "Violation issued in error",
    "Other (requires comment)",
]

interface RejectModalProps {
    open: boolean
    v: Violation
    onClose: () => void
}

export function RejectModal({ open, v, onClose }: RejectModalProps) {
    const [reason, setReason] = useState("")
    const [notes, setNotes] = useState("")
    const [dropOpen, setDropOpen] = useState(false)

    const handleConfirm = () => {
        if (!reason) return
        // TODO: PATCH /violations/:id/reject  → { reason, notes }
        // On success: toast.success() + refetch violation + onClose()
        console.log("Reject payload:", { reason, notes })
        onClose()
    }

    const reset = () => {
        setReason("")
        setNotes("")
        setDropOpen(false)
    }

    return (
        <ModalBackdrop open={open} onClose={() => {
            reset();
            onClose()
        }}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold text-[#010427]">Reject Violation?</h2>
                    <p className="text-sm text-slate-500">This action will mark the violation as rejected</p>
                </div>
                <button type="button" onClick={onClose} className="text-[#64748B] hover:text-slate-600 p-1 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <ViolationReference v={v} />

            {/* Warning */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                    The marshal who captured this violation will be notified. This violation will no longer be eligible for payment unless re-submitted.
                </p>
            </div>

            {/* Reason Dropdown */}
            <div className="mt-5">
                <label className="block text-sm font-semibold text-[#010427] mb-1.5">
                    Reason for rejection <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropOpen(v => !v)}
                        className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#64748B]"
                    >
                        <span className={reason ? "text-[#010427]" : "text-[#64748B]"}>
                            {reason || "e.g Incorrect vehicle information"}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${dropOpen ? "rotate-180" : ""}`} />
                    </button>
                    {dropOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                            {REJECTION_REASONS.map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => { setReason(r); setDropOpen(false) }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                                        ${reason === r ? "bg-[#010427] text-white" : "text-[#010427] hover:bg-slate-50"}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
                <label className="block text-sm font-semibold text-[#010427] mb-1.5">
                    Additional notes (optional)
                </label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    maxLength={500} rows={4} placeholder="e.g Acura"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-[#64748B] placeholder:text-[#64748B]"
                />
                <p className="text-xs text-[#64748B] text-right mt-1">{notes.length}/500 characters</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 justify-end">
                <button type="button" onClick={onClose}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-[#010427] border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                </button>
                <button type="button" onClick={handleConfirm} disabled={!reason}
                    className="px-5 py-2.5 text-sm font-semibold bg-[#010427] text-white rounded-xl hover:bg-[#010427] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Confirm Rejection
                </button>
            </div>
        </ModalBackdrop >
    )
}