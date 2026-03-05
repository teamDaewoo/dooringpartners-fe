export interface DashboardKPIs {
  totalClicks: number;
  totalPurchases: number;
  conversionRate: number;
  commissionRevenue: number;
}

export interface ReportKPIs {
  commissionPerUnit: number;
  clicks: number;
  purchases: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  name: string;
  clicks?: number;
  purchases?: number;
  conversionRate?: number;
  revenue?: number;
}

export interface RecentSale {
  id: number;
  name: string;
  email: string;
  amount: number;
  avatar: string;
}
