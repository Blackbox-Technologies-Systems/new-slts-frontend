"use client";

import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BaseTable } from "@/components/dashboard/shared/BaseTable";
import { ViolationStatsCard } from "@/components/dashboard/violations/ViolationStatsCard";
import { RevenueAlert } from "@/components/dashboard/shared/RevenueAlert";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardStat } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = "Paid" | "Unpaid" | "No Payment";
type OffenderStatus = "Active" | "Inactive" | "Whitelisted";

interface Offender {
  id: string;
  sn: number;
  name: string;
  plateNo: string;
  disputeDate: string;
  totalViolations: number;
  phoneNo: string;
  email: string;
  paymentStatus: PaymentStatus;
  status: OffenderStatus;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const OFFENDER_STATS: DashboardStat[] = [
  {
    title: "Total Offenders",
    value: 12480,
    icon: "AlertTriangle",
    change: { value: 2.1, trend: "up" },
  },
  {
    title: "Repeat Offenders",
    value: 3120,
    icon: "ChartNoAxesColumn",
    change: { value: 0.8, trend: "up" },
  },
  {
    title: "First-Time Offenders",
    value: 9360,
    icon: "AlertTriangle",
    change: { value: 1.3, trend: "up" },
  },
  {
    title: "Whitelisted",
    value: 48,
    icon: "CheckCircle2",
    change: { value: 0.2, trend: "down" },
  },
];

// ─── Dummy Data ───────────────────────────────────────────────────────────────
// TODO: Replace with useSWR("/offenders") when endpoint is ready

const BASE_OFFENDERS: Offender[] = [
  {
    id: "o1", sn: 1, name: "John Wick", plateNo: "ABC-123-DE",
    disputeDate: "15 FEB 2026\n8:30 AM", totalViolations: 540,
    phoneNo: "08065412389", email: "giafly@hotmail.com",
    paymentStatus: "No Payment", status: "Inactive",
  },
  {
    id: "o2", sn: 2, name: "Muneerah A.", plateNo: "FNS-427-P",
    disputeDate: "15 FEB 2026\n9:30 AM", totalViolations: 816,
    phoneNo: "07083465098", email: "mthurn@optonline.net",
    paymentStatus: "Unpaid", status: "Active",
  },
  {
    id: "o3", sn: 3, name: "David Oshodi", plateNo: "KJA-821-AA",
    disputeDate: "15 FEB 2026\n11:30 AM", totalViolations: 426,
    phoneNo: "08090234567", email: "crowemojo@hotmail.com",
    paymentStatus: "Unpaid", status: "Active",
  },
  {
    id: "o4", sn: 4, name: "Amina Bello", plateNo: "ABJ-554-KL",
    disputeDate: "08 FEB 2026\n2:15 PM", totalViolations: 130,
    phoneNo: "08134786554", email: "dgatwood@msn.com",
    paymentStatus: "Unpaid", status: "Whitelisted",
  },
  {
    id: "o5", sn: 5, name: "Chukwu Emeka", plateNo: "LSR-992-BN",
    disputeDate: "06 FEB 2026\n7:45 AM", totalViolations: 423,
    phoneNo: "08123456789", email: "bockelboy@att.net",
    paymentStatus: "Unpaid", status: "Whitelisted",
  },
  {
    id: "o6", sn: 6, name: "Fatima Yusuf", plateNo: "KAN-331-GH",
    disputeDate: "04 FEB 2026\n10:00 AM", totalViolations: 453,
    phoneNo: "09015678902", email: "ateniese@mac.com",
    paymentStatus: "No Payment", status: "Inactive",
  },
  {
    id: "o7", sn: 7, name: "Ibrahim Musa", plateNo: "ABJ-117-CD",
    disputeDate: "03 FEB 2026\n3:30 PM", totalViolations: 883,
    phoneNo: "09043210123", email: "miami@aol.com",
    paymentStatus: "Paid", status: "Active",
  },
  {
    id: "o8", sn: 8, name: "Ibrahim Musa", plateNo: "ABJ-117-CD",
    disputeDate: "03 FEB 2026\n3:30 PM", totalViolations: 177,
    phoneNo: "09043210123", email: "sumdumass@gmail.com",
    paymentStatus: "Paid", status: "Active",
  },
  {
    id: "o9", sn: 9, name: "Yusuf Abdullahi", plateNo: "ABJ-117-CD",
    disputeDate: "03 FEB 2026\n3:30 PM", totalViolations: 492,
    phoneNo: "09043210123", email: "frostman@mac.com",
    paymentStatus: "Paid", status: "Active",
  },
  {
    id: "o10", sn: 10, name: "Blessing Eze", plateNo: "ABJ-117-CD",
    disputeDate: "03 FEB 2026\n3:30 PM", totalViolations: 561,
    phoneNo: "09043210123", email: "hwestiii@mac.com",
    paymentStatus: "Paid", status: "Active",
  },
  // Pagination filler
  ...Array.from({ length: 20574 }, (_, i) => ({
    id: `o${i + 11}`,
    sn: i + 11,
    name: `Offender ${i + 11}`,
    plateNo: `PLT-${1000 + i}`,
    disputeDate: `0${(i % 9) + 1} FEB 2026\n${(i % 12) + 1}:00 AM`,
    totalViolations: Math.floor(Math.random() * 900) + 50,
    phoneNo: `080${String(10000000 + i).slice(0, 8)}`,
    email: `offender${i + 11}@example.com`,
    paymentStatus: (["Paid", "Unpaid", "No Payment"] as const)[i % 3],
    status: (["Active", "Inactive", "Whitelisted"] as const)[i % 3],
  })),
];

// ─── Badge helpers ────────────────────────────────────────────────────────────

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    Paid: "text-green-600 border-green-500 bg-transparent",
    Unpaid: "text-red-500 border-red-400 bg-transparent",
    "No Payment": "text-red-500 border-red-400 bg-transparent",
  };
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
      styles[status]
    )}>
      {status}
    </span>
  );
}

