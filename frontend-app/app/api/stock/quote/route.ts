// app/api/stock/quote/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { StockQuote } from '@/types/stock'

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')
  if (!symbol) {
    return NextResponse.json(
      { data: null, error: { code: 'MISSING_PARAM', message: 'symbol 파라미터가 필요합니다.' } },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=${symbol}`,
      {
        headers: {
          'x-rapidapi-key':  process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': process.env.RAPIDAPI_HOST!,
        },
        next: { revalidate: 60 },  // 1분 캐시
      }
    )

    if (!res.ok) throw new Error(`Yahoo Finance API 오류: ${res.status}`)

    const json = await res.json()
    const raw  = json?.body?.[0]

    if (!raw) {
      return NextResponse.json(
        { data: null, error: { code: 'NOT_FOUND', message: `${symbol} 종목을 찾을 수 없습니다.` } },
        { status: 404 }
      )
    }

    const quote: StockQuote = {
      symbol:        raw.symbol,
      price:         raw.regularMarketPrice,
      open:          raw.regularMarketOpen,
      high:          raw.regularMarketDayHigh,
      low:           raw.regularMarketDayLow,
      previousClose: raw.regularMarketPreviousClose,
      change:        raw.regularMarketChange,
      changePercent: raw.regularMarketChangePercent,
      volume:        raw.regularMarketVolume,
      marketCap:     raw.marketCap,
      week52High:    raw.fiftyTwoWeekHigh,
      week52Low:     raw.fiftyTwoWeekLow,
      updatedAt:     new Date().toISOString(),
    }

    return NextResponse.json({ data: quote, error: null })
  } catch (err) {
    console.error('[/api/stock/quote]', err)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: '시세 데이터를 불러오지 못했습니다.' } },
      { status: 500 }
    )
  }
}
