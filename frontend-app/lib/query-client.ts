// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:              1,
      refetchOnWindowFocus: false,
      staleTime:          60_000,   // 기본 1분
    },
  },
})

// staleTime 상수 (hooks에서 재사용)
export const STALE_TIME = {
  QUOTE:      60_000,         // 현재가: 1분
  CHART:      3_600_000,      // 차트: 1시간
  INDICATORS: 3_600_000,      // 기술적 지표: 1시간
  MARKET:     60_000,         // 시장 지수: 1분
  NEWS:       1_800_000,      // 뉴스: 30분
  SEARCH:     300_000,        // 검색: 5분
} as const
