# 🎨 주식 전망 분석 웹사이트 — UI/UX 설계 명세서

> 디자이너 에이전트 산출물 | 레퍼런스: Bloomberg Terminal, TradingView
> 다크모드 우선 설계 | WCAG 2.1 AA 준수

---

## 1. 디자인 시스템 (Design Tokens)

### 1-1. 색상 팔레트 (다크모드 기준)

```css
/* 배경 */
--color-bg-primary:    #0d1117;   /* 최상위 배경 */
--color-bg-secondary:  #161b22;   /* 헤더, 사이드바 */
--color-bg-card:       #1c2128;   /* 카드, 인풋 */

/* 테두리 */
--color-border:        #30363d;   /* 기본 경계선 */

/* 텍스트 */
--color-text-primary:   #e6edf3;  /* 주요 텍스트 */
--color-text-secondary: #8b949e;  /* 보조 텍스트 */
--color-text-tertiary:  #444c56;  /* 힌트, 비활성 */

/* 의미 색상 */
--color-accent-blue:    #58a6ff;  /* 포커스, 링크, 액션 */
--color-positive:       #3fb950;  /* 상승, 긍정 */
--color-negative:       #f85149;  /* 하락, 부정 */
--color-warning:        #d29922;  /* 경고, 로딩 */
```

### 1-2. 타이포그래피

```css
--font-family: 'Pretendard', 'Inter', sans-serif;

--font-size-xs:  11px;  /* 레이블, 배지 */
--font-size-sm:  13px;  /* 본문 보조, 수치 */
--font-size-md:  15px;  /* 기본 본문 */
--font-size-lg:  18px;  /* 카드 헤더 */
--font-size-xl:  24px;  /* 현재가 */
--font-size-2xl: 32px;  /* 메인 가격 표시 */

/* 폰트 무게: 400(regular), 500(medium), 600(semibold) */
```

### 1-3. 간격 시스템

```css
--spacing-1:  4px;
--spacing-2:  8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-6: 24px;
--spacing-8: 32px;
```

### 1-4. 컴포넌트 상태 (공통)

| 상태 | 스타일 규칙 |
|------|------------|
| `default` | `border: 0.5px solid #30363d`, `bg: #1c2128` |
| `hover` | `border-color: #58a6ff` (blue 강조) |
| `active` | `background: #58a6ff22`, `border-color: #58a6ff` |
| `disabled` | `opacity: 0.4`, 포인터 이벤트 없음 |
| `loading` | Skeleton UI + `#d29922` 워닝 컬러, pulse 애니메이션 |
| `error` | `border-color: #f85149`, `background: #f8514911` |

---

## 2. 반응형 레이아웃 가이드

| 브레이크포인트 | 레이아웃 변화 |
|---|---|
| Desktop ≥ 1280px | 사이드바(200px) + 메인 고정 2컬럼 |
| Tablet 768–1279px | 사이드바 숨김 → 하단 탭바로 전환 |
| Mobile < 768px | 전체 싱글 컬럼, 종목 탭(차트/AI/뉴스) 스와이프 |

---

## 3. 페이지 와이어프레임

### 3-1. 홈 (대시보드) — `/`

