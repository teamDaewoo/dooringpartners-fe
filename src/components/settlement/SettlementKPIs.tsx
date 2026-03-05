import { DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import KPICard from "@/components/common/KPICard";

interface SettlementKPIsData {
  totalSettlement: number;
  pendingSettlement: number;
  completedSettlement: number;
  expectedNextMonth: number;
}

interface SettlementKPIsProps {
  kpis: SettlementKPIsData | null;
  isLoading: boolean;
}

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

export function SettlementKPIs({ kpis, isLoading }: SettlementKPIsProps) {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-20 animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard title="총 정산 금액" value={formatKRW(kpis.totalSettlement)} icon={<DollarSign className="h-4 w-4" />} />
      <KPICard title="대기 중 정산" value={formatKRW(kpis.pendingSettlement)} icon={<Clock className="h-4 w-4" />} />
      <KPICard title="완료된 정산" value={formatKRW(kpis.completedSettlement)} icon={<CheckCircle className="h-4 w-4" />} />
      <KPICard title="다음달 예상" value={formatKRW(kpis.expectedNextMonth)} icon={<AlertCircle className="h-4 w-4" />} />
    </div>
  );
}
