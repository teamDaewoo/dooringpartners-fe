'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/common/TopBar";
import { useAuth } from "@/auth/hooks/useAuth";
import { useAuthStore } from "@/auth/store/useAuthStore";

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isInitialized, isLoggedIn, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>{children}</main>
    </div>
  );
}
