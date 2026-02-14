'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/product/useProduct";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductImageDisplay } from "@/components/product/ProductImageDisplay";
import { ProductDetailInfo } from "@/components/product/ProductDetailInfo";

function ProductDetailPageContent() {
  const { id } = useParams();
  const { toast } = useToast();
  const { product, isLoading } = useProduct(id as string);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">상품을 찾을 수 없습니다.</p>
        <Link href="/products" className="text-accent hover:underline text-sm mt-2 inline-block">
          상품 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleIssueLink = () => {
    toast({
      title: "링크가 발급되었습니다",
      description: `${product.name}에 대한 어필리에이트 링크가 생성되었습니다.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ProductBreadcrumb />

      <div className="flex gap-8">
        <ProductImageDisplay />
        <ProductDetailInfo product={product} onIssueLinkClick={handleIssueLink} />
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return <ProductDetailPageContent />;
}
