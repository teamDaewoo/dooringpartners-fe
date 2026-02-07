import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { notices, type Notice } from "@/data/mockData";

const filterTabs = ["전체", "중요", "공지사항", "최신순", "프로모션 및 이벤트", "기타"];

export default function NoticePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 7;

  const filtered = notices.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === "전체" || activeTab === "최신순" || n.category === activeTab;
    return matchSearch && matchTab;
  });

  const sorted = activeTab === "최신순" ? [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : filtered;
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">공지사항</h1>

        {/* Search */}
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="공지사항 검색..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 text-sm"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {filterTabs.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className="text-xs h-8"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground w-16">번호</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground">제목</th>
                  <th className="p-3 text-right text-xs font-medium text-muted-foreground w-28">날짜</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((notice) => (
                  <tr key={notice.id} className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="p-3 text-sm text-muted-foreground">{notice.id}</td>
                    <td className="p-3 text-sm font-medium">
                      {notice.category === "중요" && (
                        <Badge variant="destructive" className="text-[10px] mr-2 py-0">중요</Badge>
                      )}
                      {notice.title}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground text-right">{notice.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginated.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">검색 결과가 없습니다.</div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 p-4 border-t border-border">
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>이전</Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button key={i + 1} variant={currentPage === i + 1 ? "default" : "outline"} size="sm" className="h-8 w-8 text-xs" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>다음</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
