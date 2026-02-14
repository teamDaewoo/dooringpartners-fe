'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/common/TopBar";
import { useAuth } from "@/auth/AuthContext";

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>{children}</main>
    </div>
  );
}
