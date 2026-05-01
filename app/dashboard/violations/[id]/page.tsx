"use client"

import { useState, use } from "react"
import Link from "next/link"
import { ChevronRight, Edit2, X, Check, Camera, Video } from "lucide-react"
import {
	StatusBadge, PaymentBadge, CardRow, InfoCard,
	EvidenceLightbox, RejectModal, ApproveModal, EditModal,
} from "@/components/violations"

const MOCK: Violation = {
	pcn: "EDTKT74764",
	offender_first_name: "John",
	offender_last_name: "Wick",
	plate_number: "ABC-123-DE",
	violation_date: "15 Feb 2026",
	approval_status: "Approved",
	offence: "Disobeying traffic lights",
	fine: "₦10,000.00",
	event_type: "Red Light Running",
	command: "Command 1",
	zone: "Zone 1",
	violation_datetime: "25-March-2026 : 00:40:36",
	brand: "Toyota",
	vehicle_type: "Car",
	vehicle_color: "Gray",
	plate_type: "Visitor",
	plate_color: "White",
	phone_number: "08065412389",
	email_address: "johnwick@example.com",
	violation_status: "Active",
	payment_status: "Unpaid",
	evidence: [
		{ id: "1", type: "image", filename: "IMG_001.jpg", url: "" },
		{ id: "2", type: "image", filename: "IMG_001.jpg", url: "" },
		{ id: "3", type: "video", filename: "VID_001.jpg", url: "" },
		{ id: "4", type: "video", filename: "VID_001.jpg", url: "" },
		{ id: "5", type: "video", filename: "VID_001.jpg", url: "" },
		{ id: "6", type: "video", filename: "VID_001.jpg", url: "" },
		{ id: "7", type: "video", filename: "VID_001.jpg", url: "" },
		{ id: "8", type: "video", filename: "VID_001.jpg", url: "" },
	],
	action_history: [
		{ event: "Violation rejected", actor: "By Ahmad Shehu (Administrator)", timestamp: "16 FEB 2026 · 10:14 AM" },
		{ event: "Violation submitted for review", actor: "By James Danladi (Marshal MRS-00412)", timestamp: "15 FEB 2026 · 9:02 AM" },
		{ event: "Violation captured", actor: "Auto-captured — CCTV Unit 07", timestamp: "15 FEB 2026 · 8:30 AM" },
	],
}

function EvidenceThumbnail({ item, onClick }: { item: Evidence; onClick: () => void }) {
	return (
		<button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5 group">
			<div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center group-hover:border-slate-400 group-hover:bg-slate-200 transition-all">
				{item.type === "image"
					? <Camera className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
					: <Video className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />}
			</div>
			<span className="text-xs text-slate-500">{item.filename}</span>
		</button>
	)
}

type ActiveModal = "reject" | "approve" | "edit" | null

