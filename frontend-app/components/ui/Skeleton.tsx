// components/ui/Skeleton.tsx
import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx('animate-pulse-skeleton rounded-md bg-bg-secondary', className)}
      aria-label="데이터 로딩 중"
      aria-busy="true"
    />
  )
}

// 자주 쓰는 Skeleton 조합
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-bg-card p-4 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}
