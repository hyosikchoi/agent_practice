'use client'
// components/chart/CandlestickChart.tsx
import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { CandlestickChartProps, Period, SubIndicator } from '@/types/stock'
import { MA_COLORS } from '@/lib/chart-theme'
import { Skeleton } from '@/components/ui/Skeleton'

const PERIODS: Period[] = ['1D', '1W', '1M', '3M', '1Y']

export default function CandlestickChart({
  symbol,
  period,
  ohlcv,
  ma,
  subIndicator,
  rsiData,
  macdData,
  isLoading,
  onPeriodChange,
  onMAToggle,
  onSubChange,
}: CandlestickChartProps) {
  const mainRef     = useRef<HTMLDivElement>(null)
  const subRef      = useRef<HTMLDivElement>(null)
  const chartRef    = useRef<any>(null)
  const subChartRef = useRef<any>(null)

  // ── 차트 초기화 + 데이터 세팅 (ohlcv 바뀔 때마다 재실행) ──
  useEffect(() => {
    if (!mainRef.current || !ohlcv.length) return

    // 기존 차트 제거
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }

    import('lightweight-charts').then(({ createChart, CandlestickSeries, HistogramSeries }) => {
      if (!mainRef.current) return

      const chart = createChart(mainRef.current, {
        width:  mainRef.current.clientWidth,
        height: 320,
        layout: {
          background: { color: '#0d1117' },
          textColor:  '#8b949e',
        },
        grid: {
          vertLines: { color: '#30363d' },
          horzLines: { color: '#30363d' },
        },
        crosshair: {
          vertLine: { color: '#58a6ff' },
          horzLine: { color: '#58a6ff' },
        },
        timeScale: {
          borderColor:    '#30363d',
          timeVisible:    true,
          secondsVisible: false,
        },
        rightPriceScale: { borderColor: '#30363d' },
      })

      // 캔들 시리즈
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor:         '#3fb950',
        downColor:       '#f85149',
        borderUpColor:   '#3fb950',
        borderDownColor: '#f85149',
        wickUpColor:     '#3fb950',
        wickDownColor:   '#f85149',
      })

      // 거래량 시리즈
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color:        '#58a6ff33',
        priceScaleId: 'volume',
        priceFormat:  { type: 'volume' },
      })
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      })

      // 중복 날짜 제거 + 최근 200개만 사용
      const seen    = new Set<string>()
      const cleaned = ohlcv
        .filter((d) => {
          if (seen.has(d.time)) return false
          seen.add(d.time)
          return d.open > 0 && d.high > 0 && d.low > 0 && d.close > 0
        })
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(-200)

      candleSeries.setData(
        cleaned.map((d) => ({
          time:  d.time as any,
          open:  d.open,
          high:  d.high,
          low:   d.low,
          close: d.close,
        }))
      )
      volumeSeries.setData(
        cleaned.map((d) => ({
          time:  d.time as any,
          value: d.volume,
          color: d.close >= d.open ? '#3fb95033' : '#f8514933',
        }))
      )
      chart.timeScale().fitContent()

      chartRef.current = { chart, candleSeries, volumeSeries, maSeries: {}, cleaned }

      // 리사이즈 대응
      const observer = new ResizeObserver(() => {
        if (mainRef.current) chart.resize(mainRef.current.clientWidth, 320)
      })
      observer.observe(mainRef.current)
      chartRef.current.observer = observer
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.observer?.disconnect()
        chartRef.current.chart?.remove()
        chartRef.current = null
      }
    }
  }, [ohlcv]) // ohlcv 바뀔 때마다 차트 재생성

  // ── MA 시리즈 ────────────────────────────────────────────
  useEffect(() => {
    if (!chartRef.current?.chart || !ohlcv.length) return

    import('lightweight-charts').then(({ LineSeries }) => {
      if (!chartRef.current?.chart) return
      const { chart, maSeries, cleaned } = chartRef.current
      const data = cleaned ?? ohlcv

      // 기존 MA 제거
      Object.values(maSeries).forEach((s: any) => {
        try { chart.removeSeries(s) } catch {}
      })
      chartRef.current.maSeries = {}

      const maKeys = ['ma5', 'ma20', 'ma60', 'ma120'] as const
      maKeys.forEach((key) => {
        if (!ma[key]) return
        const p = parseInt(key.replace('ma', ''))
        const maData = data
          .map((_: any, i: number, arr: any[]) => {
            if (i < p - 1) return null
            const avg = arr.slice(i - p + 1, i + 1).reduce((s: number, d: any) => s + d.close, 0) / p
            return { time: arr[i].time as any, value: avg }
          })
          .filter(Boolean)

        const series = chart.addSeries(LineSeries, {
          color:                  MA_COLORS[key],
          lineWidth:              1,
          priceLineVisible:       false,
          lastValueVisible:       false,
          crosshairMarkerVisible: false,
        })
        series.setData(maData)
        chartRef.current.maSeries[key] = series
      })
    })
  }, [ma, ohlcv])

  // ── 서브 차트 ────────────────────────────────────────────
  useEffect(() => {
    if (!subRef.current) return

    if (subChartRef.current) {
      subChartRef.current.remove()
      subChartRef.current = null
    }
    if (!subIndicator) return

    import('lightweight-charts').then(({ createChart, LineSeries, HistogramSeries }) => {
      if (!subRef.current) return

      const subChart = createChart(subRef.current, {
        width:  subRef.current.clientWidth,
        height: 100,
        layout: { background: { color: '#0d1117' }, textColor: '#8b949e' },
        grid: { vertLines: { color: '#30363d' }, horzLines: { color: '#30363d' } },
        timeScale: { borderColor: '#30363d', timeVisible: true },
        rightPriceScale: { borderColor: '#30363d', scaleMargins: { top: 0.1, bottom: 0.1 } },
      })
      subChartRef.current = subChart

      if (subIndicator === 'RSI' && rsiData?.length) {
        subChart.addSeries(LineSeries, { color: '#58a6ff', lineWidth: 1 })
          .setData(rsiData.map((d) => ({ time: d.time as any, value: d.value })))
        subChart.addSeries(LineSeries, {
          color: '#f8514966', lineWidth: 1, lineStyle: 2,
          priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
        }).setData(rsiData.map((d) => ({ time: d.time as any, value: 70 })))
        subChart.addSeries(LineSeries, {
          color: '#3fb95066', lineWidth: 1, lineStyle: 2,
          priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
        }).setData(rsiData.map((d) => ({ time: d.time as any, value: 30 })))
      }

      if (subIndicator === 'MACD' && macdData?.length) {
        subChart.addSeries(LineSeries, { color: '#58a6ff', lineWidth: 1 })
          .setData(macdData.map((d) => ({ time: d.time as any, value: d.macd })))
        subChart.addSeries(LineSeries, { color: '#f4a460', lineWidth: 1 })
          .setData(macdData.map((d) => ({ time: d.time as any, value: d.signal })))
        subChart.addSeries(HistogramSeries, { color: '#3fb95066' })
          .setData(macdData.map((d) => ({
            time:  d.time as any,
            value: d.histogram,
            color: d.histogram >= 0 ? '#3fb95066' : '#f8514966',
          })))
      }
      subChart.timeScale().fitContent()
    })
  }, [subIndicator, rsiData, macdData])

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-[320px] w-full rounded-lg" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange?.(p)}
              className={clsx(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                period === p
                  ? 'bg-accent/20 border border-accent/40 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {(['ma5', 'ma20', 'ma60', 'ma120'] as const).map((key) => (
            <button
              key={key}
              onClick={() => onMAToggle?.(key)}
              className={clsx(
                'px-2 py-0.5 rounded text-xs font-medium transition-colors border',
                ma[key]
                  ? 'border-transparent text-bg-primary'
                  : 'border-border text-text-tertiary hover:text-text-secondary'
              )}
              style={ma[key] ? { backgroundColor: MA_COLORS[key] } : undefined}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 차트 */}
      <div
        ref={mainRef}
        className="w-full rounded-lg overflow-hidden border border-border"
        style={{ height: '320px' }}
      />

      {/* 서브 차트 탭 */}
      <div>
        <div className="flex gap-1 mb-1">
          {(['RSI', 'MACD', null] as SubIndicator[]).map((s) => (
            <button
              key={String(s)}
              onClick={() => onSubChange?.(s)}
              className={clsx(
                'px-2.5 py-0.5 rounded text-xs transition-colors',
                subIndicator === s
                  ? 'bg-bg-secondary text-text-primary border border-border'
                  : 'text-text-tertiary hover:text-text-secondary'
              )}
            >
              {s ?? '없음'}
            </button>
          ))}
        </div>
        {subIndicator && (
          <div
            ref={subRef}
            className="w-full rounded-lg overflow-hidden border border-border"
            style={{ height: '100px' }}
          />
        )}
      </div>
    </div>
  )
}
