'use client';

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { categories, products, type Product } from "@/data/mockData";

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function ProductSearchPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [includeIssued, setIncludeIssued] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory === "전체" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">상품 둘러보기</h1>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="상품명을 검색하세요..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 text-sm"
            />
          </div>
          <Button size="sm">검색</Button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Categories */}
          <div className="w-48 shrink-0">
            <h3 className="text-sm font-semibold mb-3">카테고리</h3>
            <RadioGroup value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
              {categories.map((cat) => (
                <div key={cat} className="flex items-center gap-2 py-1">
                  <RadioGroupItem value={cat} id={`cat-${cat}`} />
                  <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">{cat}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">검색결과 <span className="font-medium text-foreground">{filtered.length}</span>개</p>
              <div className="flex items-center gap-2">
                <Label htmlFor="include-issued" className="text-xs text-muted-foreground">발급된 링크 포함</Label>
                <Switch id="include-issued" checked={includeIssued} onCheckedChange={setIncludeIssued} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                검색 결과가 없습니다.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-6">
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 text-xs"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  다음
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <Link href={`/product/${product.id}`}>
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

export default function ProductSearchPage() {
  return <ProductSearchPageContent />;
}
