'use client';

import { useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/auth/store/useAuthStore';
import type { UserType } from '@/auth/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// AuthProvider: Silent Refresh 처리
export function AuthProvider({ children }: { children: ReactNode }) {
  const { setAuth, clearAuth, isInitialized, setInitialized, accessToken } = useAuthStore();

  useEffect(() => {
    // 이미 초기화되었거나 AT가 있으면 스킵
    if (isInitialized || accessToken) {
      if (!isInitialized) setInitialized();
      return;
    }

    // Silent Refresh: RT 쿠키로 AT 복원 시도
    // 인터셉터 없는 순수 axios 사용 (httpClient 사용 시 401 → 재시도 루프 발생)
    const silentRefresh = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/api/auth/creator/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success && response.data.data?.accessToken) {
          const token = response.data.data.accessToken;

          // JWT 디코딩
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = parseInt(payload.sub, 10);
          const userType = payload.type?.toLowerCase() as UserType;
          const status = payload.status;

          setAuth(token, userId, userType, status);
        }
      } catch {
        // RT가 없거나 만료된 경우 → 로그인 필요 (정상 케이스)
        clearAuth();
      } finally {
        setInitialized();
      }
    };

    silentRefresh();
  }, [isInitialized, accessToken, setAuth, clearAuth, setInitialized]);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}