function StatusBadge({ status }: { status: OffenderStatus }) {
  const styles: Record<OffenderStatus, string> = {
    Active: "text-green-600 border-green-500 bg-transparent",
    Inactive: "text-red-500 border-red-400 bg-transparent",
    Whitelisted: "text-gray-500 border-gray-400 bg-transparent",
  };
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
      styles[status]
    )}>
      {status}
    </span>
  );
}

// ─── Table Columns ────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "sn",               label: "S/N" },
  { key: "name",             label: "Offender Name" },
  { key: "plateNo",          label: "Plate No." },
  { key: "disputeDate",      label: "Dispute Date" },
  { key: "totalViolations",  label: "Total Violation" },
  { key: "phoneNo",          label: "Phone No" },
  { key: "email",            label: "Email" },
  { key: "paymentStatus",    label: "Payment Status" },
  { key: "status",           label: "Status" },
  { key: "action",           label: "Action" },
];

const ITEMS_PER_PAGE = 10;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OffendersPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage]   = useState(1);
  const [searchQuery, setSearchQuery]   = useState("");
  const [dateRange, setDateRange]       = useState<DateRange | undefined>();

  // Client-side filter on dummy data
  // TODO: replace with SWR query params when API is ready
  const filtered = useMemo(() => {
    let data = BASE_OFFENDERS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.plateNo.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.phoneNo.includes(q)
      );
    }
    return data;
  }, [searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Offenders"
        description="Offenders"
        className="mt-0"
      />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {OFFENDER_STATS.map((stat) => (
          <ViolationStatsCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* ── Offenders Table ── */}
      <BaseTable<Offender>
        title="Offender Records"
        data={paginated}
        columns={COLUMNS}
        showFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search by name, plate number..."
        dateRange={dateRange}
        onDateChange={(range) => { setDateRange(range); setCurrentPage(1); }}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        renderRow={(offender) => (
          <tr
            key={offender.id}
            className="border-b border-border hover:bg-muted/30 transition-colors"
          >
            <td className="px-4 py-4 text-sm text-muted-foreground">
              {offender.sn}
            </td>
            <td className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap">
              {offender.name}
            </td>
            <td className="px-4 py-4 text-sm font-semibold text-foreground whitespace-nowrap">
              {offender.plateNo}
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground whitespace-pre-line">
              {offender.disputeDate}
            </td>
            <td className="px-4 py-4 text-sm text-foreground">
              {offender.totalViolations.toLocaleString()}
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
              {offender.phoneNo}
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">
              {offender.email}
            </td>
            <td className="px-4 py-4">
              <PaymentBadge status={offender.paymentStatus} />
            </td>
            <td className="px-4 py-4">
              <StatusBadge status={offender.status} />
            </td>
            <td className="px-4 py-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => router.push(`/dashboard/offenders/${offender.id}`)}
                aria-label="View offender"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        )}
      />

      <RevenueAlert />
    </div>
  );
}