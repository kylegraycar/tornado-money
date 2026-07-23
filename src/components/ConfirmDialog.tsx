export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  danger,
  onConfirm,
  onCancel,
}: {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <h3 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              danger
                ? 'rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700'
                : 'rounded-lg bg-tornado-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-tornado-700'
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
