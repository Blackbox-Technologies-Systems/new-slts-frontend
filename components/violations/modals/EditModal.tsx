"use client"

import React, { useState } from "react"
import { ModalBackdrop } from "./ModalBackdrop"
import { Info, X } from "lucide-react"
import { ViolationReference } from "../ViolationReference"

interface EditModalProps {
    open: boolean
    v: Violation
    onClose: () => void
}

export function EditModal({ open, v, onClose }: EditModalProps) {
    const [form, setForm] = useState({
        offender_name: `${v.offender_first_name} ${v.offender_last_name}`,
        plate_number: v.plate_number,
        offense: v.offence,
        fine_amount: v.fine.replace(/[^0-9]/g, ""),
        marshal: "James Danladi (MRS-00412)",
        violation_date: "02-15-2026",
        violation_time: "08:30 AM",
        location: "",
        notes: "",
    })

    // Generic updater: one handler for every text input/textarea.
    const update = (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm(prev => ({ ...prev, [key]: e.target.value }))

    const handleSave = () => {
        // TODO: PATCH /violations/:id  → { ...form }
        // On success: toast.success() + refetch violation + onClose()
        console.log("Edit payload:", form)
        onClose()
    }

    const inp = "w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-400"

    return (
        <ModalBackdrop open={open} onClose={onClose}>
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Edit violation</h2>
                    <p className="text-sm text-slate-500">Correct violation details before approving</p>
                </div>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <ViolationReference v={v} />

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                    Only correct factual errors. All edits are logged and visible in the action history.
                    You can approve or reject after saving.
                </p>
            </div>

            <div className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Offender Full Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" value={form.offender_name} onChange={update("offender_name")} className={inp} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Plate number <span className="text-red-500">*</span>
                        </label>
                        <input type="text" value={form.plate_number} onChange={update("plate_number")} className={inp} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Select Offence <span className="text-red-500">*</span>
                    </label>
                    {/* TODO: replace with <select> populated from GET /offense-types */}
                    <input type="text" value={form.offense} onChange={update("offense")} className={inp} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Fine Amount <span className="text-red-500">*</span>
                        </label>
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
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Violation date <span className="text-red-500">*</span>
                        </label>
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
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Additional notes (optional)
                    </label>
                    <textarea value={form.notes} onChange={update("notes")}
                        maxLength={500} rows={3} placeholder="e.g Acura"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-slate-400 placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400 text-right mt-1">{form.notes.length}/500 characters</p>
                </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
                <button type="button" onClick={onClose}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                </button>
                <button type="button" onClick={handleSave}
                    className="px-5 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
                    Save Changes
                </button>
            </div>
        </ModalBackdrop>
    )
}