"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RevenueAlertProps {
	title?: string;
	message?: string;
	className?: string;
}

export function RevenueAlert({
	title = "Revenue Collection Alert",
	message = "Collection rate is significantly low (0.13% collected). Current collection: ₦120,000 out of ₦95.8M potential revenue. Consider reviewing collection processes and enforcement strategies.",
	className,
}: RevenueAlertProps) {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div
			className={`flex items-center rounded-lg overflow-hidden bg-primary ${className}`}
		>
			{/* Icon Section - 30% */}
			<div className="w-[30%] h-full flex items-center justify-center">
				<div className="flex h-12 w-12 items-center justify-center rounded-full">
					<Bell className="h-6 w-6 text-white" />
				</div>
			</div>

			{/* Content Section - 70% */}
			<div className="w-[70%] flex items-center justify-between px-5 py-4">
				<div className="flex-1 min-w-0">
					<h4 className="text-base font-semibold text-white">{title}</h4>
					<p className="mt-1 text-sm text-gray-300 leading-relaxed">
						{message}
					</p>
				</div>

				{/* Close Button */}
				<Button
					variant="ghost"
					size="icon"
					className="shrink-0 h-8 w-8 rounded-full text-white hover:bg-primary/20 hover:text-white ml-4"
					onClick={() => setIsVisible(false)}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
