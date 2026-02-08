import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const stored = localStorage.getItem("dooring_user");
    return stored ? JSON.parse(stored) : null;
  });

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
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
