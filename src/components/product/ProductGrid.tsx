import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  total: number;
  isLoading: boolean;
  includeIssued: boolean;
  onIncludeIssuedChange: (value: boolean) => void;
}

export function ProductGrid({
  products,
  total,
  isLoading,
  includeIssued,
  onIncludeIssuedChange
}: ProductGridProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          검색결과 <span className="font-medium text-foreground">{total}</span>개
        </p>
        <div className="flex items-center gap-2">
          <Label htmlFor="include-issued" className="text-xs text-muted-foreground">
            발급된 링크 포함
          </Label>
          <Switch
            id="include-issued"
            checked={includeIssued}
            onCheckedChange={onIncludeIssuedChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">로딩 중...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              검색 결과가 없습니다.
            </div>
          )}
        </>
      )}
    </div>
  );
}
