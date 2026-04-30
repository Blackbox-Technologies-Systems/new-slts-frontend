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
		<div 
			className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 animate-in fade-in duration-200"
			style={{ pointerEvents: "auto" }}
		>
			<div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

			<button
				className="absolute top-6 right-6 text-white opacity-50 hover:opacity-100 p-2 rounded-full bg-transparent hover:bg-white/10 z-10000 transition-all cursor-pointer"
				onClick={onClose}
			>
				<X className="h-6 w-6" />
			</button>

			<button
				className="absolute left-1/5 top-1/2 -translate-y-1/2 text-white opacity-50 hover:opacity-100 p-3 rounded-full bg-transparent hover:bg-white/10 z-10000 transition-all cursor-pointer"
				onClick={handlePrev}
			>
				<ChevronLeft className="h-8 w-8" />
			</button>

			<div
				className="relative w-[60vw] h-[70vh] max-w-4xl z-10 select-none shadow-2xl rounded-lg overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<Image
					src={images[index]}
					alt={`Gallery Image ${index + 1}`}
					fill
					className="pointer-events-none object-cover"
					priority
				/>
			</div>

			<button
				className="absolute right-1/5 top-1/2 -translate-y-1/2 text-white opacity-50 hover:opacity-100 p-3 rounded-full bg-transparent hover:bg-white/10 z-10000 transition-all cursor-pointer"
				onClick={handleNext}
			>
				<ChevronRight className="h-8 w-8" />
			</button>

			<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-3 py-1.5 text-sm rounded-full backdrop-blur-md z-10000 opacity-80">
				{index + 1} / {images.length}
			</div>
		</div>,
		document.body,
	);
}
