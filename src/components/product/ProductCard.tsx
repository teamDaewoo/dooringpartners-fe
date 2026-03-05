import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <Link href={`/products/${product.id}`}>
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <span className="text-muted-foreground text-xs">상품 이미지</span>
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {product.campaignStart} ~ {product.campaignEnd}
          </p>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">커미션 {product.commissionRate}%</span>
            <span className="text-sm font-bold text-accent">
              {`₩${product.commissionAmount.toLocaleString()}`}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
