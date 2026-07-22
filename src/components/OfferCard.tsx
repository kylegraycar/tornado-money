import type { Offer } from '../types'
import { formatCurrency, formatDate, daysUntil } from '../lib/format'
import { accountTypeLabel, fitsCash } from '../lib/match'

const typeColors: Record<Offer['accountType'], string> = {
  checking:
    'bg-tornado-50 text-tornado-700 dark:bg-tornado-900/40 dark:text-tornado-300',
  savings:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  cd: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export default function OfferCard({
  offer,
  availableCash,
  alreadyClaimed,
  onClaim,
  onDelete,
}: {
  offer: Offer
  availableCash: number
  alreadyClaimed: boolean
  onClaim: () => void
  onDelete?: () => void
}) {
  const fits = fitsCash(offer, availableCash)
  const expiresInDays = offer.expirationDate ? daysUntil(offer.expirationDate) : null

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {offer.institution}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[offer.accountType]}`}
            >
              {accountTypeLabel(offer.accountType)}
            </span>
            {offer.isCustom && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Your own find
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Requires {formatCurrency(offer.minDeposit)}
            {offer.apy != null ? ` · ${offer.apy}% APY` : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-tornado-700 dark:text-tornado-300">
            {formatCurrency(offer.bonusAmount)}
          </p>
          {!fits && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Needs {formatCurrency(offer.minDeposit - availableCash)} more
            </p>
          )}
        </div>
      </div>

      {offer.requirements.length > 0 && (
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {offer.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      )}

      {offer.notes && (
        <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400">
          {offer.notes}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
        <div>
          {offer.expirationDate ? (
            <span className={expiresInDays != null && expiresInDays <= 14 ? 'font-medium text-red-600 dark:text-red-400' : ''}>
              Expires {formatDate(offer.expirationDate)}
              {expiresInDays != null && expiresInDays >= 0 ? ` (${expiresInDays}d)` : ''}
            </span>
          ) : (
            <span>No fixed expiration</span>
          )}
          {' · '}
          <span>Verified {formatDate(offer.lastVerified)}</span>
        </div>
        {offer.sourceUrl && (
          <a
            href={offer.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-tornado-600 hover:underline dark:text-tornado-400"
          >
            View source ↗
          </a>
        )}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete
          </button>
        )}
        <button
          type="button"
          disabled={alreadyClaimed}
          onClick={onClaim}
          className="rounded-md bg-tornado-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-tornado-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          {alreadyClaimed ? 'Already claimed' : 'Claim'}
        </button>
      </div>
    </div>
  )
}
