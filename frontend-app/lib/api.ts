// lib/api.ts
// axios 인스턴스 + 공통 fetcher

import axios from 'axios'
import { ApiErrorResponse } from '@/types/stock'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// 공통 GET fetcher (TanStack Query queryFn에서 사용)
export async function fetcher<T>(url: string, params?: Record<string, string>): Promise<T> {
  const { data } = await apiClient.get<T>(url, { params })
  return data
}

// 공통 POST fetcher
export async function poster<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.post<T>(url, body)
  return data
}

// 에러 메시지 추출 헬퍼
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined
    return data?.error?.message ?? error.message
  }
  if (error instanceof Error) return error.message
  return '알 수 없는 오류가 발생했습니다.'
}
