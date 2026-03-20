'use client'
// components/layout/Header.tsx
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Star, BarChart2 } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { clsx } from 'clsx'

export default function Header() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { toggleWatchlistPanel } = useUIStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-[100] h-header flex items-center gap-4 px-4 bg-bg-secondary border-b border-border">
      {/* 로고 */}
      <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
        <BarChart2 size={18} className="text-accent" />
        <span className="text-sm font-semibold text-text-primary">StockAI</span>
      </Link>

      {/* 검색창 */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="종목명 또는 티커 검색... ⌘K"
            className={clsx(
              'w-full pl-8 pr-3 py-1.5 rounded-md text-sm',
              'bg-bg-card border border-border text-text-primary placeholder:text-text-tertiary',
              'focus:outline-none focus:border-accent transition-colors'
            )}
          />
        </div>
      </form>

      {/* 관심종목 버튼 */}
      <button
        onClick={toggleWatchlistPanel}
        className="flex-shrink-0 p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
        aria-label="관심종목"
      >
        <Star size={16} />
      </button>
    </header>
  )
}
