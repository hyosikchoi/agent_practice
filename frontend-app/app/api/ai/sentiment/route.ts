// app/api/ai/sentiment/route.ts
// 뉴스 감성분석 배치 처리 (Claude API)
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SentimentBatchResult } from '@/types/stock'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const { articles }: { articles: { id: string; headline: string; summary?: string }[] } =
    await req.json()

  if (!articles?.length) {
    return NextResponse.json(
      { data: null, error: { code: 'MISSING_PARAM', message: 'articles가 필요합니다.' } },
      { status: 400 }
    )
  }

  const prompt = `
다음 뉴스 기사들의 주식 투자 관점에서의 감성을 분석해주세요.

${articles.map((a, i) => `[${i}] id: "${a.id}"
헤드라인: ${a.headline}
${a.summary ? `요약: ${a.summary}` : ''}`).join('\n\n')}

반드시 아래 JSON 배열 형식으로만 응답하세요 (다른 텍스트 금지):
[
  {"id": "기사id", "sentiment": "positive" | "neutral" | "negative", "score": -1.0~1.0},
  ...
]
`

  try {
    const response = await anthropic.messages.create({
      model:      process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages:   [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // JSON 파싱 (마크다운 코드블록 제거)
    const clean   = text.replace(/```json|```/g, '').trim()
    const results: SentimentBatchResult[] = JSON.parse(clean)

    return NextResponse.json({ data: results, error: null })
  } catch (err) {
    console.error('[/api/ai/sentiment]', err)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: '감성 분석에 실패했습니다.' } },
      { status: 500 }
    )
  }
}
