# 🔄 Stock Analysis AI — Agent Workflow

## 프로젝트 개요
Claude AI 멀티 에이전트를 활용하여 주식 전망 분석 웹사이트를 기획/설계/개발하는 워크플로우

> 💡 **아키텍처 결정:** 백엔드 없이 Next.js 프론트엔드 Only로 구성
> 주식 데이터는 Yahoo Finance, Alpha Vantage 등 외부 API를 직접 활용

## 에이전트 구성
| 에이전트 | 파일 | 역할 |
|---------|------|------|
| 기획자 | agents/planner.md | 요구사항 정의, 기능 명세, IA 설계 |
| 디자이너 | agents/designer.md | UI/UX 설계, 디자인 시스템, 와이어프레임 |
| 개발자 | agents/developer.md | Next.js 코드 구현, API 연동 |

---

## 실행 순서

```
STEP 1 [Planner]
    ↓ 기능 명세서, 페이지 구조도, 외부 API 요구사항
STEP 2 [Designer]
    ↓ 디자인 시스템, 와이어프레임, 컴포넌트 명세
STEP 3 [Developer - 프로젝트 세팅]
    ↓ Next.js 초기 세팅, 폴더 구조, 환경변수
STEP 4 [Developer - API Routes]
    ↓ 외부 API 연동 (주식 데이터, 뉴스, Claude AI)
STEP 5 [Developer - 컴포넌트]
    ↓ 차트, 종목 카드, AI 분석, 뉴스 컴포넌트
STEP 6 [Developer - 페이지]
    ↓ 홈, 종목 상세, 종목 비교 페이지
STEP 7 [Review & Iterate]
    ↺ 피드백 반영 후 각 단계 재실행
```

---

## Claude.ai Project 사용 방법

### 준비
1. claude.ai → Projects → "Stock Analysis AI" 프로젝트 생성
2. Project Knowledge에 `agents/` 폴더의 MD 파일 3개 업로드
3. 아래 스텝 순서대로 대화 진행

---

### STEP 1: 기획 (Planner)

**프롬프트 템플릿:**
```
agents/planner.md의 기획자 에이전트로서 답해줘.

주식 전망 분석 웹사이트의 기능 명세서를 작성해줘.

아키텍처: Next.js 프론트엔드 Only (백엔드 없음, 외부 API 직접 활용)

핵심 기능:
- AI 기반 주가 전망 분석 (Claude API 활용)
- 차트 및 기술적 분석 (이동평균, RSI, MACD)
- 종목 검색 및 비교
- 뉴스/감성 분석

타겟 사용자: 국내 개인 투자자 (MZ세대 ~ 40대)

Output: 기능 명세서(MoSCoW), 페이지 구조도, 필요한 외부 API 목록
```

**결과물 저장 위치:** `docs/features.md`

---

### STEP 2: 디자인 (Designer)

**프롬프트 템플릿:**
```
agents/designer.md의 디자이너 에이전트로서 답해줘.

[STEP 1의 기능 명세서와 페이지 구조도를 여기에 붙여넣기]

위 내용을 바탕으로:
1. 홈(대시보드) 페이지 와이어프레임
2. 종목 상세 페이지 와이어프레임
3. 종목 비교 페이지 와이어프레임
4. 핵심 컴포넌트 명세 (StockCard, Chart, AIAnalysis, NewsCard)

Output: 와이어프레임, 컴포넌트 명세, 디자인 토큰
```

**결과물 저장 위치:** `docs/ui-spec.md`

---

### STEP 3: 프로젝트 세팅 (Developer)

**프롬프트 템플릿:**
```
agents/developer.md의 개발자 에이전트로서 답해줘.

Next.js 14 프로젝트 초기 세팅을 해줘:
1. package.json (필요한 패키지 전체)
2. 폴더 구조 생성
3. .env.local.example (필요한 API 키 목록)
4. tailwind.config.ts (디자인 시스템 색상 변수 포함)
5. tsconfig.json
6. 전역 타입 정의 (types/stock.ts)

[STEP 2의 디자인 토큰을 여기에 붙여넣기]
```

---

### STEP 4: API Routes 구현 (Developer)

**프롬프트 템플릿:**
```
agents/developer.md의 개발자 에이전트로서 답해줘.

다음 API Routes를 구현해줘 (API 키 보호 목적):
1. app/api/stock/quote/route.ts     - 현재가, 종목 정보 (Yahoo Finance)
2. app/api/stock/chart/route.ts     - 차트 데이터
3. app/api/stock/indicators/route.ts - RSI, MACD, 이동평균 (Alpha Vantage)
4. app/api/news/route.ts            - 관련 뉴스 (FMP)
5. app/api/ai/analysis/route.ts     - Claude AI 전망 분석
6. app/api/ai/sentiment/route.ts    - 뉴스 감성분석

각 Route에 에러 처리와 응답 타입 포함
```

---

### STEP 5: 컴포넌트 구현 (Developer)

**프롬프트 템플릿:**
```
agents/developer.md의 개발자 에이전트로서 답해줘.

[STEP 2의 컴포넌트 명세를 여기에 붙여넣기]

다음 컴포넌트를 구현해줘:
1. components/chart/CandlestickChart.tsx    - TradingView 캔들스틱
2. components/stock/StockCard.tsx           - 종목 요약 카드
3. components/analysis/AIAnalysisCard.tsx   - AI 전망 결과
4. components/news/NewsCard.tsx             - 뉴스 + 감성 점수
5. components/stock/StockSearch.tsx         - 종목 검색창
6. components/stock/StockCompare.tsx        - 종목 비교 테이블
```

---

### STEP 6: 페이지 구현 (Developer)

**프롬프트 템플릿:**
```
agents/developer.md의 개발자 에이전트로서 답해줘.

다음 페이지를 구현해줘:
1. app/page.tsx                  - 홈 대시보드 (인기 종목, 검색)
2. app/stock/[symbol]/page.tsx   - 종목 상세 (차트, AI 분석, 뉴스)
3. app/compare/page.tsx          - 종목 비교

[STEP 5에서 만든 컴포넌트 목록 붙여넣기]
```

---

## 외부 API 목록 (무료)

| API | 용도 | 가입 링크 |
|-----|------|---------|
| Yahoo Finance (RapidAPI) | 실시간 시세, 검색 | rapidapi.com |
| Alpha Vantage | 기술적 지표 (RSI, MACD) | alphavantage.co |
| Financial Modeling Prep | 뉴스, 재무 | financialmodelingprep.com |
| Anthropic Claude | AI 분석 | console.anthropic.com |

---

## 기술 스택 요약
```
Framework:  Next.js 14 (App Router)
Language:   TypeScript
Styling:    Tailwind CSS
State:      Zustand + TanStack Query
Chart:      TradingView Lightweight Charts
AI:         Claude API (Anthropic)
주식 데이터:  Yahoo Finance + Alpha Vantage (무료 API)
```

---

## 디렉토리 구조
```
stock-analysis/
├── README.md
├── agents/                  # Claude Agent 정의
│   ├── planner.md
│   ├── designer.md
│   ├── developer.md
│   └── workflow.md
├── docs/                    # 에이전트 산출물
│   ├── features.md          # STEP 1 결과
│   ├── ui-spec.md           # STEP 2 결과
│   └── api-spec.md          # API 명세
└── frontend/                # Next.js 프론트엔드
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── store/
    └── types/
```
