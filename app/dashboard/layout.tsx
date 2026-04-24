import { GlobalFilterModal } from "@/components/dashboard/GlobalFilterModal";
import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { Topbar } from "@/components/dashboard/layout/Topbar";
import { CreateViolationModal } from "@/components/violations/CreateViolationModal";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Topbar />
				<main className="flex-1 overflow-y-auto py-6 px-20">{children}</main>
			</div>
			<CreateViolationModal /> 
			<GlobalFilterModal />
		</div>
	);
}
