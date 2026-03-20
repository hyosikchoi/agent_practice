// lib/chart-theme.ts
// lightweight-charts 다크 테마 설정 (CSS 변수 직접 참조 불가 → 하드코딩)

export const darkChartTheme = {
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
  timeScale: {
    borderColor: '#30363d',
    timeVisible: true,
  },
  rightPriceScale: {
    borderColor: '#30363d',
  },
}

export const candlestickOptions = {
  upColor:         '#3fb950',
  downColor:       '#f85149',
  borderUpColor:   '#3fb950',
  borderDownColor: '#f85149',
  wickUpColor:     '#3fb950',
  wickDownColor:   '#f85149',
}

// 이동평균선 색상 (ui-spec.md §4-2)
export const MA_COLORS = {
  ma5:   '#f0e68c',  // 연노랑
  ma20:  '#87ceeb',  // 하늘
  ma60:  '#dda0dd',  // 연보라
  ma120: '#f4a460',  // 주황
} as const
