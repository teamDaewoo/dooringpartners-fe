'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";

const partnerLogos = [
  "PartnerA", "PartnerB", "PartnerC", "PartnerD", "PartnerE",
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/report");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-[60px] border-b border-border bg-background sticky top-0 z-50">
        <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/dooring-logo.png"
              alt="두링파트너스"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="font-bold text-base text-foreground">두링파트너스</span>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              로그인
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <section className="max-w-2xl mx-auto text-center py-24 md:py-32">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
            두링파트너스와 함께하는
            <br />
            스마트한 파트너십
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            데이터 기반의 투명한 성과 관리와 실시간 리포팅으로
            <br className="hidden sm:block" />
            파트너의 성공을 지원합니다
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="gap-2 px-8">
                시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Partner logos */}
        <section className="w-full max-w-4xl mx-auto pb-16">
          <p className="text-xs text-muted-foreground text-center mb-6 uppercase tracking-widest">
            주요 파트너사
          </p>
          <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
            {partnerLogos.map((name) => (
              <div
                key={name}
                className="flex items-center gap-1.5 text-muted-foreground/40"
              >
                <div className="h-5 w-5 rounded-full bg-muted-foreground/20" />
                <span className="text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
