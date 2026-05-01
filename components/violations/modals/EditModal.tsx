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
        </ModalBackdrop>
    )
}