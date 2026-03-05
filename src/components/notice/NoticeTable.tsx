import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Notice } from "@/types/notice";

interface NoticeTableProps {
  notices: Notice[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function NoticeTable({ notices, isLoading, currentPage, totalPages, onPageChange }: NoticeTableProps) {
  return (
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
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-sm text-muted-foreground">
                  로딩 중...
                </td>
              </tr>
            ) : notices.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-sm text-muted-foreground">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              notices.map((notice) => (
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
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 p-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              이전
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 text-xs"
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              다음
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
