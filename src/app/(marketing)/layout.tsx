'use client';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* 간단한 헤더 (추후 구현) */}
      <main>{children}</main>
    </div>
  );
}
