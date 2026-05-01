"use client"

import { useState } from "react"
import { ModalBackdrop } from "./ModalBackdrop"
import { AlertTriangle, X } from "lucide-react"
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
                    <h2 className="text-lg font-bold text-slate-900">Reject Violation?</h2>
                    <p className="text-sm text-slate-500">This action will mark the violation as rejected</p>
                </div>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
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
        </ModalBackdrop>
    )
}