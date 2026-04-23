"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResendPaymentModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedCount: number;
	onSend: (email?: string, phone?: string) => void;
}

export function ResendPaymentModal({
	isOpen,
	onClose,
	selectedCount,
	onSend,
}: ResendPaymentModalProps) {
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [isSending, setIsSending] = useState(false);

	const isMultiple = selectedCount > 1;

	const handleSend = () => {
		setIsSending(true);
		// Simulate API call
		setTimeout(() => {
			setIsSending(false);
			onSend(isMultiple ? undefined : email, isMultiple ? undefined : phone);
			onClose();
		}, 1000);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-106.25 top-18! right-6! bottom-auto! left-auto! translate-x-0! translate-y-0!">
				<DialogHeader>
					<DialogTitle className="text-xl">Payment summary</DialogTitle>
					<DialogDescription>
						Review and confirm payment for {selectedCount} violation
						{selectedCount === 1 ? "" : "s"}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{!isMultiple ? (
						<>
							<div className="grid gap-2">
								<label
									htmlFor="email"
									className="text-sm font-medium text-slate-500"
								>
									Email *
								</label>
								<Input
									id="email"
									type="email"
									placeholder="Enter email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<label
									htmlFor="phone"
									className="text-sm font-medium text-primary/50"
								>
									Phone Number *
								</label>
								<Input
									id="phone"
									type="tel"
									placeholder="Enter phone number"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</div>
						</>
					) : (
						<div className="rounded-md bg-slate-50 p-4 border border-primary/30">
							<p className="text-sm text-primary/60 leading-relaxed">
								Payment links for the {selectedCount} selected violations will
								be dispatched simultaneously to their respective registered
								contact email addresses and phone numbers.
							</p>
						</div>
					)}
				</div>

				<DialogFooter className="flex flex-col gap-4 sm:flex-row sm:gap-0">
					<Button
						variant="secondary"
						onClick={onClose}
						disabled={isSending}
						className="cursor-pointer"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSend}
						disabled={isSending || (!isMultiple && (!email || !phone))}
						className="w-full sm:w-auto cursor-pointer"
					>
						{isSending ? "Sending..." : "Send"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
