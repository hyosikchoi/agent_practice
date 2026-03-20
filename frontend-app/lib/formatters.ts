// lib/formatters.ts
// 숫자 / 날짜 / 통화 포맷 유틸

import { Currency } from '@/types/stock'

// ─── 가격 포맷 ───────────────────────────────────────────────
export function formatPrice(price: number, currency: Currency = 'KRW'): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(price)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

// ─── 등락률 포맷 ──────────────────────────────────────────────
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

// ─── 거래량 포맷 ──────────────────────────────────────────────
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(1)}B`
  if (volume >= 1_000_000)     return `${(volume / 1_000_000).toFixed(1)}M`
  if (volume >= 1_000)         return `${(volume / 1_000).toFixed(1)}K`
  return volume.toLocaleString()
}

// ─── 시가총액 포맷 ────────────────────────────────────────────
export function formatMarketCap(value: number, currency: Currency = 'KRW'): string {
  if (currency === 'KRW') {
    if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1)}조`
    if (value >= 100_000_000)       return `${(value / 100_000_000).toFixed(0)}억`
    return value.toLocaleString('ko-KR')
  }
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  if (value >= 1_000_000_000)     return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000)         return `$${(value / 1_000_000).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

// ─── 날짜 포맷 ────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month:  '2-digit',
    day:    '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now  = Date.now()
  const diff = now - new Date(date).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1)   return '방금 전'
  if (mins < 60)  return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7)   return `${days}일 전`
  return formatDate(date)
}

// ─── 등락 색상 클래스 ─────────────────────────────────────────
export function getChangeColorClass(change: number): string {
  if (change > 0) return 'text-positive'
  if (change < 0) return 'text-negative'
  return 'text-text-secondary'
}

// ─── 등락 화살표 ──────────────────────────────────────────────
export function getChangeArrow(change: number): string {
  if (change > 0) return '▲'
  if (change < 0) return '▼'
  return '–'
}
