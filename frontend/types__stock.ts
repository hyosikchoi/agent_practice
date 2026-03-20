// ============================================================
// types/stock.ts
// 전역 TypeScript 타입 정의
// features.md + ui-spec.md 기반
// ============================================================

// ────────────────────────────────────────────────────────────
// 공통 유틸리티 타입
// ────────────────────────────────────────────────────────────

export type Exchange = 'KRX' | 'KOSDAQ' | 'NASDAQ' | 'NYSE' | 'AMEX'

export type Currency = 'KRW' | 'USD' | 'JPY' | 'EUR'

export type Period = '1D' | '1W' | '1M' | '3M' | '1Y'

export type ChartType = 'candlestick' | 'line'

export type SubIndicator = 'RSI' | 'MACD' | null

// ────────────────────────────────────────────────────────────
// 종목 기본 정보
// ────────────────────────────────────────────────────────────

export interface StockMeta {
  symbol:    string      // 티커 (005930, AAPL)
  name:      string      // 종목 전체명 (삼성전자, Apple Inc.)
  exchange:  Exchange
  currency:  Currency
  sector?:   string      // 섹터 (반도체, 전기전자 ...)
  industry?: string      // 업종 세부
  logoUrl?:  string
}

// ────────────────────────────────────────────────────────────
// 시세 데이터 (M-02: 현재가 조회)
// ────────────────────────────────────────────────────────────

export interface StockQuote {
  symbol:        string
  price:         number   // 현재가
  open:          number   // 시가
  high:          number   // 고가
  low:           number   // 저가
  previousClose: number   // 전일 종가
  change:        number   // 등락 (절대값)
  changePercent: number   // 등락률 (%)
  volume:        number   // 거래량
  marketCap?:    number   // 시가총액
  week52High?:   number   // 52주 최고
  week52Low?:    number   // 52주 최저
  updatedAt:     string   // ISO 8601
}

// ────────────────────────────────────────────────────────────
// OHLCV 차트 데이터 (M-03: 캔들스틱 차트)
// lightweight-charts CandlestickData 형식 호환
// ────────────────────────────────────────────────────────────

export interface OHLCVData {
  time:   string   // 'YYYY-MM-DD' (lightweight-charts Time 형식)
  open:   number
  high:   number
  low:    number
  close:  number
  volume: number
}

// ────────────────────────────────────────────────────────────
// 기술적 지표 (M-04 ~ M-06)
// Alpha Vantage API 응답 기반
// ────────────────────────────────────────────────────────────

// 이동평균선 (MA 5/20/60/120)
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

// RSI (M-05)
export interface RSIData {
  time:  string
  value: number   // 0 ~ 100
}

// MACD (M-06)
export interface MACDData {
  time:       string
  macd:       number
  signal:     number
  histogram:  number
}

// 기술적 지표 통합 응답
export interface TechnicalIndicators {
  rsi?:  RSIData[]
  macd?: MACDData[]
  ma?:   MovingAverages
}

// MA 활성화 상태 (차트 토글용)
export interface MAToggleState {
  ma5:   boolean
  ma20:  boolean
  ma60:  boolean
  ma120: boolean
}

// ────────────────────────────────────────────────────────────
// 재무 데이터 (S-02: 재무 요약 - 2차 스프린트)
// Financial Modeling Prep API 기반
// ────────────────────────────────────────────────────────────

export interface FinancialSummary {
  symbol:       string
  per?:         number   // 주가수익비율
  pbr?:         number   // 주가순자산비율
  eps?:         number   // 주당순이익
  roe?:         number   // 자기자본이익률 (%)
  debtRatio?:   number   // 부채비율 (%)
  dividendYield?: number // 배당수익률 (%)
  updatedAt:    string
}

// ────────────────────────────────────────────────────────────
// 뉴스 데이터 (M-08, M-09)
// Financial Modeling Prep + Claude 감성분석
// ────────────────────────────────────────────────────────────

export type SentimentLabel = 'positive' | 'neutral' | 'negative' | 'pending'

export interface NewsItem {
  id:          string
  headline:    string
  summary?:    string   // 본문 요약 (있을 경우)
  source:      string
  url:         string
  publishedAt: string   // ISO 8601
  // Claude 감성분석 결과 (M-09)
  sentiment:   SentimentLabel
  score:       number   // -1.0 ~ +1.0 (pending 시 0)
}

// 감성분석 배치 요청/응답 (Claude API JSON 형식)
export interface SentimentBatchRequest {
  articles: Array<{
    id:      string
    headline: string
    summary?: string
  }>
}

export interface SentimentBatchResult {
  id:        string
  sentiment: SentimentLabel
  score:     number
}

// ────────────────────────────────────────────────────────────
// AI 전망 분석 (M-07: Claude API)
// ────────────────────────────────────────────────────────────

export type AIVerdict = 'bullish' | 'neutral' | 'bearish'

// Claude API 요청 컨텍스트
export interface AIAnalysisContext {
  symbol:     string
  quote:      StockQuote
  indicators: TechnicalIndicators
  news:       Pick<NewsItem, 'id' | 'headline' | 'sentiment' | 'score'>[]
}

