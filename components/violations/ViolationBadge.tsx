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
        Paid: "text-green-600  bg-green-50   border-green-400",
        Unpaid: "text-red-500    bg-red-50     border-red-400",
        Pending: "text-yellow-600 bg-yellow-50  border-yellow-400",
        Overdue: "text-orange-600 bg-orange-50  border-orange-400"
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mediu, boder ${s[status]}`}>
            {status}
        </span>
    )
}