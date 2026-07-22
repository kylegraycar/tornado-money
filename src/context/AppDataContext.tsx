import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ClaimedOffer, Offer, UserProfile } from '../types'
import { loadOffers } from '../lib/offers'
import {
  clearAllStorage,
  exportAllData,
  importAllData,
  readStorage,
  writeStorage,
} from '../lib/storage'

interface AppDataContextValue {
  cashOnHand: number
  setCashOnHand: (amount: number) => void
  availableCash: number

  curatedOffers: Offer[]
  customOffers: Offer[]
  allOffers: Offer[]
  offersGeneratedAt: string | null
  offersFromFallback: boolean
  loadingOffers: boolean

  addCustomOffer: (offer: Omit<Offer, 'id' | 'isCustom'>) => void
  deleteCustomOffer: (id: string) => void

  claimedOffers: ClaimedOffer[]
  claimOffer: (offer: Offer, cashAllocated: number, dateClaimed: string) => void
  updateClaim: (
    claimId: string,
    updates: Partial<Pick<ClaimedOffer, 'status' | 'amountEarned' | 'notes'>>,
  ) => void
  deleteClaim: (claimId: string) => void

  exportData: () => ReturnType<typeof exportAllData>
  importData: (data: Parameters<typeof importAllData>[0]) => void
  clearAllData: () => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [cashOnHand, setCashOnHandState] = useState<number>(
    () => readStorage<UserProfile>('profile', { cashOnHand: 0 }).cashOnHand,
  )
  const [customOffers, setCustomOffers] = useState<Offer[]>(() =>
    readStorage('customOffers', []),
  )
  const [claimedOffers, setClaimedOffers] = useState<ClaimedOffer[]>(() =>
    readStorage('claimedOffers', []),
  )

  const [curatedOffers, setCuratedOffers] = useState<Offer[]>([])
  const [offersGeneratedAt, setOffersGeneratedAt] = useState<string | null>(
    null,
  )
  const [offersFromFallback, setOffersFromFallback] = useState(false)
  const [loadingOffers, setLoadingOffers] = useState(true)

  useEffect(() => {
    let cancelled = false
    loadOffers().then(({ data, fromFallback }) => {
      if (cancelled) return
      setCuratedOffers(data.offers)
      setOffersGeneratedAt(data.generatedAt)
      setOffersFromFallback(fromFallback)
      setLoadingOffers(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    writeStorage('profile', { cashOnHand })
  }, [cashOnHand])

  useEffect(() => {
    writeStorage('customOffers', customOffers)
  }, [customOffers])

  useEffect(() => {
    writeStorage('claimedOffers', claimedOffers)
  }, [claimedOffers])

  const availableCash = useMemo(() => {
    const allocated = claimedOffers
      .filter((c) => c.status === 'in-progress')
      .reduce((sum, c) => sum + c.cashAllocated, 0)
    return cashOnHand - allocated
  }, [cashOnHand, claimedOffers])

  const allOffers = useMemo(
    () => [...curatedOffers, ...customOffers],
    [curatedOffers, customOffers],
  )

  const value: AppDataContextValue = {
    cashOnHand,
    setCashOnHand: setCashOnHandState,
    availableCash,

    curatedOffers,
    customOffers,
    allOffers,
    offersGeneratedAt,
    offersFromFallback,
    loadingOffers,

    addCustomOffer: (offer) =>
      setCustomOffers((prev) => [
        ...prev,
        { ...offer, id: newId(), isCustom: true },
      ]),
    deleteCustomOffer: (id) =>
      setCustomOffers((prev) => prev.filter((o) => o.id !== id)),

    claimedOffers,
    claimOffer: (offer, cashAllocated, dateClaimed) =>
      setClaimedOffers((prev) => [
        ...prev,
        {
          id: newId(),
          offerSnapshot: offer,
          dateClaimed,
          status: 'in-progress',
          cashAllocated,
        },
      ]),
    updateClaim: (claimId, updates) =>
      setClaimedOffers((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, ...updates } : c)),
      ),
    deleteClaim: (claimId) =>
      setClaimedOffers((prev) => prev.filter((c) => c.id !== claimId)),

    exportData: exportAllData,
    importData: (data) => {
      importAllData(data)
      setCashOnHandState(
        readStorage<UserProfile>('profile', { cashOnHand: 0 }).cashOnHand,
      )
      setCustomOffers(readStorage('customOffers', []))
      setClaimedOffers(readStorage('claimedOffers', []))
    },
    clearAllData: () => {
      clearAllStorage()
      setCashOnHandState(0)
      setCustomOffers([])
      setClaimedOffers([])
    },
  }

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  )
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
