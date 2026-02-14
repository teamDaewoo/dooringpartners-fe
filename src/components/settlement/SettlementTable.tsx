import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { SettlementRow, SettlementStatus } from "@/types/settlement";

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

const statusConfig: Record<SettlementStatus, { variant: "default" | "secondary" | "destructive"; className: string }> = {
  "완료": { variant: "default", className: "bg-success text-success-foreground" },
  "대기": { variant: "secondary", className: "bg-warning text-warning-foreground" },
  "미지급": { variant: "destructive", className: "" },
};

interface SettlementTableProps {
  settlements: SettlementRow[];
  isLoading: boolean;
  selectedRows: number[];
  currentPage: number;
  totalPages: number;
  total: number;
  onToggleRow: (id: number) => void;
  onToggleAll: () => void;
  onPageChange: (page: number) => void;
}

export function SettlementTable({
  settlements,
  isLoading,
  selectedRows,
  currentPage,
  totalPages,
  total,
  onToggleRow,
  onToggleAll,
  onPageChange
}: SettlementTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 w-10">
                  <Checkbox
                    checked={selectedRows.length === settlements.length && settlements.length > 0}
                    onCheckedChange={onToggleAll}
                  />
                </th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground">기간</th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground">상품명</th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground">판매수</th>
                <th className="p-3 text-right text-xs font-medium text-muted-foreground">커미션</th>
                <th className="p-3 text-center text-xs font-medium text-muted-foreground">상태</th>
                <th className="p-3 text-left text-xs font-medium text-muted-foreground">정산일</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                    로딩 중...
                  </td>
                </tr>
              ) : settlements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                    정산 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                settlements.map((row) => (
                  <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Checkbox checked={selectedRows.includes(row.id)} onCheckedChange={() => onToggleRow(row.id)} />
                    </td>
                    <td className="p-3 text-sm">{row.period}</td>
                    <td className="p-3 text-sm font-medium">{row.productName}</td>
                    <td className="p-3 text-sm text-right">{row.sales}건</td>
                    <td className="p-3 text-sm text-right font-medium">{formatKRW(row.commission)}</td>
                    <td className="p-3 text-center">
                      <Badge
                        className={cn("text-xs", statusConfig[row.status].className)}
                        variant={statusConfig[row.status].variant}
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">총 {total}건</p>
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
