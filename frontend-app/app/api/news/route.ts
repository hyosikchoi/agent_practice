// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { NewsItem } from '@/types/stock'

// FMP API 키가 없을 때 사용할 목업 뉴스
function getMockNews(symbol: string): NewsItem[] {
  return [
    {
      id:          `${symbol}-1`,
      headline:    `[목업] ${symbol}, 기관 투자자 매수세 유입...상승 모멘텀 기대`,
      summary:     '최근 기관 투자자들의 매수세가 집중되며 주가 상승에 대한 기대감이 높아지고 있다.',
      source:      '연합뉴스',
      url:         '#',
      publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
      sentiment:   'positive',
      score:       0.78,
    },
    {
      id:          `${symbol}-2`,
      headline:    `[목업] ${symbol} 실적 발표 앞두고 시장 관심 집중`,
      summary:     '다가오는 실적 발표를 앞두고 시장의 관심이 집중되고 있다.',
      source:      '한국경제',
      url:         '#',
      publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      sentiment:   'neutral',
      score:       0.12,
    },
    {
      id:          `${symbol}-3`,
      headline:    `[목업] 글로벌 반도체 수요 회복세...${symbol} 수혜 전망`,
      summary:     '글로벌 반도체 수요가 회복세를 보이며 관련 종목들의 실적 개선이 기대된다.',
      source:      '매일경제',
      url:         '#',
      publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      sentiment:   'positive',
      score:       0.65,
    },
    {
      id:          `${symbol}-4`,
      headline:    `[목업] 환율 변동성 확대, ${symbol} 등 수출주 영향 주시`,
      summary:     '원달러 환율 변동성이 확대되며 수출 기업들의 실적에 미치는 영향이 주목된다.',
      source:      '서울경제',
      url:         '#',
      publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      sentiment:   'negative',
      score:       -0.42,
    },
    {
      id:          `${symbol}-5`,
      headline:    `[목업] 증권가, ${symbol} 목표주가 상향...펀더멘털 개선 기대`,
      summary:     '주요 증권사들이 목표주가를 일제히 상향 조정하며 긍정적인 전망을 내놓았다.',
      source:      '이데일리',
      url:         '#',
      publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      sentiment:   'positive',
      score:       0.85,
    },
  ]
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')
  const limit  = Number(req.nextUrl.searchParams.get('limit') ?? 10)

  if (!symbol) {
    return NextResponse.json(
      { data: null, error: { code: 'MISSING_PARAM', message: 'symbol 파라미터가 필요합니다.' } },
      { status: 400 }
    )
  }

  // FMP API 키가 없으면 목업 반환
  if (!process.env.FMP_API_KEY || process.env.FMP_API_KEY === 'your_fmp_api_key_here') {
    console.log('[/api/news] FMP API 키 미설정 → 목업 데이터 반환')
    return NextResponse.json({ data: getMockNews(symbol).slice(0, limit), error: null })
  }

  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=${limit}&apikey=${process.env.FMP_API_KEY}`,
      { next: { revalidate: 1800 } }
    )

    if (!res.ok) throw new Error(`FMP API 오류: ${res.status}`)

    const json: any[] = await res.json()

    // FMP 응답이 배열이 아니거나 비어있으면 목업 반환
    if (!Array.isArray(json) || json.length === 0) {
      return NextResponse.json({ data: getMockNews(symbol).slice(0, limit), error: null })
    }

    const news: NewsItem[] = json.map((item) => ({
      id:          item.url,
      headline:    item.title,
      summary:     item.text?.slice(0, 200),
      source:      item.site,
      url:         item.url,
      publishedAt: item.publishedDate,
      sentiment:   'pending',
      score:       0,
    }))

    return NextResponse.json({ data: news, error: null })
  } catch (err) {
    console.error('[/api/news]', err)
    // 에러 시에도 목업 반환 (서비스 중단 방지)
    return NextResponse.json({ data: getMockNews(symbol).slice(0, limit), error: null })
  }
}
