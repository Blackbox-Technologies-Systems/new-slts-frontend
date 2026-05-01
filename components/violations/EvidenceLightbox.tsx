"use client"

import { Camera, ChevronLeft, ChevronRight, Video, X } from "lucide-react"
import { useCallback, useEffect } from "react"

interface EvidenceLightboxProps {
    items: Evidence[]
    index: number
    onClose: () => void
    onNav: (newIndex: number) => void
}

export function EvidenceLightbox({ items, index, onClose, onNav }: EvidenceLightboxProps) {
    const item = items[index]
    const hasPrev = index > 0
    const hasNext = index < items.length - 1

    // Keyboard navigation - arrow keys + Escape
    const handleKey = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
        if (e.key === "ArrowLeft" && hasPrev) onNav(index - 1)
        if (e.key === "ArrowRight" && hasNext) onNav(index + 1)
    }, [index, hasPrev, hasNext, onClose, onNav])

    useEffect(() => {
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [handleKey])

    if (!item) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
            onClick={onClose}
        >
            {/* Close */}
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Close"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {index + 1} / {items.length}
            </div>

            {/* Prev */}
            {hasPrev && (
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onNav(index - 1) }}
                    className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {/* Next */}
            {hasNext && (
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onNav(index + 1) }}
                    className="absolute right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Next"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Media */}
            <div
                className="flex flex-col items-center gap-3"
                onClick={e => e.stopPropagation()}
            >
                {/* TODO: replace the placeholder div below with:
              image → <img src={item.url} className="max-h-[75vh] max-w-[80vw] rounded-xl object-contain" />
              video → <video src={item.url} controls className="max-h-[75vh] max-w-[80vw] rounded-xl" />
        */}
                <div className="w-160 max-w-[80vw] h-120 max-h-[70vh] bg-slate-800 rounded-xl flex flex-col items-center justify-center gap-3">
                    {item.type === "image"
                        ? <Camera className="w-16 h-16 text-slate-600" />
                        : <Video className="w-16 h-16 text-slate-600" />
                    }
                    <span className="text-slate-500 text-sm">Connect backend to display evidence</span>
                </div>

                <p className="text-white/60 text-sm">{item.filename}</p>

                {/* Thumbnail strip */}
                <div className="flex gap-2 mt-1">
                    {items.map((thumb, i) => (
                        <button
                            key={thumb.id}
                            type="button"
                            onClick={e => { e.stopPropagation(); onNav(i) }}
                            className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${i === index
                                    ? "border-white bg-white/20"
                                    : "border-white/20 bg-white/5 hover:border-white/50"
                                }`}
                            aria-label={`View ${thumb.filename}`}
                        >
                            {thumb.type === "image"
                                ? <Camera className="w-4 h-4 text-white/70" />
                                : <Video className="w-4 h-4 text-white/70" />
                            }
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}