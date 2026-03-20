import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ─────────────────────────────────────────────
      // 색상 팔레트 (ui-spec.md §1-1 Design Tokens)
      // ─────────────────────────────────────────────
      colors: {
        // 배경
        bg: {
          primary:   '#0d1117',  // 최상위 배경
          secondary: '#161b22',  // 헤더, 사이드바
          card:      '#1c2128',  // 카드, 인풋
        },
        // 테두리
        border: {
          DEFAULT: '#30363d',
          hover:   '#58a6ff',
          error:   '#f85149',
        },
        // 텍스트
        text: {
          primary:   '#e6edf3',
          secondary: '#8b949e',
          tertiary:  '#444c56',
        },
        // 의미 색상
        accent:   '#58a6ff',   // 포커스, 링크, 액션
        positive: '#3fb950',   // 상승, 긍정
        negative: '#f85149',   // 하락, 부정
        warning:  '#d29922',   // 경고, 로딩

        // 이동평균선 전용 색상 (lightweight-charts 연동)
        ma: {
          5:   '#f0e68c',  // 연노랑
          20:  '#87ceeb',  // 하늘
          60:  '#dda0dd',  // 연보라
          120: '#f4a460',  // 주황
        },
      },

      // ─────────────────────────────────────────────
      // 폰트 (ui-spec.md §1-2)
      // ─────────────────────────────────────────────
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs:  ['11px', { lineHeight: '1.4' }],  // 레이블, 배지
        sm:  ['13px', { lineHeight: '1.5' }],  // 본문 보조, 수치
        md:  ['15px', { lineHeight: '1.6' }],  // 기본 본문
        lg:  ['18px', { lineHeight: '1.5' }],  // 카드 헤더
        xl:  ['24px', { lineHeight: '1.3' }],  // 현재가
        '2xl': ['32px', { lineHeight: '1.2' }], // 메인 가격
      },
      fontWeight: {
        normal:    '400',
        medium:    '500',
        semibold:  '600',
      },

      // ─────────────────────────────────────────────
      // 간격 시스템 (ui-spec.md §1-3)
      // ─────────────────────────────────────────────
      spacing: {
        '1':  '4px',
        '2':  '8px',
        '3':  '12px',
        '4':  '16px',
        '6':  '24px',
        '8':  '32px',
        // 레이아웃 전용
        'sidebar': '200px',
        'panel':   '280px',
        'header':  '44px',
      },

      // ─────────────────────────────────────────────
      // 반응형 브레이크포인트 (ui-spec.md §2)
      // ─────────────────────────────────────────────
      screens: {
        sm:  '640px',
        md:  '768px',   // Mobile ↔ Tablet 경계
        lg:  '1024px',
        xl:  '1280px',  // Tablet ↔ Desktop 경계
        '2xl': '1536px',
      },

      // ─────────────────────────────────────────────
      // 테두리 반경
      // ─────────────────────────────────────────────
      borderRadius: {
        sm:  '4px',
        md:  '6px',
        lg:  '8px',
        xl:  '12px',
        full: '9999px',
      },

      // ─────────────────────────────────────────────
      // 차트 높이 (ui-spec.md §4-2)
      // ─────────────────────────────────────────────
      height: {
        'chart-main':    '320px',
        'chart-mobile':  '220px',
        'chart-sub':     '100px',
        'header':        '44px',
      },

      // ─────────────────────────────────────────────
      // z-index 레이어
      // ─────────────────────────────────────────────
      zIndex: {
        header:    '100',
        dropdown:  '200',
        overlay:   '300',
        panel:     '400',
        tooltip:   '500',
      },

      // ─────────────────────────────────────────────
      // 애니메이션 (ui-spec.md 컴포넌트 상태)
      // ─────────────────────────────────────────────
      keyframes: {
        // Skeleton 로딩 pulse
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        // AI 스트리밍 커서 깜빡임
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        // 관심종목 패널 슬라이드인
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        slideOutRight: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(100%)' },
        },
        // 페이드인
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'pulse-skeleton': 'pulse 1.5s ease-in-out infinite',
        'blink-cursor':   'blink 0.7s step-end infinite',
        'slide-in-right': 'slideInRight 200ms ease-out',
        'slide-out-right':'slideOutRight 200ms ease-in',
        'fade-in':        'fadeIn 150ms ease-out',
      },

      // ─────────────────────────────────────────────
      // 박스 쉐도우
      // ─────────────────────────────────────────────
      boxShadow: {
        // 포커스 링 (접근성 ui-spec.md §6)
        focus: '0 0 0 2px #58a6ff',
        // 드롭다운 / 패널 elevation
        card: '0 2px 8px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
