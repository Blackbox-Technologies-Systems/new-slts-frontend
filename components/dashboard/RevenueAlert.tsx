"use client";

import { useState } from "react";
import { BellRing, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RevenueAlertProps {
	title?: string;
	message?: string;
	className?: string;
}

export function RevenueAlert({
	title = "Revenue Collection Alert",
	message = "Collection rate is significantly low (0.13% collected). Current collection: ₦120,000 out of ₦95.8M potential revenue. Consider reviewing collection processes and enforcement strategies",
	className,
}: RevenueAlertProps) {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<div
			className={`flex items-stretch rounded-xl overflow-hidden shadow-lg ${className}`}
			style={{ minHeight: "145px" }}
		>
			{/* Icon Section — light blue/lavender left panel (~25–30% width) */}
			<div
				className="flex items-center justify-center px-6"
				style={{ backgroundColor: "#ECF4FF", minWidth: "90px", width: "28%" }}
			>
				<BellRing
					fill="var(--color-primary)"
					size={64}
					className="text-primary"
					// style={{ width: "32px", height: "32px" }}
					strokeWidth={2}
				/>
			</div>

			{/* Content Section — dark navy right panel */}
			<div
				className="relative flex-1 flex items-center px-5 py-4"
				style={{ backgroundColor: "var(--color-primary)" }}
			>
				{/* Close Button — absolute top-right */}
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2 h-7 w-7 rounded-full text-white hover:bg-white/10 hover:text-white"
					onClick={() => setIsVisible(false)}
					aria-label="Dismiss alert"
				>
					<X className="h-4 w-4" />
				</Button>

				{/* Text */}
				<div className="pr-8">
					<h4 className="text-sm font-semibold text-white leading-snug">
						{title}
					</h4>
					<p className="mt-1 text-xs text-gray-300 leading-relaxed">
						{message}
					</p>
				</div>
			</div>
		</div>
	);
}
