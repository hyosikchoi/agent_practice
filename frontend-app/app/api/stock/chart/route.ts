// app/api/stock/chart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OHLCVData, Period } from '@/types/stock'

const PERIOD_MAP: Record<Period, { range: string; interval: string }> = {
  '1D': { range: '1d',  interval: '5m'  },
  '1W': { range: '5d',  interval: '1h'  },
  '1M': { range: '1mo', interval: '1d'  },
  '3M': { range: '3mo', interval: '1d'  },
  '1Y': { range: '1y',  interval: '1wk' },
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')
  const period = (req.nextUrl.searchParams.get('period') ?? '1M') as Period

  if (!symbol) {
    return NextResponse.json(
      { data: null, error: { code: 'MISSING_PARAM', message: 'symbol 파라미터가 필요합니다.' } },
      { status: 400 }
    )
  }

  const { range, interval } = PERIOD_MAP[period] ?? PERIOD_MAP['1M']

  try {
    const res = await fetch(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol=${symbol}&interval=${interval}&diffandsplits=false`,
      {
        headers: {
          'x-rapidapi-key':  process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': process.env.RAPIDAPI_HOST!,
        },
        next: { revalidate: 3600 },  // 1시간 캐시
      }
    )

    if (!res.ok) throw new Error(`Yahoo Finance API 오류: ${res.status}`)

    const json = await res.json()
    const items = json?.body ?? {}

    const ohlcv: OHLCVData[] = Object.entries(items)
      .map(([timestamp, v]: [string, any]) => ({
        time:   new Date(Number(timestamp) * 1000).toISOString().split('T')[0],
        open:   v.open,
        high:   v.high,
        low:    v.low,
        close:  v.close,
        volume: v.volume,
      }))
      .sort((a, b) => a.time.localeCompare(b.time))

    return NextResponse.json({ data: ohlcv, error: null })
  } catch (err) {
    console.error('[/api/stock/chart]', err)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: '차트 데이터를 불러오지 못했습니다.' } },
      { status: 500 }
    )
  }
}
