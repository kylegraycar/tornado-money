export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
          {hint}
        </p>
      )}
    </div>
  )
}
