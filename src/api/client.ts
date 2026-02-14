/**
 * API Client
 *
 * Mock API 호출을 시뮬레이션하는 유틸리티
 * 실제 API로 전환 시 이 파일만 수정하면 됨
 */

/**
 * Mock fetch 함수
 * 실제 네트워크 요청을 시뮬레이션하여 300ms 지연 후 데이터 반환
 *
 * @param data - 반환할 데이터
 * @param delay - 지연 시간 (ms, 기본값: 300)
 * @returns Promise로 감싼 데이터
 */
export async function mockFetch<T>(data: T, delay = 300): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return data;
}

/**
 * 실제 API 호출 예시 (향후 사용)
 *
 * export async function apiClient<T>(
 *   endpoint: string,
 *   options?: RequestInit
 * ): Promise<T> {
 *   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
 *     ...options,
 *     headers: {
 *       'Content-Type': 'application/json',
 *       Authorization: `Bearer ${getToken()}`,
 *       ...options?.headers,
 *     },
 *   });
 *
 *   if (!response.ok) {
 *     throw new Error(`API Error: ${response.statusText}`);
 *   }
 *
 *   return response.json();
 * }
 */
