# 📈 Stock Analysis AI

Claude AI 멀티 에이전트를 활용한 주식 전망 분석 웹사이트 프로젝트

## 프로젝트 소개
기획자, 디자이너, 개발자 역할을 하는 Claude AI 에이전트들이 협업하여
주식 전망 분석 웹사이트를 설계하고 개발하는 프로젝트입니다.

> 💡 **아키텍처:** 별도 백엔드 없이 Next.js 프론트엔드 Only로 구성
> Yahoo Finance, Alpha Vantage 등 무료 외부 API를 직접 활용합니다.

## 핵심 기능
- 🤖 AI 기반 주가 전망 분석 (Claude API)
- 📊 차트 및 기술적 분석 (이동평균, RSI, MACD)
- 🔍 종목 검색 및 비교
- 📰 뉴스/감성 분석

## 기술 스택
| 구분 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 상태관리 | Zustand + TanStack Query |
| 차트 | TradingView Lightweight Charts |
| AI 분석 | Claude API (Anthropic) |
| 주식 데이터 | Yahoo Finance + Alpha Vantage (무료) |
| 뉴스 | Financial Modeling Prep (무료) |

## 외부 API (무료)
| API | 용도 | 무료 한도 |
|-----|------|---------|
| Yahoo Finance (RapidAPI) | 실시간 시세, 종목 검색 | 500회/월 |
| Alpha Vantage | RSI, MACD, 이동평균 | 25회/일 |
| Financial Modeling Prep | 뉴스, 재무 데이터 | 250회/일 |
| Claude API | AI 전망 분석, 감성분석 | 사용량 과금 |

## 에이전트 워크플로우
자세한 내용은 [agents/workflow.md](agents/workflow.md) 참고

```
Planner → Designer → Developer (세팅) → Developer (API) → Developer (컴포넌트) → Developer (페이지)
```

## 시작하기

### 1. Claude.ai Project 설정
1. claude.ai → Projects → "Stock Analysis AI" 생성
2. `agents/` 폴더의 MD 파일 3개를 Project Knowledge에 업로드
3. `agents/workflow.md`의 순서대로 진행

### 2. 로컬 개발 환경
```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local에 API 키 입력 후
npm run dev
```

### 3. 필요한 API 키 발급
- [Alpha Vantage](https://www.alphavantage.co) — 무료 가입
- [RapidAPI (Yahoo Finance)](https://rapidapi.com) — 무료 가입
- [Financial Modeling Prep](https://financialmodelingprep.com) — 무료 가입
- [Anthropic Console](https://console.anthropic.com) — Claude API 키

## 디렉토리 구조
```
stock-analysis/
├── README.md
├── agents/          # Claude Agent 정의 파일
│   ├── planner.md
│   ├── designer.md
│   ├── developer.md
│   └── workflow.md
├── docs/            # 에이전트 산출물 (기획/디자인 문서)
│   ├── features.md
│   └── ui-spec.md
└── frontend/        # Next.js 프론트엔드
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── store/
    └── types/
```
