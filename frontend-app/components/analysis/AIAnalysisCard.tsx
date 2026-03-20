'use client'
// components/analysis/AIAnalysisCard.tsx
import { clsx } from 'clsx'
import { AIAnalysisCardProps, AIVerdict } from '@/types/stock'
import { VerdictPill } from '@/components/ui/Badge'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import { formatDateTime } from '@/lib/formatters'
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

// 신뢰도 바
function ConfidenceBar({ confidence, verdict }: { confidence: number; verdict: AIVerdict }) {
  const colorMap: Record<AIVerdict, string> = {
    bullish: 'bg-positive',
    neutral: 'bg-accent',
    bearish: 'bg-negative',
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-bg-secondary overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-700', colorMap[verdict])}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="text-xs text-text-secondary flex-shrink-0">{confidence}%</span>
    </div>
  )
}

export default function AIAnalysisCard({
  verdict,
  confidence,
  summary,
  bullPoints,
  bearPoints,
  techSummary,
  timestamp,
  isStreaming,
  isError,
  onRegenerate,
}: AIAnalysisCardProps) {
  // 에러 상태
  if (isError) {
    return (
      <div className="rounded-lg border border-negative/40 bg-negative/5 p-6 text-center space-y-3">
        <AlertCircle className="mx-auto text-negative" size={32} />
        <p className="text-sm text-text-secondary">AI 분석을 불러오지 못했습니다.</p>
        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-text-primary hover:border-accent transition-colors"
        >
          <RefreshCw size={14} />
          재시도
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-bg-card overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <VerdictPill verdict={verdict} />
          <div className="flex-1 min-w-0">
            <ConfidenceBar confidence={confidence} verdict={verdict} />
          </div>
        </div>
        <span className="text-xs text-text-tertiary flex-shrink-0">claude-sonnet</span>
      </div>

      {/* 본문 */}
      <div className="p-4 space-y-4">
        {/* 종합 요약 (스트리밍) */}
        <div className="border-l-2 border-accent/50 pl-3">
          {isStreaming && !summary ? (
            <SkeletonText lines={3} />
          ) : (
            <p className="text-sm text-text-primary leading-relaxed">
              {summary}
              {isStreaming && (
                <span className="inline-block w-0.5 h-3 bg-accent ml-0.5 animate-blink-cursor" />
              )}
            </p>
          )}
        </div>

        {/* Bullish / Bearish 포인트 (스트리밍 완료 후 표시) */}
        {!isStreaming && bullPoints.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {/* Bullish */}
            <div className="rounded-md border border-positive/20 bg-positive/5 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-positive mb-2">
                <TrendingUp size={13} />
                Bullish
              </div>
              {bullPoints.map((point, i) => (
                <p key={i} className="text-xs text-text-secondary leading-snug">
                  · {point}
                </p>
              ))}
            </div>

            {/* Bearish */}
            <div className="rounded-md border border-negative/20 bg-negative/5 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-negative mb-2">
                <TrendingDown size={13} />
                Bearish
              </div>
              {bearPoints.map((point, i) => (
                <p key={i} className="text-xs text-text-secondary leading-snug">
                  · {point}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* 기술적 분석 요약 */}
        {!isStreaming && techSummary && (
          <p className="text-xs text-text-secondary bg-bg-secondary rounded-md p-2.5">
            📊 {techSummary}
          </p>
        )}
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-bg-secondary/50">
        <span className="text-xs text-text-tertiary">
          분석 기준: {formatDateTime(timestamp)}
        </span>
        <button
          onClick={onRegenerate}
          disabled={isStreaming}
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs',
            'border border-border text-text-secondary hover:text-text-primary hover:border-accent',
            'transition-colors duration-150',
            isStreaming && 'opacity-40 pointer-events-none'
          )}
        >
          <RefreshCw size={11} className={isStreaming ? 'animate-spin' : ''} />
          재분석
        </button>
      </div>
    </div>
  )
}
