# 📁 프로젝트 폴더 구조

> developer.md 아키텍처 + features.md Phase 1 MVP 기준
> Next.js 14 App Router + TypeScript

```
stockai/
│
├── .env.local                          # ⚠️ Git 제외 (API 키)
├── .env.local.example                  # 환경변수 템플릿 (Git 포함)
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts                  # 디자인 토큰 (ui-spec.md 반영)
├── tsconfig.json
│
├── app/                                # Next.js 14 App Router
│   │
│   ├── layout.tsx                      # 루트 레이아웃 (Provider 설정)
│   ├── page.tsx                        # 홈 대시보드 (/)
│   ├── globals.css                     # Tailwind 기본 + 전역 CSS 변수
│   │
│   ├── stock/
│   │   └── [symbol]/
│   │       └── page.tsx                # 종목 상세 (/stock/[symbol])
│   │
│   ├── search/
│   │   └── page.tsx                    # 종목 검색 (/search)
│   │
│   ├── compare/                        # S-01 (2차 스프린트)
│   │   └── page.tsx                    # 종목 비교 (/compare)
│   │
│   └── api/                            # API Routes (서버사이드, 키 보호)
│       │
│       ├── stock/
│       │   ├── quote/
│       │   │   └── route.ts            # GET /api/stock/quote?symbol=
│       │   ├── chart/
│       │   │   └── route.ts            # GET /api/stock/chart?symbol=&period=
│       │   ├── search/
│       │   │   └── route.ts            # GET /api/stock/search?q=
│       │   └── indicators/
│       │       └── route.ts            # GET /api/stock/indicators?symbol=
│       │
│       ├── market/
│       │   └── route.ts                # GET /api/market (지수: KOSPI/KOSDAQ/SP500)
│       │
│       ├── news/
│       │   └── route.ts                # GET /api/news?symbol=&limit=
│       │
│       └── ai/
│           ├── analysis/
│           │   └── route.ts            # POST /api/ai/analysis (스트리밍)
│           └── sentiment/
│               └── route.ts            # POST /api/ai/sentiment (배치)
│
├── components/
│   │
│   ├── layout/
│   │   ├── Header.tsx                  # 글로벌 헤더 (검색창, 관심종목 아이콘)
│   │   ├── Sidebar.tsx                 # 사이드바 (관심종목 목록, 섹터 필터)
│   │   └── WatchlistPanel.tsx          # 우측 슬라이드인 관심종목 패널
│   │
│   ├── stock/
│   │   ├── StockCard.tsx               # 종목 요약 카드 (ui-spec.md §4-1)
│   │   ├── StockSearch.tsx             # 종목 검색 (자동완성 드롭다운)
│   │   ├── StockHeader.tsx             # 종목 상세 헤더 (현재가, 등락률 등)
│   │   └── StockCompare.tsx            # 종목 비교 (S-01, 2차)
│   │
│   ├── chart/
│   │   ├── CandlestickChart.tsx        # 캔들스틱 메인 차트 (ui-spec.md §4-2)
│   │   ├── SubChart.tsx                # RSI / MACD 서브 차트
│   │   ├── ChartToolbar.tsx            # 기간 버튼 + MA 토글 + 차트 타입
│   │   ├── MiniSparkline.tsx           # 5일 미니차트 (StockCard용)
│   │   └── MarketIndexWidget.tsx       # 시장 지수 위젯 (KOSPI/KOSDAQ/S&P)
│   │
│   ├── analysis/
│   │   ├── AIAnalysisCard.tsx          # AI 전망 분석 카드 (ui-spec.md §4-3)
│   │   └── TechnicalSummary.tsx        # 기술적 분석 요약 (RSI/MACD 해석)
│   │
│   ├── news/
│   │   ├── NewsList.tsx                # 뉴스 목록 컨테이너
│   │   └── NewsCard.tsx                # 뉴스 카드 + 감성 점수 (ui-spec.md §4-4)
│   │
│   └── ui/                             # 재사용 기본 컴포넌트
│       ├── Badge.tsx                   # AI 배지, 감성 배지
│       ├── Button.tsx                  # 기본 버튼
│       ├── Skeleton.tsx                # 로딩 스켈레톤
│       ├── Tabs.tsx                    # 탭 컴포넌트 (Radix UI 래핑)
│       └── Tooltip.tsx                 # 툴팁 (Radix UI 래핑)
│
├── hooks/                              # TanStack Query 커스텀 훅
│   ├── useStockQuote.ts                # 현재가 조회 (1분 캐시)
│   ├── useStockChart.ts                # OHLCV 차트 데이터 (1시간 캐시)
│   ├── useIndicators.ts                # RSI/MACD/MA 지표 (1시간 캐시)
│   ├── useMarketIndex.ts               # 시장 지수 (1분 캐시)
│   ├── useStockSearch.ts               # 종목 검색 자동완성
│   ├── useNews.ts                      # 뉴스 목록 (30분 캐시)
│   └── useAIAnalysis.ts                # AI 분석 스트리밍 훅
│
├── store/                              # Zustand 전역 상태
│   ├── watchlist.ts                    # 관심종목 (localStorage 영속화)
│   └── ui.ts                           # UI 상태 (패널 열림 여부, 최근 조회)
│
├── lib/
│   ├── api.ts                          # axios 인스턴스 + 공통 fetcher
│   ├── formatters.ts                   # 숫자/날짜/통화 포맷 유틸
│   ├── chart-theme.ts                  # lightweight-charts 다크 테마 설정
│   └── query-client.ts                 # TanStack Query 클라이언트 설정
│
├── types/
│   └── stock.ts                        # 전역 TypeScript 타입 정의
│
└── public/
    └── fonts/                          # Pretendard 폰트 (선택적 로컬 호스팅)
```

## API Routes 캐싱 전략

| Route | 캐싱 방식 | TTL |
|-------|----------|-----|
| `/api/stock/quote` | Next.js `revalidate` | 60초 |
| `/api/stock/chart` | Next.js `revalidate` | 3600초 |
| `/api/stock/indicators` | Next.js `revalidate` | 3600초 |
| `/api/market` | Next.js `revalidate` | 60초 |
| `/api/news` | Next.js `revalidate` | 1800초 |
| `/api/ai/analysis` | 캐싱 없음 (스트리밍) | - |
| `/api/ai/sentiment` | 클라이언트 TanStack Query | 1800초 |

## 클라이언트 TanStack Query staleTime 설정

| 훅 | staleTime | gcTime |
|----|----------|--------|
| `useStockQuote` | 60,000ms | 300,000ms |
| `useStockChart` | 3,600,000ms | 7,200,000ms |
| `useIndicators` | 3,600,000ms | 7,200,000ms |
| `useMarketIndex` | 60,000ms | 300,000ms |
| `useNews` | 1,800,000ms | 3,600,000ms |
| `useStockSearch` | 300,000ms | 600,000ms |
