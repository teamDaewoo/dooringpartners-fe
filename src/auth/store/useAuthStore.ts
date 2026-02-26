import { create } from 'zustand';
import type { UserType, UserStatus } from '@/auth/types';

interface AuthState {
  // State
  accessToken: string | null;
  userId: number | null;
  userType: UserType | null;
  status: UserStatus | null;
  isInitialized: boolean;

  // Actions
  setAuth: (token: string, userId: number, userType: UserType, status: UserStatus) => void;
  clearAuth: () => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  // Initial state - 메모리에만 저장 (XSS 방어)
  accessToken: null,
  userId: null,
  userType: null,
  status: null,
  isInitialized: false,

  // Actions
  setAuth: (token, userId, userType, status) =>
    set({
      accessToken: token,
      userId,
      userType,
      status,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      userId: null,
      userType: null,
      status: null,
    }),

  setInitialized: () => set({ isInitialized: true }),
}));
