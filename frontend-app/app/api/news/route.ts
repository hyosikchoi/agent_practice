// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { NewsItem } from '@/types/stock'

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')
  const limit  = Number(req.nextUrl.searchParams.get('limit') ?? 10)

  if (!symbol) {
    return NextResponse.json(
      { data: null, error: { code: 'MISSING_PARAM', message: 'symbol 파라미터가 필요합니다.' } },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=${limit}&apikey=${process.env.FMP_API_KEY}`,
      { next: { revalidate: 1800 } }  // 30분 캐시
    )

    if (!res.ok) throw new Error(`FMP API 오류: ${res.status}`)

    const json: any[] = await res.json()

    const news: NewsItem[] = json.map((item) => ({
      id:          item.url,
      headline:    item.title,
      summary:     item.text?.slice(0, 200),
      source:      item.site,
      url:         item.url,
      publishedAt: item.publishedDate,
      sentiment:   'pending',  // Claude 감성분석 후 업데이트
      score:       0,
    }))

    return NextResponse.json({ data: news, error: null })
  } catch (err) {
    console.error('[/api/news]', err)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: '뉴스 데이터를 불러오지 못했습니다.' } },
      { status: 500 }
    )
  }
}
