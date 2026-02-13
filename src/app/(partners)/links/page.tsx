'use client';

import { Search, ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { LinkPlatform, LinkPriority, LinkStatus } from "@/types/link";
import { useLinks } from "@/hooks/link/useLinks";

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

const platformColors: Record<LinkPlatform, string> = {
  "네이버 블로그": "bg-success/15 text-success border-success/30",
  "유튜브": "bg-destructive/15 text-destructive border-destructive/30",
  "인스타그램": "bg-info/15 text-info border-info/30",
  "틱톡": "bg-foreground/10 text-foreground border-foreground/20",
  "기타": "bg-muted text-muted-foreground border-border",
};

const priorityConfig: Record<LinkPriority, { icon: typeof ArrowUp; color: string; label: string }> = {
  "높음": { icon: ArrowUp, color: "text-destructive", label: "높음" },
  "보통": { icon: ArrowRight, color: "text-muted-foreground", label: "보통" },
  "낮음": { icon: ArrowDown, color: "text-success", label: "낮음" },
};

const statusColors: Record<LinkStatus, string> = {
  "활성": "bg-success/15 text-success",
  "만료예정": "bg-warning/15 text-warning-foreground",
  "만료": "bg-muted text-muted-foreground",
};

function LinkManagePageContent() {
  // React Query Hook 사용
  const {
    links,
    total,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    perPage,
    setSearchQuery,
    setCurrentPage,
  } = useLinks({ perPage: 10 });

  return (
    <>
      {/* Header section */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="text-xl font-bold text-foreground">컨텐츠 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            발급된 링크와 콘텐츠를 관리하세요.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="링크 또는 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="예상 수입" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">높은 순</SelectItem>
              <SelectItem value="low">낮은 순</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="만료일" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soon">임박순</SelectItem>
              <SelectItem value="far">여유순</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[120px] text-xs">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="expiring">만료예정</SelectItem>
              <SelectItem value="expired">만료</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground">번호</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground">플랫폼</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground">제목/URL</th>
                    <th className="p-3 text-right text-xs font-medium text-muted-foreground">예상 수입</th>
                    <th className="p-3 text-center text-xs font-medium text-muted-foreground">만료일</th>
                    <th className="p-3 text-center text-xs font-medium text-muted-foreground">우선순위</th>
                    <th className="p-3 text-center text-xs font-medium text-muted-foreground">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                        로딩 중...
                      </td>
                    </tr>
                  ) : links.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    links.map((row) => {
                    const PriorityIcon = priorityConfig[row.priority].icon;
                    return (
                      <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-sm font-mono text-muted-foreground">{row.issuedNumber}</td>
                        <td className="p-3">
                          <Badge variant="outline" className={cn("text-xs", platformColors[row.platform])}>
                            {row.platform}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <p className="text-sm font-medium">{row.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[250px]">{row.url}</p>
                        </td>
                        <td className="p-3 text-sm text-right font-medium">{formatKRW(row.expectedIncome)}</td>
                        <td className="p-3 text-sm text-center text-muted-foreground">{row.expiryDate}</td>
                        <td className="p-3 text-center">
                          <span className={cn("inline-flex items-center gap-1 text-xs", priorityConfig[row.priority].color)}>
                            <PriorityIcon className="h-3.5 w-3.5" />
                            {row.priority}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={cn("text-xs", statusColors[row.status])} variant="secondary">
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">페이지당</span>
                <Select value={String(perPage)} disabled>
                  <SelectTrigger className="w-[70px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function LinkManagePage() {
  return (
    
      <LinkManagePageContent />
    
  );
}
