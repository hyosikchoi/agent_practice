// app/api/ai/analysis/route.ts
// Claude API 스트리밍 전망 분석
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { AIAnalysisContext } from '@/types/stock'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const { context }: { context: AIAnalysisContext } = await req.json()

  const prompt = `
당신은 전문 주식 분석가입니다. 아래 데이터를 바탕으로 ${context.symbol} 종목의 투자 전망을 분석해주세요.

## 현재 시세
- 현재가: ${context.quote.price}
- 등락률: ${context.quote.changePercent.toFixed(2)}%
- 거래량: ${context.quote.volume.toLocaleString()}

## 기술적 지표
${context.indicators.rsi ? `- RSI(14): ${context.indicators.rsi.slice(-1)[0]?.value?.toFixed(1)}` : ''}
${context.indicators.macd ? `- MACD: ${context.indicators.macd.slice(-1)[0]?.macd?.toFixed(2)}` : ''}

## 최근 뉴스 감성
${context.news.map(n => `- [${n.sentiment}] ${n.headline}`).join('\n')}

다음 JSON 형식으로 응답해주세요:
{
  "verdict": "bullish" | "neutral" | "bearish",
  "confidence": 0~100,
  "summary": "종합 전망 요약 (2~3문장)",
  "bullPoints": ["매수 포인트 1", "매수 포인트 2", "매수 포인트 3"],
  "bearPoints": ["리스크 1", "리스크 2"],
  "techSummary": "기술적 분석 요약 (1~2문장)"
}
`

  const stream = anthropic.messages.stream({
    model:      process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages:   [{ role: 'user', content: prompt }],
  })

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
