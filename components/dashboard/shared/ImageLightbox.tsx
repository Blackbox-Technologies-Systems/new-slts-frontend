"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
	images: string[];
	index: number | null;
	onClose: () => void;
	onIndexChange: (index: number) => void;
}

export function ImageLightbox({
	images,
	index,
	onClose,
	onIndexChange,
}: ImageLightboxProps) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
		if (index !== null) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [index]);

	// Handle keydown for navigation
	React.useEffect(() => {
		if (index === null) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft")
				onIndexChange((index - 1 + images.length) % images.length);
			if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [index, images, onClose, onIndexChange]);

	if (!mounted || index === null) return null;

	const handlePrev = (e: React.MouseEvent) => {
		e.stopPropagation();
		onIndexChange((index - 1 + images.length) % images.length);
	};

	const handleNext = (e: React.MouseEvent) => {
		e.stopPropagation();
		onIndexChange((index + 1) % images.length);
	};

	return createPortal(
		<div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 animate-in fade-in duration-200">
			<div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

			<button
				className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 z-10000 transition-colors cursor-pointer"
				onClick={onClose}
			>
				<X className="h-8 w-8" />
			</button>

			<button
				className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 z-10000 cursor-pointer"
				onClick={handlePrev}
			>
				<ChevronLeft className="h-10 w-10" />
			</button>

			<div
				className="relative w-[85vw] h-[85vh] max-w-5xl z-10 select-none"
				onClick={(e) => e.stopPropagation()}
			>
				<Image
					src={images[index]}
					alt={`Gallery Image ${index + 1}`}
					fill
					className="object-contain pointer-events-none"
					priority
				/>
			</div>

			<button
				className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 z-10000 cursor-pointer"
				onClick={handleNext}
			>
				<ChevronRight className="h-10 w-10" />
			</button>

			<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md z-10000">
				{index + 1} / {images.length}
			</div>
		</div>,
		document.body,
	);
}
