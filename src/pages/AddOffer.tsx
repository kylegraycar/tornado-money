import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import type { AccountType } from '../types'

export default function AddOffer() {
  const { addCustomOffer } = useAppData()
  const navigate = useNavigate()

  const [institution, setInstitution] = useState('')
  const [accountType, setAccountType] = useState<AccountType>('checking')
  const [bonusAmount, setBonusAmount] = useState('')
  const [minDeposit, setMinDeposit] = useState('')
  const [requirementsText, setRequirementsText] = useState('')
  const [apy, setApy] = useState('')
  const [termMonths, setTermMonths] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    addCustomOffer({
      institution: institution.trim(),
      accountType,
      bonusAmount: Number(bonusAmount) || 0,
      minDeposit: Number(minDeposit) || 0,
      requirements: requirementsText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      apy: apy ? Number(apy) : undefined,
      termMonths: termMonths ? Number(termMonths) : undefined,
      expirationDate: expirationDate || null,
      sourceUrl: sourceUrl.trim(),
      lastVerified: new Date().toISOString().slice(0, 10),
      notes: notes.trim() || undefined,
    })
    navigate('/offers')
  }

  const inputClasses =
    'mt-1 w-full rounded-lg border border-stone-300 px-3 py-1.5 text-stone-900 outline-none transition-shadow focus:border-tornado-400 focus:ring-2 focus:ring-tornado-200 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:ring-tornado-900/50'
  const labelClasses = 'block text-sm font-medium text-stone-700 dark:text-stone-300'

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <h2 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
        Add a custom offer
      </h2>

      <label className={labelClasses}>
        Institution
        <input
          required
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className={inputClasses}
        />
      </label>

      <label className={labelClasses}>
        Account type
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value as AccountType)}
          className={inputClasses}
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="cd">CD</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClasses}>
          Bonus amount ($)
          <input
            required
            type="number"
            min={0}
            value={bonusAmount}
            onChange={(e) => setBonusAmount(e.target.value)}
            className={inputClasses}
          />
        </label>
        <label className={labelClasses}>
          Minimum deposit ($)
          <input
            required
            type="number"
            min={0}
            value={minDeposit}
            onChange={(e) => setMinDeposit(e.target.value)}
            className={inputClasses}
          />
        </label>
      </div>

      <label className={labelClasses}>
        Requirements (one per line)
        <textarea
          value={requirementsText}
          onChange={(e) => setRequirementsText(e.target.value)}
          rows={4}
          className={inputClasses}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClasses}>
          APY (optional)
          <input
            type="number"
            step="0.01"
            min={0}
            value={apy}
            onChange={(e) => setApy(e.target.value)}
            className={inputClasses}
          />
        </label>
        <label className={labelClasses}>
          Term in months (optional, CDs)
          <input
            type="number"
            min={0}
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            className={inputClasses}
          />
        </label>
      </div>

      <label className={labelClasses}>
        Expiration date (optional)
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className={inputClasses}
        />
      </label>

      <label className={labelClasses}>
        Source URL (optional)
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className={inputClasses}
          placeholder="https://"
        />
      </label>

      <label className={labelClasses}>
        Notes (optional)
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputClasses}
        />
      </label>

      <button
        type="submit"
        className="rounded-lg bg-tornado-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-tornado-700"
      >
        Add offer
      </button>
    </form>
  )
}
