'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/auth/hooks/useAuth";
import { getOAuthAuthorizeUrl } from "@/auth/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OAuthProvider } from "@/auth/types";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsCreator, isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<OAuthProvider | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginAsCreator({ email, password });
      if (result.success) {
        router.replace("/dashboard");
      } else {
        setError(result.error ?? "로그인에 실패했습니다.");
      }
    } catch {
      setError("로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: OAuthProvider) => {
    if (socialLoading) return;
    setSocialLoading(provider);
    try {
      const state = crypto.randomUUID();
      sessionStorage.setItem("oauth_state", state);

      const response = await getOAuthAuthorizeUrl(provider, state);
      if (response.success && response.data?.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      } else {
        setError("소셜 로그인을 시작할 수 없습니다. 다시 시도해주세요.");
        setSocialLoading(null);
      }
    } catch {
      setError("소셜 로그인 중 오류가 발생했습니다.");
      setSocialLoading(null);
    }
  };

  const isSocialLoading = socialLoading !== null;

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isSocialLoading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || isSocialLoading}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting || isSocialLoading}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">또는</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin("kakao")}
            disabled={isSocialLoading}
          >
            {socialLoading === "kakao" ? "연결 중..." : "카카오로 로그인"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin("google")}
            disabled={isSocialLoading}
          >
            {socialLoading === "google" ? "연결 중..." : "구글로 로그인"}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="text-foreground hover:underline transition-colors">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
