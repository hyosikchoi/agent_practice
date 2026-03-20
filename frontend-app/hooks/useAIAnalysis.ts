'use client'
// hooks/useAIAnalysis.ts
import { useState, useCallback } from 'react'
import { AIAnalysisContext, AIAnalysisResult, AIVerdict } from '@/types/stock'

interface UseAIAnalysisReturn {
  result:      Partial<AIAnalysisResult> | null
  isStreaming: boolean
  isError:     boolean
  run:         (context: AIAnalysisContext) => Promise<void>
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [result,      setResult]      = useState<Partial<AIAnalysisResult> | null>(null)
  const [isStreaming, setIsStreaming]  = useState(false)
  const [isError,     setIsError]      = useState(false)

  const run = useCallback(async (context: AIAnalysisContext) => {
    setIsStreaming(true)
    setIsError(false)
    setResult({ symbol: context.symbol, summary: '', bullPoints: [], bearPoints: [] })

    try {
      const res = await fetch('/api/ai/analysis', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ context }),
      })

      if (!res.ok || !res.body) throw new Error('스트리밍 응답 오류')

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        setResult((prev) => ({ ...prev, summary: buffer }))
      }

      // 스트리밍 완료 후 JSON 파싱
      try {
        const clean   = buffer.replace(/```json|```/g, '').trim()
        const parsed  = JSON.parse(clean)
        setResult({
          symbol:      context.symbol,
          verdict:     parsed.verdict     as AIVerdict,
          confidence:  parsed.confidence  as number,
          summary:     parsed.summary     as string,
          bullPoints:  parsed.bullPoints  as string[],
          bearPoints:  parsed.bearPoints  as string[],
          techSummary: parsed.techSummary as string,
          analyzedAt:  new Date().toISOString(),
          newsCount:   context.news.length,
        })
      } catch {
        // JSON 파싱 실패 시 raw 텍스트 그대로 표시
        setResult((prev) => ({
          ...prev,
          verdict:    'neutral',
          confidence: 50,
          bullPoints: [],
          bearPoints: [],
        }))
      }
    } catch (err) {
      console.error('[useAIAnalysis]', err)
      setIsError(true)
    } finally {
      setIsStreaming(false)
    }
  }, [])

  return { result, isStreaming, isError, run }
}