```
+-------------------------------------------------------------------+
| Header                                                            |
| [◈ STOCKAI]  [검색창: 종목명 또는 티커 검색... ⌘K]  [☆][♪][👤]  |
+-------------------+-----------------------------------------------+
| Sidebar (200px)   | Main Content                                  |
|                   |                                               |
| [관심종목]         | ┌─────────┐ ┌─────────┐ ┌─────────┐          |
| 005930  +2.14% ●  | │ KOSPI   │ │ KOSDAQ  │ │ S&P 500 │          |
| AAPL    -0.83%    | │2,645.12 │ │  871.44 │ │5,481.29 │          |
| 000660  +1.07%    | │▲+0.70% │ │▼-0.37% │ │▲+0.45% │          |
| NVDA    +3.42%    | └─────────┘ └─────────┘ └─────────┘          |
| TSLA    -1.55%    |                                               |
|                   | [관심종목]                        [+ 종목 추가] |
| [섹터 필터]        | ┌──────┬───────┬───────┬──────┬──────┬───┐  |
| 전체 ●            | │ 종목 │ 현재가 │ 등락률 │ 거래량│미니차트│AI│  |
| 반도체            | ├──────┼───────┼───────┼──────┼──────┼───┤  |
| 전기차·배터리      | │삼성전자│ 82,400│ +2.14%│ 14.2M│ ~~~~↗│↑매수│  |
| 바이오            | │AAPL  │$189.30│ -0.83%│ 52.1M│ ~~~~↘│→중립│  |
| 빅테크            | │SK하이닉│190,500│ +1.07%│  3.8M│ ~~~~↗│→중립│  |
|                   | │NVDA  │$875.50│ +3.42%│ 41.7M│ ~~~~↗│↑매수│  |
|                   | └──────┴───────┴───────┴──────┴──────┴───┘  |
|                   |                                               |
|                   | [최근 조회]                                    |
|                   | ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐     |
|                   | │068270 │ │ MSFT  │ │035720 │ │ TSLA  │     |
|                   | │셀트리온│ │Microsoft│ │카카오  │ │ Tesla │     |
|                   | │178,500│ │$415.20│ │ 52,300│ │$242.80│     |
|                   | │▼-1.2%│ │▲+0.8%│ │▼-0.6%│ │▼-1.6%│     |
|                   | └───────┘ └───────┘ └───────┘ └───────┘     |
+-------------------+-----------------------------------------------+
```

**레이아웃 규칙**
- 헤더 높이: 44px, `position: sticky; top: 0; z-index: 100`
- 사이드바: `width: 200px`, 모바일에서 숨김 처리
- 시장 지수 위젯: 3열 그리드, 1분 주기 자동 갱신 (TanStack Query `staleTime: 60000`)
- 관심종목 테이블: 미니차트(5일 sparkline, `lightweight-charts` 또는 inline SVG)
- AI 배지: `↑ 매수` / `→ 중립` / `↓ 관망` 3종

---

### 3-2. 종목 상세 — `/stock/[symbol]`

```
+-------------------------------------------------------------------+
| Header (글로벌 공통)                                               |
+-------------------------------------------------------------------+
| Stock Header                                                      |
| [KRX · 코스피] 삼성전자   82,400원                                 |
| 005930 · 전기전자         ▲ 1,720 (+2.14%) 전일 대비               |
|                           시가:81,200  고가:82,900  저가:81,000    |
|                           거래량:14.2M  시가총액:491.8조            |
|                           [☆ 관심 추가]                           |
+-------------------------------------------------------------------+
| [차트] [AI 전망] [뉴스] [재무(예정)]                               |
+-------------------------------------------------------------------+
| 차트 탭                                                            |
|                                                                   |
| [1D] [1W★] [1M] [3M] [1Y]  |  [MA5] [MA20] [MA60] [MA120]       |
|                              |  [캔들▾] [라인▾]                   |
|                                                                   |
| ┌───────────────────────────────────────────────────────────────┐|
| │  O:81,200  H:82,900  L:81,000  C:82,400  |  거래량: 14.2M    ││
| │                                                               ││
| │  ─────────────── MA120 (주황)                                 ││
| │         ──────── MA60  (보라)                                 ││
| │  ────────────── MA20  (하늘)                                  ││
| │      ─────────── MA5   (노랑)                                 ││
| │                                                               ││
| │  [캔들스틱 차트 영역 — lightweight-charts]                    ││
| │                   ┃ (crosshair)                               ││
| │    ┄┄┄┄┄┄┄┄┄82,400 ━━━━━━━━━━━━━━━━━━━━                    ││
| │                                                               ││
| │  [거래량 바 차트 — 하단 20%]                                   ││
| └───────────────────────────────────────────────────────────────┘|
|                                                                   |
| [RSI (14) ★] [MACD]                                              |
| ┌───────────────────────────────────────────────────────────────┐|
| │ 과매수(70) ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  RSI: 64.2           ││
| │                  ━━━━━━━━━━━━━━━━━━━━━                        ││
| │ 과매도(30) ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄                       ││
| └───────────────────────────────────────────────────────────────┘|
+-------------------------------------------------------------------+
```

