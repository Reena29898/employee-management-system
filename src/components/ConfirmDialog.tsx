import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <p className="text-sm text-ink-secondary">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-hairline-strong px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas-soft"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
