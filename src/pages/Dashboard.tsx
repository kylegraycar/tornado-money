import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import StatCard from '../components/StatCard'
import OfferCard from '../components/OfferCard'
import ClaimModal from '../components/ClaimModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { formatCurrency } from '../lib/format'
import { fitsCash, isAlreadyClaimed } from '../lib/match'
import type { Offer } from '../types'

export default function Dashboard() {
  const {
    cashOnHand,
    setCashOnHand,
    availableCash,
    allOffers,
    claimedOffers,
    claimOffer,
    deleteCustomOffer,
  } = useAppData()
  const [cashInput, setCashInput] = useState(String(cashOnHand))
  const [claiming, setClaiming] = useState<Offer | null>(null)
  const [deleting, setDeleting] = useState<Offer | null>(null)

  const totalEarned = useMemo(
    () =>
      claimedOffers
        .filter((c) => c.status === 'completed')
        .reduce((sum, c) => sum + (c.amountEarned ?? 0), 0),
    [claimedOffers],
  )
  const pendingBonuses = useMemo(
    () =>
      claimedOffers
        .filter((c) => c.status === 'in-progress')
        .reduce((sum, c) => sum + c.offerSnapshot.bonusAmount, 0),
    [claimedOffers],
  )
  const cashTiedUp = useMemo(
    () =>
      claimedOffers
        .filter((c) => c.status === 'in-progress')
        .reduce((sum, c) => sum + c.cashAllocated, 0),
    [claimedOffers],
  )

  const bestFits = useMemo(
    () =>
      allOffers
        .filter(
          (o) =>
            fitsCash(o, availableCash) && !isAlreadyClaimed(o.id, claimedOffers),
        )
        .sort((a, b) => b.bonusAmount - a.bonusAmount)
        .slice(0, 3),
    [allOffers, availableCash, claimedOffers],
  )

  function saveCash() {
    const parsed = Number(cashInput)
    setCashOnHand(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Cash on hand
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            min={0}
            value={cashInput}
            onChange={(e) => setCashInput(e.target.value)}
            onBlur={saveCash}
            onKeyDown={(e) => e.key === 'Enter' && saveCash()}
            className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Available to deploy: <strong>{formatCurrency(availableCash)}</strong>{' '}
          ({formatCurrency(cashTiedUp)} tied up in offers you're working on)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total earned" value={formatCurrency(totalEarned)} />
        <StatCard
          label="Pending bonuses"
          value={formatCurrency(pendingBonuses)}
          hint="From offers still in progress"
        />
        <StatCard label="Cash tied up" value={formatCurrency(cashTiedUp)} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Best fits right now
          </h2>
          <Link
            to="/offers"
            className="text-sm font-medium text-tornado-600 hover:underline dark:text-tornado-400"
          >
            See all offers →
          </Link>
        </div>
        {bestFits.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Nothing fits your available cash right now. Check the full offers
            list — some may be worth saving up for.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {bestFits.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                availableCash={availableCash}
                alreadyClaimed={isAlreadyClaimed(offer.id, claimedOffers)}
                onClaim={() => setClaiming(offer)}
                onDelete={offer.isCustom ? () => setDeleting(offer) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {claiming && (
        <ClaimModal
          offer={claiming}
          onCancel={() => setClaiming(null)}
          onConfirm={(cashAllocated, dateClaimed) => {
            claimOffer(claiming, cashAllocated, dateClaimed)
            setClaiming(null)
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete custom offer?"
          message={`This removes "${deleting.institution}" from your offers list. This can't be undone.`}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            deleteCustomOffer(deleting.id)
            setDeleting(null)
          }}
        />
      )}
    </div>
  )
}
