'use client'
// components/stock/StockCard.tsx
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import { StockCardProps } from '@/types/stock'
import { AIBadge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatPrice, formatChange, formatVolume, getChangeColorClass, getChangeArrow } from '@/lib/formatters'

// 미니 스파크라인 (SVG 인라인)
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data.length) return null
  const min    = Math.min(...data)
  const max    = Math.max(...data)
  const range  = max - min || 1
  const width  = 64
  const height = 24
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#3fb950' : '#f85149'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function StockCard({
  symbol,
  name,
  exchange,
  price,
  change,
  volume,
  aiVerdict,
  sparkData,
  isLoading,
  isError,
  onClick,
}: StockCardProps) {
  const router   = useRouter()
  const positive = change >= 0

  const handleClick = () => {
    onClick?.(symbol)
    router.push(`/stock/${symbol}`)
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-bg-card p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-28" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    )
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="rounded-lg border border-negative/40 bg-negative/5 p-4 flex items-center justify-center min-h-[100px]">
        <p className="text-sm text-negative">데이터를 불러오지 못했습니다</p>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'w-full text-left rounded-lg border bg-bg-card p-4 transition-all duration-150',
        'border-border hover:border-accent hover:bg-bg-card/80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
      )}
    >
      {/* 상단: 티커 + AI 배지 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">{symbol}</span>
          {exchange && (
            <span className="text-xs text-text-tertiary">{exchange}</span>
          )}
        </div>
        <AIBadge verdict={aiVerdict} />
      </div>

      {/* 종목명 */}
      <p className="text-xs text-text-secondary mb-2 truncate">{name}</p>

      {/* 현재가 */}
      <p className="text-xl font-semibold text-text-primary mb-1">
        {formatPrice(price)}
      </p>

      {/* 등락률 */}
      <p className={clsx('text-sm font-medium mb-3', getChangeColorClass(change))}>
        {getChangeArrow(change)} {formatChange(change)}
      </p>

      {/* 하단: 거래량 + 스파크라인 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-tertiary">
          거래량 {formatVolume(volume)}
        </span>
        <Sparkline data={sparkData} positive={positive} />
      </div>
    </button>
  )
}
