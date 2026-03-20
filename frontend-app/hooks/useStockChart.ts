// hooks/useStockChart.ts
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/lib/api'
import { STALE_TIME } from '@/lib/query-client'
import { OHLCVData, Period } from '@/types/stock'

export function useStockChart(symbol: string | null, period: Period = '1M') {
  return useQuery({
    queryKey:  ['chart', symbol, period],
    queryFn:   () =>
      fetcher<{ data: OHLCVData[] }>(`/stock/chart?symbol=${symbol}&period=${period}`).then((r) => r.data),
    enabled:   !!symbol,
    staleTime: STALE_TIME.CHART,
  })
}
