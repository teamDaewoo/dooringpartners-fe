import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface ProductDetailInfoProps {
  product: Product;
  onIssueLinkClick: () => void;
}

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

const commissionHistory = [
  { period: "2025.10 ~ 2025.12", rate: 10, amount: 5275 },
  { period: "2025.07 ~ 2025.09", rate: 8, amount: 4220 },
  { period: "2025.04 ~ 2025.06", rate: 9, amount: 4748 },
];

export function ProductDetailInfo({ product, onIssueLinkClick }: ProductDetailInfoProps) {
  return (
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
      <Button
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        size="lg"
        onClick={onIssueLinkClick}
      >
        링크 발급하기
      </Button>
    </div>
  );
}
