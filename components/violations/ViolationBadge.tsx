import React from "react";

export function StatusBadge({ status }: { status: ApprovalStatus }) {
    const s: Record<ApprovalStatus, string> = {
        Approved: "text-green-600 bg-green-50 border-green-400",
        Rejected: "text-red-500   bg-red-50    border-red-400",
        Submitted: "text-gray-600  bg-gray-50   border-gray-400",
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mediu, boder ${s[status]}`}>
            {status}
        </span>
    )
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
    const s: Record<PaymentStatus, string> = {
        Paid: "text-green-600 bg-green-50 border-green-400",
        Unpaid: "text-red-500 bg-red-50 border-red-400",
        Pending: "text-yellow-600 bg-yellow-50 border-yellow-400",
        Overdue: "text-orange-600 bg-orange-50 border-orange-400"
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mediu, boder ${s[status]}`}>
            {status}
        </span>
    )
}

// A single labelled row inside an info card.
export function CardRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="py-3 border-b border-slate-100 last:border-0">
            <p className="text-[10px] font-semibold uppercase trackiing-wider text-[#64748B] mb-0.5">
                {label}
            </p>
            <div className="text-sm font-medium text-[#010427]">
                {children}
            </div>
        </div>
    )
}

export function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-[#00000014] shadow-sm p-5 flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#010427]">{title}</h3>
            {children}
        </div>
    )
}