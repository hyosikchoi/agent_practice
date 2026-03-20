'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Star, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { useWatchlistStore } from '@/store/watchlist'
import { clsx } from 'clsx'

// 인기 종목 샘플 (API 연동 전 목업)
const POPULAR_STOCKS = [
  { symbol: 'AAPL',   name: 'Apple Inc.',       change: +1.24 },
  { symbol: 'NVDA',   name: 'NVIDIA Corp.',      change: +3.42 },
  { symbol: 'TSLA',   name: 'Tesla Inc.',        change: -1.55 },
  { symbol: 'MSFT',   name: 'Microsoft Corp.',   change: +0.83 },
  { symbol: '005930', name: '삼성전자',            change: +2.14 },
  { symbol: '000660', name: 'SK하이닉스',          change: +1.07 },
]

export default function HomePage() {
  const router  = useRouter()
  const [query, setQuery] = useState('')
  const { items: watchlist } = useWatchlistStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/stock/${query.trim().toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 헤더 */}
      <header className="sticky top-0 z-[100] flex items-center gap-4 px-6 h-11 bg-bg-secondary border-b border-border">
        <div className="flex items-center gap-1.5">
          <BarChart2 size={16} className="text-accent" />
          <span className="text-sm font-semibold text-text-primary">StockAI</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        {/* 히어로 검색 */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-text-primary">
              AI 주식 전망 분석
            </h1>
            <p className="text-sm text-text-secondary">
              종목명 또는 티커를 입력하면 AI가 전망을 분석해드립니다
            </p>
          </div>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="AAPL, NVDA, 삼성전자, 005930..."
              className={clsx(
                'w-full pl-10 pr-4 py-3 rounded-lg text-sm',
                'bg-bg-card border border-border text-text-primary placeholder:text-text-tertiary',
                'focus:outline-none focus:border-accent transition-colors'
              )}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md bg-accent text-bg-primary text-xs font-semibold hover:bg-accent/90 transition-colors"
            >
              검색
            </button>
          </form>
        </div>

        {/* 인기 종목 */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            인기 종목
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {POPULAR_STOCKS.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className={clsx(
                  'flex items-center justify-between p-3 rounded-lg',
                  'border border-border bg-bg-card hover:border-accent/50',
                  'transition-colors duration-150'
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">{stock.symbol}</p>
                  <p className="text-xs text-text-secondary truncate max-w-[100px]">{stock.name}</p>
                </div>
                <div className={clsx(
                  'flex items-center gap-0.5 text-xs font-medium',
                  stock.change >= 0 ? 'text-positive' : 'text-negative'
                )}>
                  {stock.change >= 0
                    ? <TrendingUp size={12} />
                    : <TrendingDown size={12} />
                  }
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 관심종목 */}
        {watchlist.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
              <Star size={12} />
              관심종목
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {watchlist.map((item) => (
                <Link
                  key={item.symbol}
                  href={`/stock/${item.symbol}`}
                  className={clsx(
                    'flex items-center justify-between p-3 rounded-lg',
                    'border border-accent/20 bg-accent/5 hover:border-accent/50',
                    'transition-colors duration-150'
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{item.symbol}</p>
                    <p className="text-xs text-text-secondary truncate max-w-[100px]">{item.name}</p>
                  </div>
                  <Star size={12} className="text-accent fill-accent flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 사용 방법 */}
        <div className="rounded-lg border border-border bg-bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">사용 방법</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { step: '01', title: '종목 검색', desc: '위 검색창에 티커 또는 종목명 입력' },
              { step: '02', title: '차트 확인', desc: '캔들스틱, RSI, MACD 기술적 분석' },
              { step: '03', title: 'AI 전망', desc: 'Claude AI가 종합 투자 전망 분석' },
            ].map((item) => (
              <div key={item.step} className="space-y-1">
                <span className="text-xs font-bold text-accent">{item.step}</span>
                <p className="text-sm font-medium text-text-primary">{item.title}</p>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
