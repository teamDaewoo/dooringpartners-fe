'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { products } from "@/data/mockData";

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

const commissionHistory = [
  { period: "2025.10 ~ 2025.12", rate: 10, amount: 5275 },
  { period: "2025.07 ~ 2025.09", rate: 8, amount: 4220 },
  { period: "2025.04 ~ 2025.06", rate: 9, amount: 4748 },
];

function ProductDetailPageContent() {
  const { id } = useParams();
  const { toast } = useToast();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">상품을 찾을 수 없습니다.</p>
          <Link href="/products" className="text-accent hover:underline text-sm mt-2 inline-block">
            상품 목록으로 돌아가기
          </Link>
        </div>
      </>
    );
  }

  const handleIssueLink = () => {
    toast({
      title: "링크가 발급되었습니다",
      description: `${product.name}에 대한 어필리에이트 링크가 생성되었습니다.`,
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Link href="/products" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          상품 목록
        </Link>

        <div className="flex gap-8">
          {/* Left - Image */}
          <div className="w-1/2 shrink-0">
            <div className="aspect-square bg-gradient-to-br from-info/30 to-info/10 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-info/40" />
            </div>
            <Button variant="outline" className="w-full mt-3 text-sm">
              <ImageIcon className="h-4 w-4 mr-2" />
              이미지 더보기
            </Button>
          </div>

          {/* Right - Info (sticky) */}
          <div className="flex-1 sticky top-[60px] self-start">
            <h1 className="text-xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
            <p className="text-lg font-bold text-foreground mb-4">{formatKRW(product.price)}</p>

            {/* Campaign period + commission */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-1">캠페인 기간</p>
              <p className="text-sm font-medium mb-2">{product.campaignStart} ~ {product.campaignEnd}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">커미션율 <span className="font-bold text-accent">{product.commissionRate}%</span></span>
                <span className="text-lg font-bold text-accent">{formatKRW(product.commissionAmount)}</span>
              </div>
            </div>

            {/* Commission history */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">이전 커미션 이력</h3>
              <div className="space-y-2">
                {commissionHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{h.period}</span>
                    <span>{h.rate}% · {formatKRW(h.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="border-l-4 border-info bg-info/5 px-4 py-3 rounded-r-lg mb-6">
              <p className="text-sm text-foreground">
                본 상품의 커미션은 실제 구매 확정 후 지급됩니다. 반품 및 취소 건은 커미션 대상에서 제외됩니다.
              </p>
            </div>

            {/* CTA */}
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" onClick={handleIssueLink}>
              링크 발급하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProductDetailPage() {
  return (
    
      <ProductDetailPageContent />
    
  );
}
