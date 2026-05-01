import { StatusBadge } from "./ViolationBadge";

// The reference pill that appears at the top of every modal
export function ViolationReference({ v }: { v: Violation }) {
    return (
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
                <p className="text-xs text-slate-500 mb-0.5">Violation reference</p>
                <p className="text-sm font-semibold text-[#010427]">
                    {v.pcn} — {v.offender_first_name} {v.offender_last_name} · {v.plate_number}
                </p>
            </div>
            <StatusBadge status={v.approval_status} />
        </div>
    )
}