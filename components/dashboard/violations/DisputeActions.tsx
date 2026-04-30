"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Dispute } from "@/types";

interface DisputeActionsProps {
	dispute: Dispute;
	onActionComplete: () => void;
}

const MOCK_SUPERVISORS = [
	{ id: "sup1", name: "Sarah Jenkins" },
	{ id: "sup2", name: "David Chen" },
	{ id: "sup3", name: "Michael Ojo" },
];

export function DisputeActions({
	dispute,
	onActionComplete,
}: DisputeActionsProps) {
	const [activeModal, setActiveModal] = useState<
		"uphold" | "escalate" | "overturn" | null
	>(null);
	const [selectedSupervisor, setSelectedSupervisor] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAction = async (action: string) => {
		setIsSubmitting(true);
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSubmitting(false);

		toast.success(`Dispute successfully ${action}`);
		setActiveModal(null);
		onActionComplete();
	};

	return (
		<div className="flex gap-3 py-4 border-b items-end justify-end">
			<Button
				variant="default"
				className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
				onClick={() => setActiveModal("uphold")}
			>
				Uphold
			</Button>
			<Button
				variant="default"
				className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
				onClick={() => setActiveModal("escalate")}
			>
				Escalate
			</Button>
			<Button
				variant="default"
				className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
				onClick={() => setActiveModal("overturn")}
			>
				Overturn
			</Button>

			{/* Uphold Confirmation Modal */}
			<Dialog
				open={activeModal === "uphold"}
				onOpenChange={(open) => !open && setActiveModal(null)}
			>
				<DialogContent className="sm:max-w-106.25">
					<DialogHeader>
						<DialogTitle>Confirm Uphold</DialogTitle>
						<DialogDescription>
							Are you sure you want to uphold this dispute? This will maintain
							the violation and fine. This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4">
						<Button
							variant="outline"
							onClick={() => setActiveModal(null)}
							disabled={isSubmitting}
							className="cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => handleAction("upheld")}
							disabled={isSubmitting}
							className="cursor-pointer"
						>
							{isSubmitting ? "Processing..." : "Yes, Uphold"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Escalate Modal */}
			<Dialog
				open={activeModal === "escalate"}
				onOpenChange={(open) => !open && setActiveModal(null)}
			>
				<DialogContent className="sm:max-w-106.25]">
					<DialogHeader>
						<DialogTitle>Escalate Dispute</DialogTitle>
						<DialogDescription>
							Select a supervisor to escalate this dispute to.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Select
							value={selectedSupervisor}
							onValueChange={setSelectedSupervisor}
						>
							<SelectTrigger className="w-full cursor-pointer">
								<SelectValue placeholder="Select a supervisor" />
							</SelectTrigger>
							<SelectContent>
								{MOCK_SUPERVISORS.map((sup) => (
									<SelectItem
										key={sup.id}
										value={sup.id}
										className="cursor-pointer"
									>
										{sup.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setActiveModal(null)}
							disabled={isSubmitting}
							className="cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
							onClick={() => handleAction("escalated")}
							disabled={!selectedSupervisor || isSubmitting}
						>
							{isSubmitting ? "Processing..." : "Escalate"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Overturn Confirmation Modal */}
			<Dialog
				open={activeModal === "overturn"}
				onOpenChange={(open) => !open && setActiveModal(null)}
			>
				<DialogContent className="sm:max-w-106.25">
					<DialogHeader>
						<DialogTitle>Confirm Overturn</DialogTitle>
						<DialogDescription>
							Are you sure you want to overturn this dispute? This will cancel
							the violation and clear the fine. This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4">
						<Button
							variant="outline"
							onClick={() => setActiveModal(null)}
							disabled={isSubmitting}
							className="cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
							onClick={() => handleAction("overturned")}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Processing..." : "Yes, Overturn"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
