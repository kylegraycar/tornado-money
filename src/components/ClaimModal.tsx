import { useState } from 'react'
import type { Offer } from '../types'
import { formatCurrency } from '../lib/format'

export default function ClaimModal({
  offer,
  onConfirm,
  onCancel,
}: {
  offer: Offer
  onConfirm: (cashAllocated: number, dateClaimed: string) => void
  onCancel: () => void
}) {
  const [cashAllocated, setCashAllocated] = useState(offer.minDeposit)
  const [dateClaimed, setDateClaimed] = useState(
    () => new Date().toISOString().slice(0, 10),
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-stone-900">
        <h3 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
          Claim {offer.institution}
        </h3>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Bonus of {formatCurrency(offer.bonusAmount)} — this will mark the
          cash you allocate as tied up until you complete or abandon it.
        </p>

        <label className="mt-4 block text-sm font-medium text-stone-700 dark:text-stone-300">
          Cash allocated
          <input
            type="number"
            min={0}
            value={cashAllocated}
            onChange={(e) => setCashAllocated(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-1.5 text-stone-900 outline-none transition-shadow focus:border-tornado-400 focus:ring-2 focus:ring-tornado-200 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:ring-tornado-900/50"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-stone-700 dark:text-stone-300">
          Date claimed
          <input
            type="date"
            value={dateClaimed}
            onChange={(e) => setDateClaimed(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-1.5 text-stone-900 outline-none transition-shadow focus:border-tornado-400 focus:ring-2 focus:ring-tornado-200 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:ring-tornado-900/50"
          />
        </label>

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
            onClick={() => onConfirm(cashAllocated, dateClaimed)}
            className="rounded-lg bg-tornado-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-tornado-700"
          >
            Confirm claim
          </button>
        </div>
      </div>
    </div>
  )
}
