import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ProductBreadcrumb() {
  return (
    <Link
      href="/products"
      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      상품 목록
    </Link>
  );
}
