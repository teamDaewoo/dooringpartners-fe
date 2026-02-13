'use client';

import { useState } from "react";
import { useProducts } from "@/hooks/product/useProducts";
import { ProductSearchHeader } from "@/components/product/ProductSearchHeader";
import { ProductCategoryFilter } from "@/components/product/ProductCategoryFilter";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPagination } from "@/components/product/ProductPagination";

function ProductSearchPageContent() {
  const [includeIssued, setIncludeIssued] = useState(false);

  const {
    products,
    categories,
    total,
    isLoading,
    searchQuery,
    selectedCategory,
    currentPage,
    totalPages,
    setSearchQuery,
    setSelectedCategory,
    setCurrentPage,
  } = useProducts({ perPage: 6 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-foreground mb-4">상품 둘러보기</h1>

      <ProductSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex gap-6">
        <ProductCategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ProductGrid
          products={products}
          total={total}
          isLoading={isLoading}
          includeIssued={includeIssued}
          onIncludeIssuedChange={setIncludeIssued}
        />
      </div>

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default function ProductSearchPage() {
  return <ProductSearchPageContent />;
}