**차트 탭 UX 규칙**
- 메인 차트 높이: 데스크톱 `320px`, 모바일 `220px`
- 서브 차트 높이: `100px` 고정
- 기간 버튼 활성 상태: `background: #58a6ff22; border-color: #58a6ff; color: #58a6ff`
- 이동평균선 색상 규칙:
  - MA5: `#f0e68c` (연노랑)
  - MA20: `#87ceeb` (하늘)
  - MA60: `#dda0dd` (연보라)
  - MA120: `#f4a460` (주황)
- Crosshair: 파란 점선 (`#58a6ff`, `stroke-dasharray: 3 3`)
- OHLCV 툴팁: 좌상단 고정 오버레이 (`position: absolute; top: 8px; left: 12px`)

---

## 4. 핵심 컴포넌트 명세

### 4-1. StockCard

**용도**: 관심종목 리스트, 검색 결과, 대시보드 그리드

```typescript
interface StockCardProps {
  symbol:     string;            // 티커 (005930, AAPL)
  name:       string;            // 종목 전체명
  price:      number;            // 현재가
  change:     number;            // 등락률 (%)
  volume:     number;            // 거래량
  aiVerdict:  'buy' | 'neutral' | 'sell' | null;
  sparkData:  number[];          // 5일 종가 배열 (미니차트용)
  isLoading?: boolean;
  isError?:   boolean;
}
```

**시각 규칙**
```
┌─────────────────────────────┐
│ [티커]          [AI 배지]    │  ← 상단: 종목 정보 + AI 판단
│ [종목 전체명]               │
│                             │
│ [현재가 (15px/600)]         │  ← 중단: 가격 정보
│ [등락률 ▲/▼ + 컬러]        │
│                             │
│ [거래량]      [sparkline]   │  ← 하단: 보조 정보
└─────────────────────────────┘

AI 배지 색상:
  buy     → bg:#3fb95022  border:#3fb95044  text:#3fb950  "↑ 매수"
  neutral → bg:#58a6ff22  border:#58a6ff44  text:#58a6ff  "→ 중립"
  sell    → bg:#f8514922  border:#f8514944  text:#f85149  "↓ 관망"
  null    → 배지 미표시

로딩 상태: 모든 텍스트 영역을 Skeleton (bg:#161b22, pulse 애니메이션) 으로 대체
에러 상태: 카드 border-color: #f85149, 재시도 버튼 노출
```

---

### 4-2. CandlestickChart (+ RSI/MACD 서브차트)

**용도**: 종목 상세 > 차트 탭 핵심 컴포넌트

```typescript
interface CandlestickChartProps {
  symbol:        string;
  period:        '1D' | '1W' | '1M' | '3M' | '1Y';
  ohlcv:         OHLCVData[];
  ma: {
    ma5:   boolean;
    ma20:  boolean;
    ma60:  boolean;
    ma120: boolean;
  };
  subIndicator:  'RSI' | 'MACD' | null;
  rsiData?:      RSIData[];
  macdData?:     MACDData[];
  isLoading?:    boolean;
}
```

**레이아웃 구조**
```
┌──────────────────────────────────────────────────────┐
│  [Toolbar: 기간 버튼 | MA 토글 | 차트 타입]          │
├──────────────────────────────────────────────────────┤
│  [OHLCV 툴팁 오버레이 — 좌상단]                      │
│                                                      │
│  [메인 캔들스틱 차트]           [Y축 가격 레이블]      │
│  - 이동평균선 오버레이                                │
│  - Crosshair (파란 점선)                             │
│  - 거래량 바 차트 (하단 20%)                         │
│                                 [X축 날짜 레이블]    │
├──────────────────────────────────────────────────────┤
│  [서브차트 탭: RSI | MACD]                           │
├──────────────────────────────────────────────────────┤
│  [서브차트 영역 — 100px]                             │
│  RSI: 70선(빨강 점선), 30선(초록 점선), RSI 라인      │
│  MACD: MACD선(파랑), Signal선(주황), Histogram(바)   │
└──────────────────────────────────────────────────────┘

높이: 메인차트 320px (모바일 220px) + 서브차트 100px
라이브러리: lightweight-charts (TradingView)
다크 테마: ChartOptions에 커스텀 색상 직접 주입 (CSS 변수 참조 불가)
```

