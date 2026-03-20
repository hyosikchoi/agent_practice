// store/ui.ts
import { create } from 'zustand'

const MAX_RECENTLY_VIEWED = 10

interface UIState {
  isWatchlistPanelOpen: boolean
  openWatchlistPanel:   () => void
  closeWatchlistPanel:  () => void
  toggleWatchlistPanel: () => void
  recentlyViewed:       string[]
  addRecentlyViewed:    (symbol: string) => void
}

export const useUIStore = create<UIState>()((set, get) => ({
  isWatchlistPanelOpen: false,

  openWatchlistPanel:   () => set({ isWatchlistPanelOpen: true }),
  closeWatchlistPanel:  () => set({ isWatchlistPanelOpen: false }),
  toggleWatchlistPanel: () =>
    set((state) => ({ isWatchlistPanelOpen: !state.isWatchlistPanelOpen })),

  recentlyViewed: [],

  addRecentlyViewed: (symbol) => {
    const current = get().recentlyViewed.filter((s) => s !== symbol)
    set({ recentlyViewed: [symbol, ...current].slice(0, MAX_RECENTLY_VIEWED) })
  },
}))
