import { useRef, useState } from 'react'
import { useAppData } from '../context/AppDataContext'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Settings() {
  const { exportData, importData, clearAllData } = useAppData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  function handleExport() {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tornado-money-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      importData(parsed)
      setImportMessage('Data imported successfully.')
    } catch {
      setImportMessage('Could not read that file — make sure it\'s a Tornado Money backup JSON.')
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h2 className="font-semibold tracking-tight text-stone-900 dark:text-white">Privacy</h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
          Tornado Money stores everything — your cash amount, custom offers,
          and claimed-offer history — only in this browser's local storage.
          There's no account, no server, and no analytics. The app only ever
          fetches its own public offers data file; no personal information is
          ever sent anywhere.
        </p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h2 className="font-semibold tracking-tight text-stone-900 dark:text-white">Backup</h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
          Since your data lives only on this device, export a backup
          periodically or before switching browsers/computers.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg bg-tornado-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-tornado-700"
          >
            Export data
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="rounded-lg border border-stone-300 px-3.5 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Import data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {importMessage && (
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            {importMessage}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5 dark:border-red-900/50 dark:bg-red-900/10">
        <h2 className="font-semibold tracking-tight text-red-800 dark:text-red-300">
          Danger zone
        </h2>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">
          Permanently erase your cash amount, custom offers, and claim
          history from this browser.
        </p>
        <button
          type="button"
          onClick={() => setConfirmingClear(true)}
          className="mt-3 rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
        >
          Clear all data
        </button>
      </section>

      {confirmingClear && (
        <ConfirmDialog
          title="Clear all data?"
          message="This permanently deletes everything Tornado Money has stored in this browser. Consider exporting a backup first."
          confirmLabel="Clear everything"
          danger
          onCancel={() => setConfirmingClear(false)}
          onConfirm={() => {
            clearAllData()
            setConfirmingClear(false)
          }}
        />
      )}
    </div>
  )
}
