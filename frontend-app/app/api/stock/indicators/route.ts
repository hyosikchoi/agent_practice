// app/api/stock/indicators/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { RSIData, MACDData, MAData } from '@/types/stock'

export async function GET(req: NextRequest) {
  const symbol    = req.nextUrl.searchParams.get('symbol')
  const indicator = req.nextUrl.searchParams.get('indicator') ?? 'RSI'

  if (!symbol) {
    return NextResponse.json(
      { data: null, error: { code: 'MISSING_PARAM', message: 'symbol 파라미터가 필요합니다.' } },
      { status: 400 }
    )
  }

  try {
    // RSI
    if (indicator === 'RSI') {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
        { next: { revalidate: 3600 } }
      )
      const json = await res.json()
      const raw  = json?.['Technical Analysis: RSI'] ?? {}
      const data: RSIData[] = Object.entries(raw)
        .map(([time, v]: [string, any]) => ({ time, value: parseFloat(v.RSI) }))
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(-100)

      return NextResponse.json({ data, error: null })
    }

    // MACD
    if (indicator === 'MACD') {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
        { next: { revalidate: 3600 } }
      )
      const json = await res.json()
      const raw  = json?.['Technical Analysis: MACD'] ?? {}
      const data: MACDData[] = Object.entries(raw)
        .map(([time, v]: [string, any]) => ({
          time,
          macd:      parseFloat(v.MACD),
          signal:    parseFloat(v.MACD_Signal),
          histogram: parseFloat(v.MACD_Hist),
        }))
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(-100)

      return NextResponse.json({ data, error: null })
    }

    // MA (이동평균선)
    if (indicator === 'MA') {
      const periods = [5, 20, 60, 120]
      const results: Record<string, MAData[]> = {}

      await Promise.all(
        periods.map(async (period) => {
          const res = await fetch(
            `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=${period}&series_type=close&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            { next: { revalidate: 3600 } }
          )
          const json = await res.json()
          const raw  = json?.['Technical Analysis: SMA'] ?? {}
          results[`ma${period}`] = Object.entries(raw)
            .map(([time, v]: [string, any]) => ({ time, value: parseFloat(v.SMA) }))
            .sort((a, b) => a.time.localeCompare(b.time))
            .slice(-200)
        })
      )

      return NextResponse.json({ data: results, error: null })
    }

    return NextResponse.json(
      { data: null, error: { code: 'INVALID_PARAM', message: '지원하지 않는 지표입니다.' } },
      { status: 400 }
    )
  } catch (err) {
    console.error('[/api/stock/indicators]', err)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: '지표 데이터를 불러오지 못했습니다.' } },
      { status: 500 }
    )
  }
}
