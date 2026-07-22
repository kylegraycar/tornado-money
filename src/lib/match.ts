import type { ClaimedOffer, Offer } from '../types'

export function fitsCash(offer: Offer, availableCash: number): boolean {
  return offer.minDeposit <= availableCash
}

export function isAlreadyClaimed(
  offerId: string,
  claimedOffers: ClaimedOffer[],
): boolean {
  return claimedOffers.some(
    (c) => c.offerSnapshot.id === offerId && c.status !== 'abandoned',
  )
}

export function accountTypeLabel(type: Offer['accountType']): string {
  switch (type) {
    case 'checking':
      return 'Checking'
    case 'savings':
      return 'Savings'
    case 'cd':
      return 'CD'
  }
}
