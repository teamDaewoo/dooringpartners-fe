'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { registerOAuthNickname, checkNicknameDuplicate } from "@/auth/api";
import { useAuthStore } from "@/auth/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SocialSignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("social_temp_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setTempToken(token);
  }, [router]);

  const validateNickname = (value: string) => {
    if (value.length < 2) return "닉네임은 2자 이상이어야 합니다.";
    if (value.length > 20) return "닉네임은 20자 이하여야 합니다.";
    return "";
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameAvailable(false);

    const validationError = validateNickname(value);
    setNicknameError(validationError);

    if (validationError) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setIsCheckingNickname(true);
      try {
        const response = await checkNicknameDuplicate(value);
        if (response.success && response.data) {
          if (response.data.available) {
            setNicknameAvailable(true);
            setNicknameError("");
          } else {
            setNicknameError("이미 사용 중인 닉네임입니다.");
          }
        }
      } catch {
        setNicknameError("닉네임 확인 중 오류가 발생했습니다.");
      } finally {
        setIsCheckingNickname(false);
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tempToken) return;
    if (!nicknameAvailable) {
      setNicknameError("닉네임 중복 확인이 필요합니다.");
      return;
    }
    if (!agreedTerms) {
      setError("약관에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerOAuthNickname({ nickname, agreedTerms }, tempToken);
      if (response.success && response.data?.accessToken) {
        sessionStorage.removeItem("social_temp_token");
        const token = response.data.accessToken;
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAuth(token, parseInt(payload.sub, 10), payload.type, payload.status);
        router.replace("/dashboard");
      } else {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err: any) {
      const code = err.response?.data?.code;
      if (code === "TOKEN_EXPIRED") {
        sessionStorage.removeItem("social_temp_token");
        router.replace("/login");
      } else if (code === "NICKNAME_DUPLICATED") {
        setNicknameError("이미 사용 중인 닉네임입니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tempToken) return null;

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

        <p className="text-center text-sm text-muted-foreground mb-6">
          사용할 닉네임을 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="2~20자"
              value={nickname}
              onChange={(e) => handleNicknameChange(e.target.value)}
              disabled={isSubmitting}
            />
            {isCheckingNickname && (
              <p className="text-xs text-muted-foreground">확인 중...</p>
            )}
            {nicknameError && (
              <p className="text-xs text-destructive">{nicknameError}</p>
            )}
            {nicknameAvailable && !nicknameError && (
              <p className="text-xs text-green-600">사용 가능한 닉네임입니다.</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="agreedTerms"
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4"
            />
            <Label htmlFor="agreedTerms" className="text-sm font-normal cursor-pointer">
              이용약관 및 개인정보처리방침에 동의합니다 (필수)
            </Label>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !nicknameAvailable || !agreedTerms}
          >
            {isSubmitting ? "처리 중..." : "가입 완료"}
          </Button>
        </form>
      </div>
    </div>
  );
}