**lightweight-charts 다크 테마 설정값**
```typescript
const darkTheme = {
  layout: {
    background: { color: '#0d1117' },
    textColor:  '#8b949e',
  },
  grid: {
    vertLines: { color: '#30363d' },
    horzLines: { color: '#30363d' },
  },
  crosshair: {
    vertLine: { color: '#58a6ff', style: 1 },
    horzLine: { color: '#58a6ff', style: 1 },
  },
  upColor:   '#3fb950',  // 양봉
  downColor: '#f85149',  // 음봉
  borderUpColor:   '#3fb950',
  borderDownColor: '#f85149',
  wickUpColor:     '#3fb950',
  wickDownColor:   '#f85149',
};
```

---

### 4-3. AIAnalysisCard (스트리밍 UX)

**용도**: 종목 상세 > AI 전망 탭

```typescript
interface AIAnalysisCardProps {
  verdict:     'bullish' | 'neutral' | 'bearish';
  confidence:  number;         // 0~100
  summary:     string;         // Claude 스트리밍 텍스트 (점진 업데이트)
  bullPoints:  string[];       // 매수 포인트 배열
  bearPoints:  string[];       // 매도 포인트 배열
  timestamp:   Date;
  isStreaming: boolean;        // true → 커서 애니메이션, 재생성 비활성화
  onRegenerate: () => void;
}
```

**레이아웃 구조**
```
┌──────────────────────────────────────────────────────────┐
│ Header                                                   │
│ [판정 Pill: ↑ 상승 전망]  [신뢰도 바: 74%]  [모델명]    │
├──────────────────────────────────────────────────────────┤
│ Body                                                     │
│ ┃ AI 종합 요약 텍스트 (스트리밍 중 커서 깜빡임▌)         │
│                                                          │
│ ┌───────────────────┐ ┌───────────────────┐             │
│ │ ↑ Bullish         │ │ ↓ Bearish         │             │
│ │ · HBM 수요 확대   │ │ · 환율 변동성     │             │
│ │ · 파운드리 회복   │ │ · TSMC 경쟁 심화  │             │
│ │ · MA20 지지 안착  │ │ · RSI 과매수 근접 │             │
│ └───────────────────┘ └───────────────────┘             │
├──────────────────────────────────────────────────────────┤
│ Footer                                                   │
│ [분석 기준: 2026.03.20 14:32 · 뉴스 10건 포함]  [⟳ 재분석]│
└──────────────────────────────────────────────────────────┘

판정 Pill 색상:
  bullish → bg:#3fb95022  border:#3fb95044  text:#3fb950
  neutral → bg:#58a6ff22  border:#58a6ff44  text:#58a6ff
  bearish → bg:#f8514922  border:#f8514944  text:#f85149

신뢰도 바: height 5px, bg:#161b22, fill 색상은 판정과 동일 컬러

커서 애니메이션:
  display: inline-block; width: 2px; height: 12px;
  background: #58a6ff; animation: blink 0.7s step-end infinite;

isStreaming = true 시:
  - 커서 표시
  - 재분석 버튼 disabled (opacity: 0.4, pointer-events: none)
  - bullPoints, bearPoints 영역은 스트리밍 완료 후 파싱/표시

에러 상태:
  - 요약 영역에 에러 메시지
  - "재분석 요청" 버튼만 활성화
```

**스트리밍 구현 패턴 (Next.js Route Handler)**
```typescript
// app/api/ai/analysis/route.ts
export async function POST(req: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const anthropicStream = await anthropic.messages.stream({ ... });
      for await (const chunk of anthropicStream) {
        controller.enqueue(chunk.delta?.text ?? '');
      }
      controller.close();
    }
  });
  return new Response(stream);
}

// hooks/useAIAnalysis.ts
const reader = response.body!.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  setSummary(prev => prev + new TextDecoder().decode(value));
}
```

---

### 4-4. NewsCard (감성 점수 포함)

**용도**: 종목 상세 > 뉴스 탭

```typescript
interface NewsCardProps {
  headline:    string;
  source:      string;
  publishedAt: Date;
  sentiment:   'positive' | 'neutral' | 'negative' | 'pending';
  score:       number;           // -1.0 ~ +1.0
  url:         string;
}
```

