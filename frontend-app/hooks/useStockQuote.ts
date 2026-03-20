// hooks/useStockQuote.ts
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/lib/api'
import { STALE_TIME } from '@/lib/query-client'
import { StockQuote } from '@/types/stock'

export function useStockQuote(symbol: string | null) {
  return useQuery({
    queryKey:  ['quote', symbol],
    queryFn:   () => fetcher<{ data: StockQuote }>(`/stock/quote?symbol=${symbol}`).then((r) => r.data),
    enabled:   !!symbol,
    staleTime: STALE_TIME.QUOTE,
  })
}
