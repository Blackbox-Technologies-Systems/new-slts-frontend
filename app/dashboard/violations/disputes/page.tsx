"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { DisputesTable } from "@/components/dashboard/violations/DisputesTable";
import { RevenueAlert } from "@/components/dashboard/shared/RevenueAlert";
import type { Dispute } from "@/types";

const DISPUTES_DATA: Dispute[] = [
	{
		id: "d1",
		sn: 1,
		offender: { id: "o1", name: "John Wick" },
		pcn: "EDTKT74764",
		offenseType: "Obstruction on Highway",
		plateNo: "ABC-123-DE",
		disputeDate: "2026-02-15T08:30:00Z",
		amount: 5000,
		status: "under_review",
		disputeReason: "Wrong vehicle identified",
		evidenceImages: [
			"https://images.unsplash.com/photo-1544333346-64e4fe18204b?q=80&w=1470&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1470&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1528&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1528&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1470&auto=format&fit=crop",
		],
		actionBy: "John Wick",
		actionDate: "2026-02-12T00:00:00Z",
		feedback: "The vehicle in the photo is a red Toyota Camry but my vehicle is a black Honda Civic. The plate number was cloned.",
	},
	{
		id: "d2",
		sn: 2,
		offender: { id: "o2", name: "Muneerah A." },
		pcn: "EDTKT74765",
		offenseType: "Traffic Light Violation",
		plateNo: "FNS-427-P",
		disputeDate: "2026-02-15T09:30:00Z",
		amount: 15000,
		status: "escalated",
		disputeReason: "Signal was amber",
		evidenceImages: [
			"https://images.unsplash.com/photo-1545129139-1beb780cf337?q=80&w=1374&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1566150905458-1bf1fd111c90?q=80&w=1470&auto=format&fit=crop",
		],
		feedback: "I was already half-way through the intersection when the light turned red. The sensor triggered prematurely.",
	},
	{
		id: "d3",
		sn: 3,
		offender: { id: "o3", name: "David Oshodi" },
		pcn: "LAG482910",
		offenseType: "Illegal Parking",
		plateNo: "KJA-821-AA",
		disputeDate: "2026-02-15T11:30:00Z",
		amount: 10000,
		status: "upheld",
	},
	{
		id: "d4",
		sn: 4,
		offender: { id: "o4", name: "Amina Bello" },
		pcn: "EDTKT74766",
		offenseType: "Speeding",
		plateNo: "ABJ-554-KL",
		disputeDate: "2026-02-08T14:15:00Z",
		amount: 3000,
		status: "upheld",
	},
	{
		id: "d5",
		sn: 5,
		offender: { id: "o5", name: "Chukwu Emeka" },
		pcn: "LAG512847",
		offenseType: "Wrong Way Driving",
		plateNo: "LSR-992-BN",
		disputeDate: "2026-02-06T07:45:00Z",
		amount: 2000,
		status: "open",
	},
	{
		id: "d6",
		sn: 6,
		offender: { id: "o6", name: "Fatima Yusuf" },
		pcn: "EDTKT74767",
		offenseType: "Obstruction on Highway",
		plateNo: "KAN-331-GH",
		disputeDate: "2026-02-04T10:00:00Z",
		amount: 15000,
		status: "overturned",
	},
	{
		id: "d7",
		sn: 7,
		offender: { id: "o7", name: "Ibrahim Musa" },
		pcn: "LAG623918",
		offenseType: "Traffic Light Violation",
		plateNo: "ABJ-117-CD",
		disputeDate: "2026-02-03T15:30:00Z",
		amount: 10000,
		status: "open",
	},
	{
		id: "d8",
		sn: 8,
		offender: { id: "o8", name: "Grace Okonkwo" },
		pcn: "EDTKT74768",
		offenseType: "Illegal Parking",
		plateNo: "LAG-284-EF",
		disputeDate: "2026-02-09T12:00:00Z",
		amount: 5000,
		status: "escalated",
	},
	{
		id: "d9",
		sn: 9,
		offender: { id: "o9", name: "Yusuf Abdullahi" },
		pcn: "LAG734029",
		offenseType: "Speeding",
		plateNo: "KJA-445-ST",
		disputeDate: "2026-02-01T08:00:00Z",
		amount: 5000,
		status: "escalated",
	},
	{
		id: "d10",
		sn: 10,
		offender: { id: "o10", name: "Blessing Eze" },
		pcn: "EDTKT74769",
		offenseType: "Wrong Way Driving",
		plateNo: "FNS-678-UV",
		disputeDate: "2026-02-10T16:45:00Z",
		amount: 20000,
		status: "overturned",
	},
	// Extra data for pagination demo
	...Array.from({ length: 20574 }, (_, i) => ({
		id: `d${i + 11}`,
		sn: i + 11,
		offender: { id: `o${i + 11}`, name: `Offender ${i + 11}` },
		pcn: `PCN${100000 + i}`,
		offenseType: [
			"Speeding",
			"Illegal Parking",
			"Traffic Light Violation",
			"Obstruction",
		][i % 4],
		plateNo: `PLT-${1000 + i}`,
		amount: [2000, 5000, 10000, 15000][i % 4],
		disputeDate: new Date(
			Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
		).toISOString(),
		status: (
			["under_review", "escalated", "upheld", "open", "overturned"] as const
		)[i % 5],
		disputeReason: [
			"Wrong vehicle",
			"Cloned plate",
			"Signal amber",
			"Illegal parking",
		][i % 4],
		evidenceImages: [
			"https://images.unsplash.com/photo-1544333346-64e4fe18204b?q=80&w=1470&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1470&auto=format&fit=crop",
		],
	})),
];

export default function DisputesPage() {
	return (
		<div className="space-y-6 animate-fade-in">
			<PageHeader
				title="Disputes"
				breadcrumbs={[
					{ label: "Violation", href: "/dashboard/violations" },
					{ label: "Disputes", href: "/dashboard/violations/disputes" },
				]}
			/>

			<DisputesTable disputes={DISPUTES_DATA} showFilters={true} />

			<RevenueAlert />
		</div>
	);
}
