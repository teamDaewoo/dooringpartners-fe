'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { oauthCallback } from "@/auth/api";
import { useAuthStore } from "@/auth/store/useAuthStore";
import type { OAuthProvider } from "@/auth/types";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const savedState = sessionStorage.getItem("oauth_state");
    const savedProvider = sessionStorage.getItem("oauth_provider") as OAuthProvider | null;

    if (!code || !state || !savedState || !savedProvider) {
      router.replace("/login");
      return;
    }

    if (state !== savedState) {
      setError("잘못된 접근입니다. 다시 시도해주세요.");
      setTimeout(() => router.replace("/login"), 2000);
      return;
    }

    sessionStorage.removeItem("oauth_state");
    sessionStorage.removeItem("oauth_provider");

    oauthCallback(savedProvider, { code, state })
      .then((response) => {
        if (!response.success || !response.data) {
          setError("소셜 로그인에 실패했습니다. 다시 시도해주세요.");
          setTimeout(() => router.replace("/login"), 2000);
          return;
        }

        const data = response.data;

        if (data.status === "EXISTING") {
          const token = data.accessToken;
          const payload = JSON.parse(atob(token.split(".")[1]));
          setAuth(token, parseInt(payload.sub, 10), payload.type, payload.status);
          router.replace("/dashboard");
        } else if (data.status === "NEEDS_NICKNAME") {
          sessionStorage.setItem("social_temp_token", data.tempToken);
          router.replace("/signup/social");
        }
      })
      .catch(() => {
        setError("소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        setTimeout(() => router.replace("/login"), 2000);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <p className="text-sm text-muted-foreground">로그인 처리 중...</p>
      )}
    </div>
  );
}
