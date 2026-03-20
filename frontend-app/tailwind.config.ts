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
      colors: {
        bg: {
          primary:   '#0d1117',
          secondary: '#161b22',
          card:      '#1c2128',
        },
        border: {
          DEFAULT: '#30363d',
          hover:   '#58a6ff',
          error:   '#f85149',
        },
        text: {
          primary:   '#e6edf3',
          secondary: '#8b949e',
          tertiary:  '#444c56',
        },
        accent:   '#58a6ff',
        positive: '#3fb950',
        negative: '#f85149',
        warning:  '#d29922',
        ma: {
          5:   '#f0e68c',
          20:  '#87ceeb',
          60:  '#dda0dd',
          120: '#f4a460',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs:    ['11px', { lineHeight: '1.4' }],
        sm:    ['13px', { lineHeight: '1.5' }],
        md:    ['15px', { lineHeight: '1.6' }],
        lg:    ['18px', { lineHeight: '1.5' }],
        xl:    ['24px', { lineHeight: '1.3' }],
        '2xl': ['32px', { lineHeight: '1.2' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        'sidebar': '200px',
        'panel':   '280px',
        'header':  '44px',
      },
      screens: {
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        sm:   '4px',
        md:   '6px',
        lg:   '8px',
        xl:   '12px',
        full: '9999px',
      },
      height: {
        'chart-main':   '320px',
        'chart-mobile': '220px',
        'chart-sub':    '100px',
        'header':       '44px',
      },
      zIndex: {
        header:   '100',
        dropdown: '200',
        overlay:  '300',
        panel:    '400',
        tooltip:  '500',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        slideOutRight: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'pulse-skeleton':  'pulse 1.5s ease-in-out infinite',
        'blink-cursor':    'blink 0.7s step-end infinite',
        'slide-in-right':  'slideInRight 200ms ease-out',
        'slide-out-right': 'slideOutRight 200ms ease-in',
        'fade-in':         'fadeIn 150ms ease-out',
      },
      boxShadow: {
        focus: '0 0 0 2px #58a6ff',
        card:  '0 2px 8px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
