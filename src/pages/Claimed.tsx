import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import ConfirmDialog from '../components/ConfirmDialog'
import { formatCurrency, formatDate } from '../lib/format'
import type { ClaimedOffer } from '../types'

const statusStyles: Record<ClaimedOffer['status'], string> = {
  'in-progress':
    'bg-tornado-50 text-tornado-700 dark:bg-tornado-900/40 dark:text-tornado-300',
  completed:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  abandoned:
    'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400',
}

export default function Claimed() {
  const { claimedOffers, updateClaim, deleteClaim } = useAppData()
  const [completing, setCompleting] = useState<ClaimedOffer | null>(null)
  const [amountEarned, setAmountEarned] = useState('')
  const [abandoning, setAbandoning] = useState<ClaimedOffer | null>(null)
  const [deleting, setDeleting] = useState<ClaimedOffer | null>(null)

  const sorted = [...claimedOffers].sort(
    (a, b) => new Date(b.dateClaimed).getTime() - new Date(a.dateClaimed).getTime(),
  )

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400">
        You haven't claimed any offers yet. Head to the Offers page to find
        one that fits your cash.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map((claim) => (
        <div
          key={claim.id}
          className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold tracking-tight text-stone-900 dark:text-white">
                  {claim.offerSnapshot.institution}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[claim.status]}`}
                >
                  {claim.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Claimed {formatDate(claim.dateClaimed)} ·{' '}
                {formatCurrency(claim.cashAllocated)} allocated
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold tracking-tight text-tornado-600 dark:text-tornado-400">
                {claim.status === 'completed'
                  ? formatCurrency(claim.amountEarned ?? 0)
                  : formatCurrency(claim.offerSnapshot.bonusAmount)}
              </p>
              {claim.status === 'in-progress' && (
                <p className="text-xs text-stone-400 dark:text-stone-500">
                  expected bonus
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            {claim.status === 'in-progress' && (
              <>
                <button
                  type="button"
                  onClick={() => setAbandoning(claim)}
                  className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  Abandon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompleting(claim)
                    setAmountEarned(String(claim.offerSnapshot.bonusAmount))
                  }}
                  className="rounded-lg bg-tornado-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-tornado-700"
                >
                  Mark completed
                </button>
              </>
            )}
            {claim.status !== 'in-progress' && (
              <button
                type="button"
                onClick={() => setDeleting(claim)}
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      {completing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-stone-900">
            <h3 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
              Mark {completing.offerSnapshot.institution} completed
            </h3>
            <label className="mt-4 block text-sm font-medium text-stone-700 dark:text-stone-300">
              Amount actually earned
              <input
                type="number"
                min={0}
                value={amountEarned}
                onChange={(e) => setAmountEarned(e.target.value)}
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-1.5 text-stone-900 outline-none transition-shadow focus:border-tornado-400 focus:ring-2 focus:ring-tornado-200 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:ring-tornado-900/50"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCompleting(null)}
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateClaim(completing.id, {
                    status: 'completed',
                    amountEarned: Number(amountEarned) || 0,
                  })
                  setCompleting(null)
                }}
                className="rounded-lg bg-tornado-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-tornado-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {abandoning && (
        <ConfirmDialog
          title="Abandon this offer?"
          message="It'll be marked abandoned and its allocated cash will be freed up as available again."
          confirmLabel="Abandon"
          danger
          onCancel={() => setAbandoning(null)}
          onConfirm={() => {
            updateClaim(abandoning.id, { status: 'abandoned' })
            setAbandoning(null)
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove this record?"
          message="This permanently deletes this claim from your history."
          confirmLabel="Remove"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            deleteClaim(deleting.id)
            setDeleting(null)
          }}
        />
      )}
    </div>
  )
}
