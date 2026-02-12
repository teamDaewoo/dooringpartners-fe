'use client';

import { useState } from "react";
import { ChevronLeft, ChevronRight, Info, FileText, Mail, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import KPICard from "@/components/KPICard";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { receiptKPIs, settlementData, type SettlementStatus } from "@/data/mockData";

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

const statusConfig: Record<SettlementStatus, { variant: "default" | "secondary" | "destructive"; className: string }> = {
  "완료": { variant: "default", className: "bg-success text-success-foreground" },
  "대기": { variant: "secondary", className: "bg-warning text-warning-foreground" },
  "미지급": { variant: "destructive", className: "" },
};

function ReceiptPageContent() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0));
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const monthStr = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const totalPages = Math.ceil(settlementData.length / rowsPerPage);
  const paginatedData = settlementData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((r) => r.id));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Month selector */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground min-w-[140px] text-center">{monthStr}</h1>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard title="총 정산 금액" value={formatKRW(receiptKPIs.totalSettlement)} icon={<DollarSign className="h-4 w-4" />} />
          <KPICard title="대기 중 정산" value={formatKRW(receiptKPIs.pendingSettlement)} icon={<Clock className="h-4 w-4" />} />
          <KPICard title="완료된 정산" value={formatKRW(receiptKPIs.completedSettlement)} icon={<CheckCircle className="h-4 w-4" />} />
          <KPICard title="다음달 예상" value={formatKRW(receiptKPIs.expectedNextMonth)} icon={<AlertCircle className="h-4 w-4" />} />
        </div>

        {/* Info box */}
        <div className="flex items-start gap-3 p-4 bg-info/10 rounded-lg border border-info/20 mb-6">
          <Info className="h-5 w-5 text-info mt-0.5 shrink-0" />
          <p className="text-sm text-foreground">
            정산은 매월 15일에 전월 실적 기준으로 진행됩니다. 정산 내역에 이상이 있을 경우 고객지원으로 문의해주세요.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" className="text-xs">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            명세서 발급
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            확인 이메일 전송
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 w-10">
                      <Checkbox checked={selectedRows.length === paginatedData.length && paginatedData.length > 0} onCheckedChange={toggleAll} />
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
                  {paginatedData.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <Checkbox checked={selectedRows.includes(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                      </td>
                      <td className="p-3 text-sm">{row.period}</td>
                      <td className="p-3 text-sm font-medium">{row.productName}</td>
                      <td className="p-3 text-sm text-right">{row.sales}건</td>
                      <td className="p-3 text-sm text-right font-medium">{formatKRW(row.commission)}</td>
                      <td className="p-3 text-center">
                        <Badge className={cn("text-xs", statusConfig[row.status].className)} variant={statusConfig[row.status].variant}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                총 {settlementData.length}건 중 {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, settlementData.length)}건
              </p>
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
    </Layout>
  );
}

export default function ReceiptPage() {
  return (
    <ProtectedRoute>
      <ReceiptPageContent />
    </ProtectedRoute>
  );
}
