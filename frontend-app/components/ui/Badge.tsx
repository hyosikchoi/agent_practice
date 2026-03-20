// components/ui/Badge.tsx
import { clsx } from 'clsx'
import { AIVerdict, SentimentLabel } from '@/types/stock'

// ─── AI 전망 배지 ────────────────────────────────────────────
interface AIBadgeProps {
  verdict: AIVerdict | null
  size?:   'sm' | 'md'
}

const AI_BADGE_CONFIG: Record<AIVerdict, { label: string; className: string }> = {
  bullish: {
    label:     '↑ 매수',
    className: 'bg-positive/10 border border-positive/30 text-positive',
  },
  neutral: {
    label:     '→ 중립',
    className: 'bg-accent/10 border border-accent/30 text-accent',
  },
  bearish: {
    label:     '↓ 관망',
    className: 'bg-negative/10 border border-negative/30 text-negative',
  },
}

export function AIBadge({ verdict, size = 'sm' }: AIBadgeProps) {
  if (!verdict) return null
  const { label, className } = AI_BADGE_CONFIG[verdict]
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      {label}
    </span>
  )
}

// ─── 감성 분석 배지 ──────────────────────────────────────────
interface SentimentBadgeProps {
  sentiment: SentimentLabel
  score:     number
}

const SENTIMENT_CONFIG: Record<
  Exclude<SentimentLabel, 'pending'>,
  { className: string; prefix: string }
> = {
  positive: { className: 'bg-positive/10 text-positive', prefix: '긍정' },
  neutral:  { className: 'bg-bg-card text-text-secondary',  prefix: '중립' },
  negative: { className: 'bg-negative/10 text-negative', prefix: '부정' },
}

export function SentimentBadge({ sentiment, score }: SentimentBadgeProps) {
  if (sentiment === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-warning">
        <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse-skeleton" />
        감성분석 중...
      </span>
    )
  }

  const { className, prefix } = SENTIMENT_CONFIG[sentiment]
  const sign   = score > 0 ? '+' : ''
  const display = `${prefix} ${sign}${score.toFixed(2)}`

  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', className)}>
      {display}
    </span>
  )
}

// ─── 판정 Pill (AI 분석 카드용) ───────────────────────────────
interface VerdictPillProps {
  verdict: AIVerdict
}

const VERDICT_CONFIG: Record<AIVerdict, { label: string; className: string }> = {
  bullish: { label: '↑ 상승 전망', className: 'bg-positive/10 border border-positive/30 text-positive' },
  neutral: { label: '→ 중립 전망', className: 'bg-accent/10 border border-accent/30 text-accent'    },
  bearish: { label: '↓ 하락 전망', className: 'bg-negative/10 border border-negative/30 text-negative' },
}

export function VerdictPill({ verdict }: VerdictPillProps) {
  const { label, className } = VERDICT_CONFIG[verdict]
  return (
    <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold', className)}>
      {label}
    </span>
  )
}
