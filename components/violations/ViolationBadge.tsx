import React from "react";

export function StatusBadge({ status }: { status: ApprovalStatus }) {
    const s: Record<ApprovalStatus, string> = {
        Approved: "text-[#12823B] bg-[#F2FFFB] border border-[#12823B]",
        Rejected: "text-[#BE0D00] bg-[#FFF5F4] border border-[#BE0D00]",
        Submitted: "text-[#010427]  bg-[#F8FAFC] border border-[#010427]",
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mediu, boder ${s[status]}`}>
            {status}
        </span>
    )
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
    const s: Record<PaymentStatus, string> = {
        Paid: "text-[#12823B] bg-[#F2FFFB] border border-[#12823B]",
        Unpaid: "text-[#BE0D00] bg-[#FFF5F4] border border-[#BE0D00]",
        Pending: "text-[#8A6C00] bg-[#FFFDF4] border border-[#8A6C00]",
        Overdue: "text-[#BE0D00] bg-[#FFF5F4] border border-[#BE0D00]"
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