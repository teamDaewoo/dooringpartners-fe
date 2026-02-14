import { MousePointerClick, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import KPICard from "@/components/common/KPICard";

interface DashboardKPIsProps {
  kpis: {
    commissionPerUnit: number;
    clicks: number;
    purchases: number;
    conversionRate: number;
  };
}

export function DashboardKPIs({ kpis }: DashboardKPIsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="건당 커미션"
        value={`₩${kpis.commissionPerUnit.toLocaleString()}`}
        change="평균 기준"
        changeType="neutral"
        icon={<DollarSign className="h-4 w-4" />}
      />
      <KPICard
        title="클릭수"
        value={kpis.clicks.toLocaleString()}
        change="지난 기간 대비 +5.2%"
        changeType="positive"
        icon={<MousePointerClick className="h-4 w-4" />}
      />
      <KPICard
        title="구매수"
        value={kpis.purchases.toLocaleString()}
        change="지난 기간 대비 +3.8%"
        changeType="positive"
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      <KPICard
        title="전환율"
        value={`${kpis.conversionRate}%`}
        change="지난 기간 대비 -0.1%"
        changeType="negative"
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </div>
  );
}
