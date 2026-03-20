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

// 목업 OHLCV 생성
function getMockOhlcv(days = 30): OHLCVData[] {
  let price = 80000 + Math.random() * 10000
  return Array.from({ length: days }, (_, i) => {
    const change = (Math.random() - 0.48) * 2000
    price = Math.max(price + change, 50000)
    const open  = Math.round(price)
    const close = Math.round(price + (Math.random() - 0.5) * 1500)
    const high  = Math.round(Math.max(open, close) + Math.random() * 800)
    const low   = Math.round(Math.min(open, close) - Math.random() * 800)
    return {
      time:   new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: Math.round(8000000 + Math.random() * 8000000),
    }
  })
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

  // RapidAPI 키 없으면 목업 반환
  if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your_rapidapi_key_here') {
    return NextResponse.json({ data: getMockOhlcv(30), error: null })
  }

  const { interval } = PERIOD_MAP[period] ?? PERIOD_MAP['1M']

  try {
    const res = await fetch(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol=${symbol}&interval=${interval}&diffandsplits=false`,
      {
        headers: {
          'x-rapidapi-key':  process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': process.env.RAPIDAPI_HOST!,
        },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) throw new Error(`Yahoo Finance API 오류: ${res.status}`)

    const json = await res.json()
    const items = json?.body ?? {}

    // 응답이 비어있으면 목업 반환
    if (!items || Object.keys(items).length === 0) {
      return NextResponse.json({ data: getMockOhlcv(30), error: null })
    }

    const ohlcv: OHLCVData[] = Object.entries(items)
      .map(([timestamp, v]: [string, any]) => ({
        time:   new Date(Number(timestamp) * 1000).toISOString().split('T')[0],
        open:   v.open   ?? 0,
        high:   v.high   ?? 0,
        low:    v.low    ?? 0,
        close:  v.close  ?? 0,
        volume: v.volume ?? 0,
      }))
      .filter((d) => d.open > 0)
      .sort((a, b) => a.time.localeCompare(b.time))

    return NextResponse.json({ data: ohlcv, error: null })
  } catch (err) {
    console.error('[/api/stock/chart]', err)
    // 에러 시 목업 반환
    return NextResponse.json({ data: getMockOhlcv(30), error: null })
  }
}
