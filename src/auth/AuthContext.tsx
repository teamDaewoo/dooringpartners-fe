'use client';

import type { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";

// AuthProvider는 하위 호환성을 위해 유지
// 실제 상태는 Zustand 스토어(useAuthStore)가 관리함
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  return useAuthStore();
}
