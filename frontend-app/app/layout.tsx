// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/components/ui/QueryProvider'

export const metadata: Metadata = {
  title:       'StockAI — 주식 전망 분석',
  description: 'AI 기반 주식 전망 분석 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-bg-primary text-text-primary min-h-screen">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
