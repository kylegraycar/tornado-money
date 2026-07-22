const NAMESPACE = 'tornado'

export type StorageKey = 'profile' | 'customOffers' | 'claimedOffers'

function key(name: StorageKey): string {
  return `${NAMESPACE}.${name}`
}

export function readStorage<T>(name: StorageKey, fallback: T): T {
  const raw = localStorage.getItem(key(name))
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(name: StorageKey, value: T): void {
  localStorage.setItem(key(name), JSON.stringify(value))
}

export function clearAllStorage(): void {
  const keys: StorageKey[] = ['profile', 'customOffers', 'claimedOffers']
  for (const k of keys) localStorage.removeItem(key(k))
}

export function exportAllData() {
  return {
    exportedAt: new Date().toISOString(),
    profile: readStorage('profile', null),
    customOffers: readStorage('customOffers', []),
    claimedOffers: readStorage('claimedOffers', []),
  }
}

export function importAllData(data: {
  profile?: unknown
  customOffers?: unknown
  claimedOffers?: unknown
}) {
  if (data.profile !== undefined) writeStorage('profile', data.profile)
  if (data.customOffers !== undefined)
    writeStorage('customOffers', data.customOffers)
  if (data.claimedOffers !== undefined)
    writeStorage('claimedOffers', data.claimedOffers)
}
