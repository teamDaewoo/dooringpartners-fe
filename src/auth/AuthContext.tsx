'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { AuthContextType, User } from "./types";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Client-side only: load user from localStorage
    const stored = localStorage.getItem("dooring_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("dooring_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Mock authentication - accept any email with password "1234" or length >= 4
    if (!email || !password) {
      return { success: false, error: "이메일과 비밀번호를 입력해주세요." };
    }
    if (password.length < 4) {
      return { success: false, error: "비밀번호는 4자 이상이어야 합니다." };
    }

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    const userData = { email };
    setUser(userData);
    localStorage.setItem("dooring_user", JSON.stringify(userData));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("dooring_user");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
