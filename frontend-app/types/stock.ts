// ============================================================
// types/stock.ts
// 전역 TypeScript 타입 정의
// features.md + ui-spec.md 기반
// ============================================================

export type Exchange = 'KRX' | 'KOSDAQ' | 'NASDAQ' | 'NYSE' | 'AMEX'
export type Currency = 'KRW' | 'USD' | 'JPY' | 'EUR'
export type Period = '1D' | '1W' | '1M' | '3M' | '1Y'
export type ChartType = 'candlestick' | 'line'
export type SubIndicator = 'RSI' | 'MACD' | null
export type SentimentLabel = 'positive' | 'neutral' | 'negative' | 'pending'
export type AIVerdict = 'bullish' | 'neutral' | 'bearish'
export type MarketIndex = 'KOSPI' | 'KOSDAQ' | 'SP500' | 'NASDAQ'

export interface StockMeta {
  symbol:    string
  name:      string
  exchange:  Exchange
  currency:  Currency
  sector?:   string
  industry?: string
  logoUrl?:  string
}

export interface StockQuote {
  symbol:        string
  price:         number
  open:          number
  high:          number
  low:           number
  previousClose: number
  change:        number
  changePercent: number
  volume:        number
  marketCap?:    number
  week52High?:   number
  week52Low?:    number
  updatedAt:     string
}

export interface OHLCVData {
  time:   string
  open:   number
  high:   number
  low:    number
  close:  number
  volume: number
}

export interface MAData {
  time:  string
  value: number
}

export interface MovingAverages {
  ma5?:   MAData[]
  ma20?:  MAData[]
  ma60?:  MAData[]
  ma120?: MAData[]
}

export interface RSIData {
  time:  string
  value: number
}

export interface MACDData {
  time:      string
  macd:      number
  signal:    number
  histogram: number
}

export interface TechnicalIndicators {
  rsi?:  RSIData[]
  macd?: MACDData[]
  ma?:   MovingAverages
}

export interface MAToggleState {
  ma5:   boolean
  ma20:  boolean
  ma60:  boolean
  ma120: boolean
}

export interface NewsItem {
  id:          string
  headline:    string
  summary?:    string
  source:      string
  url:         string
  publishedAt: string
  sentiment:   SentimentLabel
  score:       number
}

export interface SentimentBatchResult {
  id:        string
  sentiment: SentimentLabel
  score:     number
}

export interface AIAnalysisContext {
  symbol:     string
  quote:      StockQuote
  indicators: TechnicalIndicators
  news:       Pick<NewsItem, 'id' | 'headline' | 'sentiment' | 'score'>[]
}

export interface AIAnalysisResult {
  symbol:      string
  verdict:     AIVerdict
  confidence:  number
  summary:     string
  bullPoints:  string[]
  bearPoints:  string[]
  techSummary: string
  analyzedAt:  string
  newsCount:   number
}

export interface WatchlistItem {
  symbol:  string
  name:    string
  exchange: Exchange
  addedAt: string
}

export interface MarketIndexData {
  index:         MarketIndex
  value:         number
  change:        number
  changePercent: number
  updatedAt:     string
}

// Component Props
export interface StockCardProps {
  symbol:     string
  name:       string
  exchange?:  Exchange
  price:      number
  change:     number
  volume:     number
  aiVerdict:  AIVerdict | null
  sparkData:  number[]
  isLoading?: boolean
  isError?:   boolean
  onClick?:   (symbol: string) => void
}

export interface CandlestickChartProps {
  symbol:          string
  period:          Period
  ohlcv:           OHLCVData[]
  ma:              MAToggleState
  subIndicator:    SubIndicator
  rsiData?:        RSIData[]
  macdData?:       MACDData[]
  isLoading?:      boolean
  onPeriodChange?: (period: Period) => void
  onMAToggle?:     (key: keyof MAToggleState) => void
  onSubChange?:    (sub: SubIndicator) => void
}

export interface AIAnalysisCardProps {
  verdict:      AIVerdict
  confidence:   number
  summary:      string
  bullPoints:   string[]
  bearPoints:   string[]
  techSummary?: string
  timestamp:    Date
  isStreaming:  boolean
  isError?:     boolean
  onRegenerate: () => void
}

export interface NewsCardProps {
  id:          string
  headline:    string
  source:      string
  publishedAt: Date | string
  sentiment:   SentimentLabel
  score:       number
  url:         string
}

// API Response Types
export interface ApiErrorResponse {
  data:  null
  error: { code: string; message: string }
}

export interface WatchlistStore {
  items:        WatchlistItem[]
  addItem:      (item: WatchlistItem) => void
  removeItem:   (symbol: string) => void
  hasItem:      (symbol: string) => boolean
  reorderItems: (from: number, to: number) => void
}

export interface UIStore {
  isWatchlistPanelOpen: boolean
  openWatchlistPanel:   () => void
  closeWatchlistPanel:  () => void
  recentlyViewed:       string[]
  addRecentlyViewed:    (symbol: string) => void
}
