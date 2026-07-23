import type { ReactNode } from 'react'

// Matches tokens like BONUS1500, CHECKING250, KDMB0526 — all-caps,
// at least one letter and one digit, 5+ characters — while avoiding
// plain acronyms (FDIC, ACH) or bare numbers ($30,000).
const PROMO_CODE_RE = /\b(?=[A-Z0-9]*[0-9])(?=[A-Z0-9]*[A-Z])[A-Z0-9]{5,}\b/g

export function highlightPromoCodes(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let lastIndex = 0
  const re = new RegExp(PROMO_CODE_RE)
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <code
        key={match.index}
        className="rounded bg-tornado-100 px-1 py-0.5 font-mono text-[0.85em] font-bold text-tornado-700 dark:bg-tornado-900/50 dark:text-tornado-200"
      >
        {match[0]}
      </code>,
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}
