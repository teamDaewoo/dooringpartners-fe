import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/auth/store/useAuthStore';
import {
  sellerLogin,
  creatorLogin,
  sellerLogout,
  creatorLogout,
  sellerSignup,
  creatorSignup,
} from '@/auth/api';
import type {
  LoginRequest,
  SignupSellerRequest,
  SignupCreatorRequest,
  JwtPayload,
} from '@/auth/types';

export function useAuth() {
  const router = useRouter();
  const { accessToken, userId, userType, status, setAuth, clearAuth } = useAuthStore();

  // JWT 디코딩 헬퍼
  const decodeJwt = (token: string): JwtPayload => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      throw new Error('JWT 파싱 실패: 토큰 형식이 올바르지 않습니다.');
    }
  };

  // Seller 로그인
  const loginAsSeller = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await sellerLogin(credentials);

        if (response.success && response.data?.accessToken) {
          const token = response.data.accessToken;
          const payload = decodeJwt(token);
          const userId = parseInt(payload.sub, 10);

          setAuth(token, userId, 'seller', payload.status);
          return { success: true };
        }

        return { success: false, error: response.message || '로그인에 실패했습니다.' };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || '로그인 중 오류가 발생했습니다.',
        };
      }
    },
    [setAuth]
  );

  // Creator 로그인
  const loginAsCreator = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await creatorLogin(credentials);

        if (response.success && response.data?.accessToken) {
          const token = response.data.accessToken;
          const payload = decodeJwt(token);
          const userId = parseInt(payload.sub, 10);

          setAuth(token, userId, 'creator', payload.status);
          return { success: true };
        }

        return { success: false, error: response.message || '로그인에 실패했습니다.' };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || '로그인 중 오류가 발생했습니다.',
        };
      }
    },
    [setAuth]
  );

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      if (userType === 'seller') {
        await sellerLogout();
      } else if (userType === 'creator') {
        await creatorLogout();
      }
    } catch (error) {
      // API 실패해도 로컬 상태는 클리어
      console.error('Logout API failed:', error);
    } finally {
      // 반드시 clearAuth + 리다이렉트
      clearAuth();
      router.push('/login');
    }
  }, [userType, clearAuth, router]);

  // Seller 회원가입
  const signupAsSeller = useCallback(async (data: SignupSellerRequest) => {
    try {
      const response = await sellerSignup(data);

      if (response.success && response.data) {
        return { success: true, data: response.data };
      }

      return { success: false, error: response.message || '회원가입에 실패했습니다.' };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
      };
    }
  }, []);

  // Creator 회원가입
  const signupAsCreator = useCallback(async (data: SignupCreatorRequest) => {
    try {
      const response = await creatorSignup(data);

      if (response.success && response.data) {
        return { success: true, data: response.data };
      }

      return { success: false, error: response.message || '회원가입에 실패했습니다.' };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
      };
    }
  }, []);

  return {
    // State
    isLoggedIn: !!accessToken,
    userId,
    userType,
    status,

    // Actions
    loginAsSeller,
    loginAsCreator,
    logout,
    signupAsSeller,
    signupAsCreator,
  };
}
