// hooks/useNews.ts
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/lib/api'
import { STALE_TIME } from '@/lib/query-client'
import { NewsItem } from '@/types/stock'

export function useNews(symbol: string | null, limit = 10) {
  return useQuery({
    queryKey:  ['news', symbol, limit],
    queryFn:   () =>
      fetcher<{ data: NewsItem[] }>(`/news?symbol=${symbol}&limit=${limit}`).then((r) => r.data),
    enabled:   !!symbol,
    staleTime: STALE_TIME.NEWS,
  })
}
