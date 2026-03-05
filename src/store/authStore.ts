import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import type { User } from '@/auth/types'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(4, '비밀번호는 4자 이상이어야 합니다.'),
})

export type LoginInput = z.infer<typeof loginSchema>

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  _setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const result = loginSchema.safeParse({ email, password })
        if (!result.success) {
          return { success: false, error: result.error.errors[0].message }
        }

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 500))

        const userData: User = { email: result.data.email }
        set({ user: userData, isAuthenticated: true })
        return { success: true }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      _setHydrated: () => set({ isLoading: false }),
    }),
    {
      name: 'dooring_user',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated()
      },
    },
  ),
)