export default function ViolationDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const v = MOCK // TODO: replace with apiClient.get(`/violations/${id}`)
	void id

	const [activeModal, setActiveModal] = useState<ActiveModal>(null)
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

	return (
		<div className="p-6">
			<nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
				<Link href="/dashboard/violations" className="hover:text-slate-700 transition-colors">Violation</Link>
				<ChevronRight className="w-3.5 h-3.5" />
				<Link href="/dashboard/violations" className="hover:text-slate-700 transition-colors">View Violation</Link>
				<ChevronRight className="w-3.5 h-3.5" />
				<span className="text-slate-800 font-medium">{v.pcn}</span>
			</nav>

			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-slate-900">Violation</h1>
				<div className="flex gap-2">
					<button type="button" onClick={() => setActiveModal("edit")}
						className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
						<Edit2 className="w-4 h-4" /> Edit
					</button>
					<button type="button" onClick={() => setActiveModal("reject")}
						className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#BE0D00] text-white rounded-lg hover:bg-red-700 transition-colors">
						<X className="w-4 h-4" /> Reject
					</button>
					<button type="button" onClick={() => setActiveModal("approve")}
						className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#12823B] text-white rounded-lg hover:bg-green-700 transition-colors">
						<Check className="w-4 h-4" /> Approve
					</button>
				</div>
			</div>

			<div className="flex flex-wrap gap-10 mb-8">
				{[
					{ label: "Offender", value: `${v.offender_first_name} ${v.offender_last_name}` },
					{ label: "PCN NO", value: v.pcn },
					{ label: "Plate Number", value: v.plate_number },
					{ label: "Date", value: v.violation_date },
				].map(({ label, value }) => (
					<div key={label}>
						<p className="text-lg font-bold text-slate-900">{value}</p>
						<p className="text-xs text-slate-400 mt-0.5">{label}</p>
					</div>
				))}
				<div>
					<StatusBadge status={v.approval_status} />
					<p className="text-xs text-slate-400 mt-1.5">Status</p>
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-4 mb-6">
				<InfoCard title="Offence Info">
					<CardRow label="Offence">{v.offence}</CardRow>
					<CardRow label="Fine">{v.fine}</CardRow>
					<CardRow label="Event Type">{v.event_type}</CardRow>
					<CardRow label="Command">{v.command}</CardRow>
					<CardRow label="Zone">{v.zone}</CardRow>
					<CardRow label="Violation Date">{v.violation_datetime}</CardRow>
				</InfoCard>
				<InfoCard title="Vehicle Info">
					<CardRow label="Brand">{v.brand}</CardRow>
					<CardRow label="Type">{v.vehicle_type}</CardRow>
					<CardRow label="Vehicle Color">{v.vehicle_color}</CardRow>
					<CardRow label="Plate Number">{v.plate_number}</CardRow>
					<CardRow label="Plate Type">{v.plate_type}</CardRow>
					<CardRow label="Plate Color">{v.plate_color}</CardRow>
				</InfoCard>
				<InfoCard title="Offender Info">
					<CardRow label="Full Name">{v.offender_first_name} {v.offender_last_name}</CardRow>
					<CardRow label="Phone Number">{v.phone_number}</CardRow>
					<CardRow label="Email Address">{v.email_address}</CardRow>
					<CardRow label="Violation Status">{v.violation_status}</CardRow>
					<CardRow label="Payment Status"><PaymentBadge status={v.payment_status} /></CardRow>
				</InfoCard>
			</div>

			<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
				<h2 className="text-base font-bold text-slate-900 mb-4">Evidence</h2>
				<div className="flex flex-wrap gap-4">
					{v.evidence.map((item, i) => (
						<EvidenceThumbnail key={item.id} item={item} onClick={() => setLightboxIndex(i)} />
					))}
				</div>
			</div>

			<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
				<h2 className="text-base font-bold text-slate-900 mb-5">Action history</h2>
				{v.action_history.map((item, i) => (
					<div key={i} className="flex gap-4 pb-6 last:pb-0">
						<div className="flex flex-col items-center">
							<div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0 mt-1" />
							{i < v.action_history.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
						</div>
						<div className="flex-1 flex items-start justify-between">
							<div>
								<p className="text-sm font-semibold text-slate-800">{item.event}</p>
								<p className="text-xs text-slate-500 mt-0.5">{item.actor}</p>
							</div>
							<span className="text-xs text-slate-400 shrink-0 ml-4 whitespace-nowrap">{item.timestamp}</span>
						</div>
					</div>
				))}
			</div>

			<RejectModal open={activeModal === "reject"} v={v} onClose={() => setActiveModal(null)} />
			<ApproveModal open={activeModal === "approve"} v={v} onClose={() => setActiveModal(null)} />
			<EditModal open={activeModal === "edit"} v={v} onClose={() => setActiveModal(null)} />

			{lightboxIndex !== null && (
				<EvidenceLightbox
					items={v.evidence}
					index={lightboxIndex}
					onClose={() => setLightboxIndex(null)}
					onNav={setLightboxIndex}
				/>
			)}
		</div>
	)
}