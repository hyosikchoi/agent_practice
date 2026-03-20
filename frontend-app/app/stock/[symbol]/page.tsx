'use client'
// app/stock/[symbol]/page.tsx
import { useState, useEffect } from 'react'
import { Star, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import Header from '@/components/layout/Header'
import CandlestickChart from '@/components/chart/CandlestickChart'
import AIAnalysisCard from '@/components/analysis/AIAnalysisCard'
import NewsCard from '@/components/news/NewsCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useStockQuote } from '@/hooks/useStockQuote'
import { useStockChart } from '@/hooks/useStockChart'
import { useNews } from '@/hooks/useNews'
import { useAIAnalysis } from '@/hooks/useAIAnalysis'
import { useWatchlistStore } from '@/store/watchlist'
import { useUIStore } from '@/store/ui'
import {
  formatPrice,
  formatChange,
  formatVolume,
  getChangeColorClass,
  getChangeArrow,
} from '@/lib/formatters'
import { MAToggleState, Period, SubIndicator } from '@/types/stock'

type Tab = 'chart' | 'ai' | 'news'

// 목업 데이터 (API 키 없을 때 화면 확인용)
const MOCK_QUOTE = {
  symbol:        'DEMO',
  price:         82400,
  open:          81200,
  high:          82900,
  low:           81000,
  previousClose: 80680,
  change:        1720,
  changePercent: 2.14,
  volume:        14200000,
  marketCap:     491800000000000,
  updatedAt:     new Date().toISOString(),
}

const MOCK_OHLCV = Array.from({ length: 30 }, (_, i) => {
  const base = 80000 + Math.random() * 5000
  return {
    time:   new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    open:   Math.round(base),
    high:   Math.round(base + Math.random() * 1500),
    low:    Math.round(base - Math.random() * 1500),
    close:  Math.round(base + (Math.random() - 0.5) * 1000),
    volume: Math.round(10000000 + Math.random() * 5000000),
  }
})

const MOCK_NEWS = [
  { id: '1', headline: '[목업] 삼성전자, HBM4 양산 준비 완료...AI 수요 수혜 기대', source: '연합뉴스', publishedAt: new Date(Date.now() - 3600000).toISOString(), sentiment: 'positive' as const, score: 0.82, url: '#' },
  { id: '2', headline: '[목업] 반도체 업황 회복세...하반기 실적 개선 전망',          source: '한국경제', publishedAt: new Date(Date.now() - 7200000).toISOString(), sentiment: 'positive' as const, score: 0.65, url: '#' },
  { id: '3', headline: '[목업] 원달러 환율 상승, 수출 기업 실적에 영향',             source: '매일경제', publishedAt: new Date(Date.now() - 10800000).toISOString(), sentiment: 'neutral'  as const, score: 0.05, url: '#' },
]

export default function StockDetailPage({
  params,
}: {
  params: { symbol: string }
}) {
  const symbol = params.symbol

  const [activeTab,    setActiveTab]    = useState<Tab>('chart')
  const [period,       setPeriod]       = useState<Period>('1M')
  const [subIndicator, setSubIndicator] = useState<SubIndicator>('RSI')
  const [ma, setMA] = useState<MAToggleState>({
    ma5: false, ma20: true, ma60: false, ma120: false,
  })
  const [useMock, setUseMock] = useState(false)

  const { data: quote,  isLoading: quoteLoading,  isError: quoteError  } = useStockQuote(symbol)
  const { data: ohlcv,  isLoading: chartLoading,  isError: chartError  } = useStockChart(symbol, period)
  const { data: news,   isLoading: newsLoading                          } = useNews(symbol)

  const { result, isStreaming, isError: aiError, run: runAI } = useAIAnalysis()
  const { addItem, removeItem, hasItem } = useWatchlistStore()
  const { addRecentlyViewed }            = useUIStore()

  useEffect(() => { addRecentlyViewed(symbol) }, [symbol])

  // API 에러 시 목업으로 전환
  useEffect(() => {
    if (quoteError || chartError) setUseMock(true)
  }, [quoteError, chartError])

  const displayQuote = useMock ? { ...MOCK_QUOTE, symbol } : quote
  const displayOhlcv = useMock ? MOCK_OHLCV : (ohlcv ?? [])
  const displayNews  = useMock ? MOCK_NEWS   : (news  ?? [])

  const isWatched = hasItem(symbol)

  const toggleWatchlist = () => {
    if (isWatched) {
      removeItem(symbol)
    } else {
      addItem({ symbol, name: displayQuote?.symbol ?? symbol, exchange: 'NASDAQ' })
    }
  }

  const handleRunAI = () => {
    if (!displayQuote) return
    runAI({
      symbol,
      quote:      displayQuote as any,
      indicators: {},
      news:       displayNews.map((n) => ({
        id:        n.id,
        headline:  n.headline,
        sentiment: n.sentiment,
        score:     n.score,
      })),
    })
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'chart', label: '차트'    },
    { key: 'ai',    label: 'AI 전망' },
    { key: 'news',  label: '뉴스'    },
  ]

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/* 목업 알림 배너 */}
        {useMock && (
          <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2.5 text-sm text-warning">
            <AlertCircle size={14} />
            API 키가 설정되지 않아 목업 데이터로 표시 중입니다.
            <span className="text-text-secondary text-xs ml-1">
              .env.local에 API 키를 입력 후 서버를 재시작하세요.
            </span>
          </div>
        )}

        {/* 종목 헤더 */}
        <div className="rounded-lg border border-border bg-bg-card p-4">
          {(quoteLoading && !useMock) ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : displayQuote ? (
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg font-semibold text-text-primary">{symbol}</h1>
                  {useMock && (
                    <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded">
                      목업
                    </span>
                  )}
                </div>
                <p className="text-2xl font-semibold text-text-primary mb-1">
                  {formatPrice(displayQuote.price)}
                </p>
                <p className={clsx('text-sm font-medium', getChangeColorClass(displayQuote.changePercent))}>
                  {getChangeArrow(displayQuote.changePercent)} {formatChange(displayQuote.changePercent)}
                  <span className="text-text-tertiary ml-2 font-normal">전일 대비</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
                {[
                  { label: '시가',   value: formatPrice(displayQuote.open),    color: '' },
                  { label: '고가',   value: formatPrice(displayQuote.high),    color: 'text-positive' },
                  { label: '저가',   value: formatPrice(displayQuote.low),     color: 'text-negative' },
                  { label: '거래량', value: formatVolume(displayQuote.volume), color: '' },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-text-tertiary mb-0.5">{item.label}</p>
                    <p className={item.color}>{item.value}</p>
                  </div>
                ))}

                <div>
                  <button
                    onClick={toggleWatchlist}
                    className={clsx(
                      'flex items-center gap-1 mt-3 px-3 py-1.5 rounded-md border text-xs transition-colors',
                      isWatched
                        ? 'border-accent/40 bg-accent/10 text-accent'
                        : 'border-border text-text-secondary hover:border-accent hover:text-text-primary'
                    )}
                  >
                    <Star size={12} className={isWatched ? 'fill-accent' : ''} />
                    {isWatched ? '관심 해제' : '관심 추가'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">종목 정보를 불러올 수 없습니다.</p>
          )}
        </div>

        {/* 탭 */}
        <div className="flex gap-1 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 차트 탭 */}
        {activeTab === 'chart' && (
          <CandlestickChart
            symbol={symbol}
            period={period}
            ohlcv={displayOhlcv}
            ma={ma}
            subIndicator={subIndicator}
            isLoading={chartLoading && !useMock}
            onPeriodChange={setPeriod}
            onMAToggle={(key) => setMA((prev) => ({ ...prev, [key]: !prev[key] }))}
            onSubChange={setSubIndicator}
          />
        )}

        {/* AI 전망 탭 */}
        {activeTab === 'ai' && (
          <div className="space-y-3">
            {!result && !isStreaming && (
              <div className="text-center py-12 space-y-3">
                <p className="text-text-secondary text-sm">
                  {useMock
                    ? 'Anthropic API 키를 설정하면 실제 AI 분석이 가능합니다'
                    : 'AI 전망 분석을 시작해보세요'}
                </p>
                <button
                  onClick={handleRunAI}
                  className="px-4 py-2 rounded-md bg-accent text-bg-primary text-sm font-semibold hover:bg-accent/90 transition-colors"
                >
                  AI 분석 시작
                </button>
              </div>
            )}
            {(result || isStreaming) && (
              <AIAnalysisCard
                verdict={     result?.verdict     ?? 'neutral'}
                confidence={  result?.confidence  ?? 50}
                summary={     result?.summary     ?? ''}
                bullPoints={  result?.bullPoints  ?? []}
                bearPoints={  result?.bearPoints  ?? []}
                techSummary={ result?.techSummary}
                timestamp={   new Date(result?.analyzedAt ?? Date.now())}
                isStreaming={  isStreaming}
                isError={      aiError}
                onRegenerate={ handleRunAI}
              />
            )}
          </div>
        )}

        {/* 뉴스 탭 */}
        {activeTab === 'news' && (
          <div className="space-y-2">
            {newsLoading && !useMock
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))
              : displayNews.map((item) => (
                  <NewsCard key={item.id} {...item} />
                ))}
          </div>
        )}
      </main>
    </div>
  )
}
