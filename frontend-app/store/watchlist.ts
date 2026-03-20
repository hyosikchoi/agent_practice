// store/watchlist.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WatchlistItem } from '@/types/stock'

interface WatchlistState {
  items:        WatchlistItem[]
  addItem:      (item: Omit<WatchlistItem, 'addedAt'>) => void
  removeItem:   (symbol: string) => void
  hasItem:      (symbol: string) => boolean
  reorderItems: (from: number, to: number) => void
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (get().hasItem(item.symbol)) return
        set((state) => ({
          items: [...state.items, { ...item, addedAt: new Date().toISOString() }],
        }))
      },

      removeItem: (symbol) =>
        set((state) => ({
          items: state.items.filter((i) => i.symbol !== symbol),
        })),

      hasItem: (symbol) => get().items.some((i) => i.symbol === symbol),

      reorderItems: (from, to) =>
        set((state) => {
          const items = [...state.items]
          const [moved] = items.splice(from, 1)
          items.splice(to, 0, moved)
          return { items }
        }),
    }),
    {
      name: 'stockai-watchlist',  // localStorage 키
    }
  )
)
