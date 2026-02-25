'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/auth/store/useAuthStore';
import { httpClient } from '@/api/httpClient';

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
    const silentRefresh = async () => {
      try {
        // 크리에이터 전용 앱이므로 creator refresh 엔드포인트 사용
        const response = await httpClient.post('/api/auth/creator/refresh');

        if (response.data.success && response.data.data?.accessToken) {
          const token = response.data.data.accessToken;

          // JWT 디코딩
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = parseInt(payload.sub, 10);
          const userType = payload.type;
          const status = payload.status;

          setAuth(token, userId, userType, status);
        }
      } catch (error) {
        // RT가 없거나 만료된 경우 → 로그인 필요
        clearAuth();
      } finally {
        setInitialized();
      }
    };

    silentRefresh();
  }, [isInitialized, accessToken, setAuth, clearAuth, setInitialized]);

  // 초기화 중에는 로딩 표시 (선택)
  if (!isInitialized) {
    return null; // 또는 <div>Loading...</div>
  }

  return <>{children}</>;
}