// Claude API 스트리밍 응답 최종 파싱 결과
export interface AIAnalysisResult {
  symbol:      string
  verdict:     AIVerdict
  confidence:  number        // 0 ~ 100
  summary:     string        // 종합 요약
  bullPoints:  string[]      // 매수 포인트
  bearPoints:  string[]      // 매도/리스크 포인트
  techSummary: string        // 기술적 분석 요약
  analyzedAt:  string        // ISO 8601
  newsCount:   number        // 분석에 사용된 뉴스 수
}

// AI 분석 히스토리 엔트리 (S-05: 로컬스토리지)
export interface AIAnalysisHistoryEntry {
  id:        string
  symbol:    string
  result:    AIAnalysisResult
  savedAt:   string
}

// ────────────────────────────────────────────────────────────
// 관심종목 (M-10: Zustand + localStorage)
// ────────────────────────────────────────────────────────────

export interface WatchlistItem {
  symbol:    string
  name:      string
  exchange:  Exchange
  addedAt:   string   // ISO 8601
}

// ────────────────────────────────────────────────────────────
// UI 컴포넌트 Props (ui-spec.md §4)
// ────────────────────────────────────────────────────────────

// StockCard (ui-spec.md §4-1)
export interface StockCardProps {
  symbol:     string
  name:       string
  exchange?:  Exchange
  price:      number
  change:     number        // 등락률 (%)
  volume:     number
  aiVerdict:  AIVerdict | null
  sparkData:  number[]      // 5일 종가 배열
  isLoading?: boolean
  isError?:   boolean
  onClick?:   (symbol: string) => void
}

// CandlestickChart (ui-spec.md §4-2)
export interface CandlestickChartProps {
  symbol:        string
  period:        Period
  ohlcv:         OHLCVData[]
  ma:            MAToggleState
  subIndicator:  SubIndicator
  rsiData?:      RSIData[]
  macdData?:     MACDData[]
  isLoading?:    boolean
  onPeriodChange?: (period: Period) => void
  onMAToggle?:   (key: keyof MAToggleState) => void
  onSubChange?:  (sub: SubIndicator) => void
}

// AIAnalysisCard (ui-spec.md §4-3)
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

// NewsCard (ui-spec.md §4-4)
export interface NewsCardProps {
  id:          string
  headline:    string
  source:      string
  publishedAt: Date | string
  sentiment:   SentimentLabel
  score:       number
  url:         string
}

// ────────────────────────────────────────────────────────────
// API Route 요청/응답 타입 (Next.js Route Handlers)
// developer.md 아키텍처 기반
// ────────────────────────────────────────────────────────────

// /api/stock/quote
export interface QuoteApiResponse {
  data:  StockQuote
  error: null
}

// /api/stock/chart
export interface ChartApiRequest {
  symbol: string
  period: Period
}

export interface ChartApiResponse {
  data:  OHLCVData[]
  error: null
}

// /api/stock/indicators
export interface IndicatorsApiRequest {
  symbol:     string
  indicators: ('RSI' | 'MACD' | 'MA')[]
}

export interface IndicatorsApiResponse {
  data:  TechnicalIndicators
  error: null
}

// /api/news
export interface NewsApiRequest {
  symbol: string
  limit?: number   // 기본 10
}

export interface NewsApiResponse {
  data:  NewsItem[]
  error: null
}

// /api/ai/analysis
export interface AIAnalysisApiRequest {
  context: AIAnalysisContext
}

// /api/ai/sentiment (배치)
export interface SentimentApiRequest {
  articles: SentimentBatchRequest['articles']
}

export interface SentimentApiResponse {
  data:  SentimentBatchResult[]
  error: null
}

// 공통 에러 응답
export interface ApiErrorResponse {
  data:  null
  error: {
    code:    string
    message: string
  }
}

// ────────────────────────────────────────────────────────────
// 시장 지수 (C-02: 코스피/코스닥/S&P500)
// ────────────────────────────────────────────────────────────

export type MarketIndex = 'KOSPI' | 'KOSDAQ' | 'SP500' | 'NASDAQ'

export interface MarketIndexData {
  index:         MarketIndex
  value:         number
  change:        number
  changePercent: number
  updatedAt:     string
}

// ────────────────────────────────────────────────────────────
// Zustand Store 타입 (store/watchlist.ts, store/ui.ts)
// ────────────────────────────────────────────────────────────

export interface WatchlistStore {
  items:          WatchlistItem[]
  addItem:        (item: WatchlistItem) => void
  removeItem:     (symbol: string) => void
  hasItem:        (symbol: string) => boolean
  reorderItems:   (from: number, to: number) => void
}

export interface UIStore {
  isWatchlistPanelOpen: boolean
  openWatchlistPanel:   () => void
  closeWatchlistPanel:  () => void
  recentlyViewed:       string[]   // 최근 조회 종목 symbol 배열 (최대 10)
  addRecentlyViewed:    (symbol: string) => void
}
