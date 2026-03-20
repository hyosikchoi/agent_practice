'use client'
// components/chart/CandlestickChart.tsx
import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
} from 'lightweight-charts'
import { clsx } from 'clsx'
import { CandlestickChartProps, Period, SubIndicator } from '@/types/stock'
import { darkChartTheme, candlestickOptions, MA_COLORS } from '@/lib/chart-theme'
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
  const mainRef = useRef<HTMLDivElement>(null)
  const subRef  = useRef<HTMLDivElement>(null)

  const chartRef    = useRef<IChartApi | null>(null)
  const subChartRef = useRef<IChartApi | null>(null)

  const candleSeriesRef  = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef  = useRef<ISeriesApi<'Histogram'> | null>(null)
  const maSeriesRef      = useRef<Record<string, ISeriesApi<'Line'>>>({})

  // 메인 차트 초기화
  useEffect(() => {
    if (!mainRef.current) return

    const chart = createChart(mainRef.current, {
      ...darkChartTheme,
      width:  mainRef.current.clientWidth,
      height: 320,
    })

    const candleSeries = chart.addSeries(CandlestickSeries, candlestickOptions)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color:     '#58a6ff33',
      priceScaleId: 'volume',
      priceFormat: { type: 'volume' },
    })

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    })

    chartRef.current       = chart
    candleSeriesRef.current = candleSeries
    volumeSeriesRef.current = volumeSeries

    // 리사이즈 대응
    const observer = new ResizeObserver(() => {
      if (mainRef.current) chart.resize(mainRef.current.clientWidth, 320)
    })
    if (mainRef.current) observer.observe(mainRef.current)

    return () => {
      observer.disconnect()
      chart.remove()
    }
  }, [])

  // OHLCV 데이터 업데이트
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !ohlcv.length) return
    candleSeriesRef.current.setData(
      ohlcv.map((d) => ({ time: d.time, open: d.open, high: d.high, low: d.low, close: d.close }))
    )
    volumeSeriesRef.current.setData(
      ohlcv.map((d) => ({
        time:  d.time,
        value: d.volume,
        color: d.close >= d.open ? '#3fb95033' : '#f8514933',
      }))
    )
    chartRef.current?.timeScale().fitContent()
  }, [ohlcv])

  // MA 데이터 업데이트
  useEffect(() => {
    if (!chartRef.current) return
    const chart = chartRef.current

    // 기존 MA 시리즈 제거
    Object.values(maSeriesRef.current).forEach((s) => chart.removeSeries(s))
    maSeriesRef.current = {}

    const maKeys = ['ma5', 'ma20', 'ma60', 'ma120'] as const
    maKeys.forEach((key) => {
      if (!ma[key]) return
      const series = chart.addSeries(LineSeries, {
        color:       MA_COLORS[key as keyof typeof MA_COLORS],
        lineWidth:   1,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      })
      maSeriesRef.current[key] = series
    })
  }, [ma])

  // 서브 차트 (RSI / MACD)
  useEffect(() => {
    if (!subRef.current) return

    // 기존 서브 차트 제거
    if (subChartRef.current) {
      subChartRef.current.remove()
      subChartRef.current = null
    }

    if (!subIndicator) return

    const subChart = createChart(subRef.current, {
      ...darkChartTheme,
      width:  subRef.current.clientWidth,
      height: 100,
    })
    subChartRef.current = subChart

    if (subIndicator === 'RSI' && rsiData?.length) {
      const rsiSeries = subChart.addSeries(LineSeries, { color: '#58a6ff', lineWidth: 1 })
      rsiSeries.setData(rsiData.map((d) => ({ time: d.time, value: d.value })))

      // 70/30 기준선
      subChart.addSeries(LineSeries, {
        color: '#f8514966', lineWidth: 1, lineStyle: 2,
        priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
      }).setData(rsiData.map((d) => ({ time: d.time, value: 70 })))

      subChart.addSeries(LineSeries, {
        color: '#3fb95066', lineWidth: 1, lineStyle: 2,
        priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
      }).setData(rsiData.map((d) => ({ time: d.time, value: 30 })))
    }

    if (subIndicator === 'MACD' && macdData?.length) {
      subChart.addSeries(LineSeries, { color: '#58a6ff', lineWidth: 1 })
        .setData(macdData.map((d) => ({ time: d.time, value: d.macd })))
      subChart.addSeries(LineSeries, { color: '#f4a460', lineWidth: 1 })
        .setData(macdData.map((d) => ({ time: d.time, value: d.signal })))
      subChart.addSeries(HistogramSeries, {
        color: '#3fb95066',
      }).setData(macdData.map((d) => ({
        time:  d.time,
        value: d.histogram,
        color: d.histogram >= 0 ? '#3fb95066' : '#f8514966',
      })))
    }

    subChart.timeScale().fitContent()
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
      {/* 툴바: 기간 + MA 토글 + 차트 타입 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* 기간 버튼 */}
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

        {/* MA 토글 */}
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
              style={ma[key] ? { backgroundColor: MA_COLORS[key as keyof typeof MA_COLORS] } : undefined}
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

      {/* 서브 차트 탭 + 차트 */}
      <div>
        <div className="flex gap-1 mb-1">
          {(['RSI', 'MACD', null] as (SubIndicator)[]).map((s) => (
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
