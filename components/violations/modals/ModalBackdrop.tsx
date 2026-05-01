"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ModalBackdropProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export function ModalBackdrop({ open, onClose, children }: ModalBackdropProps) {
    return (
        <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
            <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                <div className="p-6 max-h-[90vh] overflow-y-auto">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}