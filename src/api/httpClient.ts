import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/auth/store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Refresh 상태 관리
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Axios 인스턴스 생성
export const httpClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // RT 쿠키 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: AT 자동 주입
httpClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 처리 + Refresh
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러이고, refresh 시도 전이면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // 크리에이터 전용 앱이므로 기본값은 'creator'
          const { userType } = useAuthStore.getState();
          const actualUserType = userType || 'creator';

          // Refresh 요청
          const refreshResponse = await axios.post(
            `${API_URL}/api/auth/${actualUserType}/refresh`,
            {},
            { withCredentials: true }
          );

          if (refreshResponse.data.success && refreshResponse.data.data?.accessToken) {
            const newAccessToken = refreshResponse.data.data.accessToken;

            // JWT 디코딩해서 userId, status 추출
            const payload = JSON.parse(atob(newAccessToken.split('.')[1]));
            const userId = parseInt(payload.sub, 10);
            const status = payload.status;

            // Auth store 업데이트
            useAuthStore.getState().setAuth(newAccessToken, userId, userType, status);

            // 대기 중인 요청들에게 새 토큰 전달
            onRefreshed(newAccessToken);
            isRefreshing = false;

            // 원래 요청 재시도
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return httpClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh 실패 → 로그아웃 처리
          isRefreshing = false;
          refreshSubscribers = [];
          useAuthStore.getState().clearAuth();

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      // 이미 refreshing 중이면 대기
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(httpClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
