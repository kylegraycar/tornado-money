import type { OffersFile } from '../types'
import { fallbackOffers } from '../data/offers.fallback'

export async function loadOffers(): Promise<{
  data: OffersFile
  fromFallback: boolean
}> {
  try {
    const res = await fetch('/offers.json', { cache: 'no-store' })
    if (!res.ok) throw new Error(`offers.json responded ${res.status}`)
    const data = (await res.json()) as OffersFile
    if (!Array.isArray(data.offers)) throw new Error('malformed offers.json')
    return { data, fromFallback: false }
  } catch {
    return { data: fallbackOffers, fromFallback: true }
  }
}
