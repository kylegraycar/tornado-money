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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Claim {offer.institution}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bonus of {formatCurrency(offer.bonusAmount)} — this will mark the
          cash you allocate as tied up until you complete or abandon it.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Cash allocated
          <input
            type="number"
            min={0}
            value={cashAllocated}
            onChange={(e) => setCashAllocated(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Date claimed
          <input
            type="date"
            value={dateClaimed}
            onChange={(e) => setDateClaimed(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(cashAllocated, dateClaimed)}
            className="rounded-md bg-tornado-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-tornado-700"
          >
            Confirm claim
          </button>
        </div>
      </div>
    </div>
  )
}
