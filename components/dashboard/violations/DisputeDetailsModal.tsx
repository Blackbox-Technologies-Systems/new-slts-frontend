"use client";

import { useState } from "react";
import { Maximize2, Image as ImageIcon } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, formatDate } from "@/lib/utils";
import { ImageLightbox } from "@/components/dashboard/shared/ImageLightbox";
import { DisputeActions } from "./DisputeActions";
import type { Dispute } from "@/types";
import Image from "next/image";

interface DisputeDetailsModalProps {
	dispute: Dispute | null;
	isOpen: boolean;
	onClose: () => void;
}

export function DisputeDetailsModal({
	dispute,
	isOpen,
	onClose,
}: DisputeDetailsModalProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null,
	);

	if (!dispute) return null;

	const images = dispute.evidenceImages || [];

	return (
		<>
			<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
				<DialogContent
					className="min-w-xl md:max-w-106.25 top-18! right-6! bottom-auto! left-auto! translate-x-0! translate-y-0!"
					onInteractOutside={(e) => {
						if (selectedImageIndex !== null) {
							e.preventDefault();
						}
					}}
					onEscapeKeyDown={(e) => {
						if (selectedImageIndex !== null) {
							e.preventDefault();
						}
					}}
				>
					<DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
						<div className="space-y-1">
							<DialogTitle className="text-2xl font-bold text-accent-foreground">
								Dispute Details
							</DialogTitle>
							<p className="text-sm text-muted-foreground">
								PCN: {dispute.pcn}
							</p>
						</div>
						<DialogClose className="w-4 h-4 bg-primary" asChild />
					</DialogHeader>

					<DisputeActions dispute={dispute} onActionComplete={onClose} />

					<Accordion
						type="multiple"
						defaultValue={["dispute-info", "images", "video"]}
						className="w-full"
					>
						{/* Dispute Info Section */}
						<AccordionItem value="dispute-info" className="border-none">
							<AccordionTrigger className="hover:no-underline py-4 text-base font-semibold text-accent-foreground">
								<div className="flex items-center gap-2">
									<span>Dispute Info</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4 text-sm">
									<div className="flex justify-between items-start">
										<span className="text-muted-foreground">
											Dispute Reason
										</span>
										<span className="font-semibold text-right max-w-50">
											{dispute.disputeReason || "Wrong vehicle identified"}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-muted-foreground">Evidence</span>
										<button
											className="text-blue-400 hover:text-blue-500 font-semibold underline underline-offset-4 cursor-pointer transition-colors"
											onClick={() => {
												const imagesSection =
													document.getElementById("accordion-images");
												imagesSection?.scrollIntoView({ behavior: "smooth" });
											}}
										>
											View Evidence
										</button>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-muted-foreground">Action By</span>
										<span className="font-semibold">
											{dispute.actionBy || dispute.offender.name}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-muted-foreground">Action Date</span>
										<span className="font-semibold">
											{formatDate(dispute.disputeDate)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-muted-foreground">Feedback</span>
										<p className="w-[65%] text-sm font-semibold text-right">
											{dispute.feedback ||
												"The vehicle in the photo is a red Toyota Camry but my vehicle is a black Honda Civic. The plate number was cloned."}
										</p>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* Image Gallery Section */}
						<AccordionItem
							value="images"
							id="accordion-images"
							className="border-none"
						>
							<AccordionTrigger className="hover:no-underline py-4 text-base font-semibold text-accent-foreground">
								<span>Image</span>
							</AccordionTrigger>
							<AccordionContent>
								<div className="grid grid-cols-5 gap-2">
									{images.map((img, index) => (
										<div
											key={index}
											className="relative aspect-square rounded-md overflow-hidden cursor-pointer group"
											onClick={() => setSelectedImageIndex(index)}
										>
											<Image
												src={img}
												alt={`Evidence ${index + 1}`}
												fill
												className="object-cover transition-transform group-hover:scale-110"
											/>
											<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<Maximize2 className="h-4 w-4 text-white" />
											</div>
										</div>
									))}
									{images.length === 0 && (
										<div className="col-span-5 py-8 flex flex-col items-center justify-center bg-slate-50 rounded-lg text-muted-foreground border border-dashed">
											<ImageIcon className="h-8 w-8 mb-2 opacity-20" />
											<p>No images available</p>
										</div>
									)}
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* Video Section */}
						<AccordionItem value="video" className="border-none">
							<AccordionTrigger className="hover:no-underline py-4 text-base font-semibold text-accent-foreground">
								<span>Video</span>
							</AccordionTrigger>
							<AccordionContent>
								<div className="flex justify-between items-center py-2">
									<span className="text-muted-foreground">Upload Video</span>
									<span className="font-semibold">No</span>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</DialogContent>
			</Dialog>

			<ImageLightbox
				images={images}
				index={selectedImageIndex}
				onClose={() => setSelectedImageIndex(null)}
				onIndexChange={setSelectedImageIndex}
			/>
		</>
	);
}
