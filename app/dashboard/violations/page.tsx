"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { ViolationsTable } from "@/components/dashboard/violations/ViolationsTable";
import { RevenueAlert } from "@/components/dashboard/shared/RevenueAlert";
import type { Violation } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { openModal } from "@/store/slices/uiSlice";
import { MODAL_KEYS } from "@/constants";
import { useUI } from "@/hooks/useUI";

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
// Would replace these with API calls when ready

const VIOLATIONS_DATA: Violation[] = [
	{
		id: "v1",
		sn: 1,
		offender: {
			id: "o1",
			name: "John Wick",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=John",
		},
		pcn: "EDTKT74764",
		offenseType: "Obstruction on Highway",
		plateNo: "ABC-123-DE",
		amount: 5000,
		violationDate: "2025-02-12T08:30:00Z",
		status: "rejected",
		paymentStatus: "unpaid",
	},
	{
		id: "v2",
		sn: 2,
		offender: {
			id: "o2",
			name: "Muneerah A.",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Muneerah",
		},
		pcn: "EDTKT74764",
		offenseType: "Traffic Light Violation",
		plateNo: "FNS-427-P",
		amount: 10000,
		violationDate: "2025-02-12T09:30:00Z",
		status: "submitted",
		paymentStatus: "unpaid",
	},
	{
		id: "v3",
		sn: 3,
		offender: {
			id: "o3",
			name: "David Oshodi",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
		},
		pcn: "LAG482910",
		offenseType: "Illegal Parking",
		plateNo: "KJA-821-AA",
		amount: 5000,
		violationDate: "2025-02-11T11:30:00Z",
		status: "approved",
		paymentStatus: "paid",
	},
	{
		id: "v4",
		sn: 4,
		offender: {
			id: "o4",
			name: "Amina Bello",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Amina",
		},
		pcn: "EDTKT74765",
		offenseType: "Speeding",
		plateNo: "ABJ-554-KL",
		amount: 15000,
		violationDate: "2025-02-10T14:20:00Z",
		status: "submitted",
		paymentStatus: "unpaid",
	},
	{
		id: "v5",
		sn: 5,
		offender: {
			id: "o5",
			name: "Chukwu Emeka",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Chukwu",
		},
		pcn: "LAG482911",
		offenseType: "Wrong Way Driving",
		plateNo: "LSR-992-BN",
		amount: 20000,
		violationDate: "2025-02-10T16:45:00Z",
		status: "rejected",
		paymentStatus: "unpaid",
	},
	{
		id: "v6",
		sn: 6,
		offender: {
			id: "o6",
			name: "Fatima Yusuf",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Fatima",
		},
		pcn: "EDTKT74766",
		offenseType: "Obstruction on Highway",
		plateNo: "KAN-331-QH",
		amount: 5000,
		violationDate: "2025-02-09T07:15:00Z",
		status: "approved",
		paymentStatus: "paid",
	},
	{
		id: "v7",
		sn: 7,
		offender: {
			id: "o7",
			name: "Ibrahim Musa",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ibrahim",
		},
		pcn: "LAG482912",
		offenseType: "Traffic Light Violation",
		plateNo: "ABJ-117-CO",
		amount: 10000,
		violationDate: "2025-02-09T09:20:00Z",
		status: "approved",
		paymentStatus: "pending",
	},
	{
		id: "v8",
		sn: 8,
		offender: {
			id: "o8",
			name: "Grace Okafor",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Grace",
		},
		pcn: "EDTKT74768",
		offenseType: "Illegal Parking",
		plateNo: "LAG-284-EF",
		amount: 5000,
		violationDate: "2025-02-08T11:45:00Z",
		status: "submitted",
		paymentStatus: "unpaid",
	},
	{
		id: "v9",
		sn: 9,
		offender: {
			id: "o9",
			name: "Yusuf Abdullahi",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Yusuf",
		},
		pcn: "LAG482913",
		offenseType: "Speeding",
		plateNo: "KJA-445-ST",
		amount: 15000,
		violationDate: "2025-02-08T13:30:00Z",
		status: "rejected",
		paymentStatus: "unpaid",
	},
	{
		id: "v10",
		sn: 10,
		offender: {
			id: "o10",
			name: "Blessing Eze",
			avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Blessing",
		},
		pcn: "EDTKT74769",
		offenseType: "Wrong Way Driving",
		plateNo: "FNS-678-WQ",
		amount: 20000,
		violationDate: "2025-02-07T15:20:00Z",
		status: "approved",
		paymentStatus: "paid",
	},
	// Generate more dummy data for pagination
	...Array.from({ length: 20574 }, (_, i) => ({
		id: `v${i + 11}`,
		sn: i + 11,
		offender: {
			id: `o${i + 11}`,
			name: `Offender ${i + 11}`,
			avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${i + 11}`,
		},
		pcn: `PCN${100000 + i}`,
		offenseType: [
			"Speeding",
			"Illegal Parking",
			"Traffic Light Violation",
			"Obstruction",
		][i % 4],
		plateNo: `PLT-${1000 + i}`,
		amount: [5000, 10000, 20000][i % 3],
		violationDate: new Date(
			Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
		).toISOString(),
		status: (["submitted", "approved", "rejected"] as const)[i % 3],
		paymentStatus: (["paid", "unpaid", "pending"] as const)[i % 3],
	})),
];

export default function ViewViolationsPage() {
	const router = useRouter();
	  const { openModal } = useUI();

	const handleCreateViolation = () => {
		  openModal(MODAL_KEYS.CREATE_VIOLATION);
	};

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="flex items-center justify-between">
				<PageHeader
					title="View Violation"
					// description="Violation"
					className="mt-0"
				/>
				<Button
					size="sm"
					onClick={handleCreateViolation}
					className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
				>
					<Plus className="h-4 w-4 mr-1.5" />
					Create Violation
				</Button>
			</div>

			<ViolationsTable
				violations={VIOLATIONS_DATA}
				variant="full"
				showFilters
				showCheckboxes
				showPaymentColumn
				showActions
				title="Violation Records"
			/>

			<RevenueAlert />
		</div>
	);
}
