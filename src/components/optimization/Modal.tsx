import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <DialogHeader>
                    <DialogTitle>Details</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
