'use client'
// components/news/NewsCard.tsx
import { clsx } from 'clsx'
import { NewsCardProps, SentimentLabel } from '@/types/stock'
import { SentimentBadge } from '@/components/ui/Badge'
import { formatRelativeTime } from '@/lib/formatters'

// 감성 컬러 도트
const DOT_COLOR: Record<SentimentLabel, string> = {
  positive: 'bg-positive',
  negative: 'bg-negative',
  neutral:  'bg-text-tertiary',
  pending:  'bg-warning animate-pulse-skeleton',
}

export default function NewsCard({
  headline,
  source,
  publishedAt,
  sentiment,
  score,
  url,
}: NewsCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'flex gap-3 p-3 rounded-lg border border-border bg-bg-card',
        'hover:border-accent/50 transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
      )}
    >
      {/* 감성 컬러 도트 */}
      <div className="mt-1.5 flex-shrink-0">
        <span className={clsx('block h-2 w-2 rounded-full', DOT_COLOR[sentiment])} />
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 min-w-0">
        {/* 헤드라인 */}
        <p className="text-sm text-text-primary leading-snug line-clamp-2 mb-1.5">
          {headline}
        </p>

        {/* 메타 + 감성 배지 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary min-w-0">
            <span className="truncate">{source}</span>
            <span className="text-text-tertiary">·</span>
            <span className="flex-shrink-0">{formatRelativeTime(publishedAt)}</span>
          </div>
          <SentimentBadge sentiment={sentiment} score={score} />
        </div>
      </div>
    </a>
  )
}
