'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/auth/hooks/useAuth";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const router = useRouter();
  const { isLoggedIn, status } = useAuth();
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
    if (status !== "pending") {
      router.replace("/dashboard");
    }
  }, [isInitialized, isLoggedIn, status, router]);

  if (!isInitialized || !isLoggedIn || status !== "pending") return null;

  const handleVerify = (provider: "toss" | "kakao" | "naver") => {
    // TODO: 벤더 SDK 연동 후 구현
    alert(`${provider} 실명인증은 준비 중입니다.`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/dooring-logo.png"
            alt="두링파트너스"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-bold text-xl text-foreground">두링파트너스</span>
        </div>

        <h1 className="text-center text-lg font-semibold mb-2">실명인증이 필요합니다</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          서비스 이용을 위해 본인인증을 완료해주세요.
        </p>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleVerify("toss")}
          >
            토스로 인증하기
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleVerify("kakao")}
          >
            카카오로 인증하기
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleVerify("naver")}
          >
            네이버로 인증하기
          </Button>
        </div>
      </div>
    </div>
  );
}
