import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LinkRow } from "@/types/link";
import { LinkTableRow } from "./LinkTableRow";

interface LinkTableProps {
  links: LinkRow[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function LinkTable({
  links,
  isLoading,
  currentPage,
  totalPages,
  perPage,
  onPageChange
}: LinkTableProps) {
  return (
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
                links.map((row) => <LinkTableRow key={row.id} row={row} />)
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
        </div>
      </CardContent>
    </Card>
  );
}