**레이아웃 구조**
```
┌──┬──────────────────────────────────────────┐
│●  │ [헤드라인 텍스트 12px/1.5 line-height]   │
│   │ [출처]  [시간]          [감성 점수 배지]  │
└──┴──────────────────────────────────────────┘

좌측 컬러 도트 (8px circle):
  positive → #3fb950 (녹색)
  negative → #f85149 (빨강)
  neutral  → #444c56 (회색)
  pending  → #d29922 (노랑, 로딩 인디케이터 함께 표시)

감성 점수 배지:
  positive (score > 0.3)  → "긍정 +0.87"  bg:#3fb95022  text:#3fb950
  negative (score < -0.3) → "부정 -0.64"  bg:#f8514922  text:#f85149
  neutral                 → "중립 +0.02"  bg:#1c2128    text:#8b949e
  pending                 → "감성분석 중..."           text:#d29922

감성 분석 처리:
  - 뉴스 10건을 한 번의 Claude API 호출로 배치 처리 (비용 최적화)
  - pending 상태에서 skeleton 로딩, 완료 후 도트 + 배지 전환
  - Claude 프롬프트에 JSON 응답 형식 강제:
    [{"id": "...", "sentiment": "positive", "score": 0.87}, ...]
```

---

## 5. 전역 컴포넌트

### 5-1. Header

```
+-------------------------------------------------------------------+
| ◈ STOCKAI  |  [검색창: 종목명 또는 티커 검색... ⌘K]  |  [☆][♪][U] |
+-------------------------------------------------------------------+

높이: 44px
background: #161b22
border-bottom: 0.5px solid #30363d
position: sticky; top: 0; z-index: 100

검색창:
  - width: 최대 400px, flex-grow: 1
  - 자동완성 드롭다운: z-index 200, max-height 360px, scroll
  - 단축키 표시: ⌘K (Mac) / Ctrl+K (Win)

관심종목 아이콘 클릭 → 오른쪽에서 슬라이드인 패널 (translateX 애니메이션)
```

### 5-2. 관심종목 사이드 패널

```
[오른쪽 슬라이드인 패널 — 280px]
+-------------------------------+
│ 관심종목 (5)    [✕ 닫기]      │
├───────────────────────────────┤
│ 005930 삼성전자   82,400      │
│                  ▲ +2.14%    │
├───────────────────────────────┤
│ AAPL  Apple     $189.30      │
│                  ▼ -0.83%    │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│ [+ 종목 추가]                 │
└───────────────────────────────┘

애니메이션: transform: translateX(100%) → translateX(0), 200ms ease-out
오버레이: background: rgba(0,0,0,0.5), 클릭 시 닫힘
```

---

## 6. 접근성 (WCAG 2.1 AA)

| 항목 | 적용 규칙 |
|------|----------|
| 색상 대비 | 텍스트 최소 4.5:1 (`#e6edf3` on `#0d1117` = 16.7:1 ✓) |
| 포커스 링 | `outline: 2px solid #58a6ff; outline-offset: 2px` |
| 키보드 내비게이션 | Tab 순서, Enter/Space 액션, Escape 패널 닫기 |
| 스크린 리더 | `aria-label`, `role="status"` (로딩), `aria-live="polite"` (스트리밍 텍스트) |
| 가격 등락 | 색상 외 ▲/▼ 기호 병행 표시 (색맹 대응) |
| 로딩 상태 | `aria-busy="true"`, Skeleton에 `aria-label="데이터 로딩 중"` |

---

## 7. Developer 에이전트 인계 사항

1. **lightweight-charts 다크 테마**: CSS 변수 직접 참조 불가 → `ChartOptions`에 하드코딩된 색상값 주입 필요
2. **AI 스트리밍**: Next.js Route Handler에서 `ReadableStream` → 클라이언트 `useAIAnalysis` 훅에서 `reader.read()` 루프
3. **뉴스 감성 배치**: 뉴스 10건을 개별 호출 금지 → 단일 Claude API 호출, JSON 응답 형식 강제
4. **Skeleton UI**: 모든 카드 컴포넌트에 `isLoading` prop 필수 구현, pulse 애니메이션 (`@keyframes pulse`)
5. **관심종목 패널**: Zustand store에서 전역 `isWatchlistOpen` 상태 관리
6. **MA 색상**: `lightweight-charts` `LineSeries`에 `color` 옵션으로 직접 지정 (CSS 불가)
7. **모바일 탭**: 종목 상세 페이지 탭(차트/AI/뉴스)은 스와이프 제스처 지원 권장 (`touch-action: pan-x`)
