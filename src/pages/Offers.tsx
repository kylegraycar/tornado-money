import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import OfferCard from '../components/OfferCard'
import ClaimModal from '../components/ClaimModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { fitsCash, isAlreadyClaimed } from '../lib/match'
import { formatDate } from '../lib/format'
import type { AccountType, Offer } from '../types'

type SortKey = 'bonus-desc' | 'min-deposit-asc'

export default function Offers() {
  const {
    allOffers,
    availableCash,
    claimedOffers,
    claimOffer,
    deleteCustomOffer,
    offersGeneratedAt,
    offersFromFallback,
    loadingOffers,
  } = useAppData()

  const [typeFilter, setTypeFilter] = useState<AccountType | 'all'>('all')
  const [onlyFits, setOnlyFits] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('bonus-desc')
  const [claiming, setClaiming] = useState<Offer | null>(null)
  const [deleting, setDeleting] = useState<Offer | null>(null)

  const visibleOffers = useMemo(() => {
    let offers = allOffers.filter(
      (o) => typeFilter === 'all' || o.accountType === typeFilter,
    )
    if (onlyFits) {
      offers = offers.filter((o) => fitsCash(o, availableCash))
    }
    offers = [...offers].sort((a, b) =>
      sortKey === 'bonus-desc'
        ? b.bonusAmount - a.bonusAmount
        : a.minDeposit - b.minDeposit,
    )
    return offers
  }, [allOffers, typeFilter, onlyFits, availableCash, sortKey])

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <p>
          Offers change frequently — verify details on the bank's site before
          opening an account.
        </p>
        {!loadingOffers && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Data generated {offersGeneratedAt ? formatDate(offersGeneratedAt.slice(0, 10)) : 'unknown'}
            {offersFromFallback &&
              ' · showing bundled offline copy (couldn\'t reach the latest data)'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as AccountType | 'all')}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">All account types</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="cd">CD</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="bonus-desc">Sort: highest bonus</option>
            <option value="min-deposit-asc">Sort: lowest deposit required</option>
          </select>
          <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyFits}
              onChange={(e) => setOnlyFits(e.target.checked)}
            />
            Fits my available cash
          </label>
        </div>
        <Link
          to="/offers/new"
          className="rounded-md bg-tornado-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-tornado-700"
        >
          + Add custom offer
        </Link>
      </div>

      {loadingOffers ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading offers…</p>
      ) : visibleOffers.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No offers match these filters.
        </p>
      ) : (
        <div className="space-y-3">
          {visibleOffers.map((offer) => (
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
