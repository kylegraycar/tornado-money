export type AccountType = 'checking' | 'savings' | 'cd'

export interface Offer {
  id: string
  institution: string
  accountType: AccountType
  bonusAmount: number
  minDeposit: number
  requirements: string[]
  termMonths?: number
  apy?: number
  expirationDate: string | null
  sourceUrl: string
  lastVerified: string
  notes?: string
  isCustom: boolean
}

export interface OffersFile {
  generatedAt: string
  offers: Offer[]
}

export type ClaimStatus = 'in-progress' | 'completed' | 'abandoned'

export interface ClaimedOffer {
  id: string
  offerSnapshot: Offer
  dateClaimed: string
  status: ClaimStatus
  cashAllocated: number
  amountEarned?: number
  notes?: string
}

export interface UserProfile {
  cashOnHand: number
}
