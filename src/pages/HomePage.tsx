import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, MousePointerClick, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import KPICard from "@/components/KPICard";
import Layout from "@/components/Layout";
import { dashboardKPIs, chartData, recentSales } from "@/data/mockData";

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

export default function HomePage() {
  const [dateFrom, setDateFrom] = useState<Date>(new Date(2026, 0, 1));
  const [dateTo, setDateTo] = useState<Date>(new Date(2026, 6, 31));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">실적 리포트</h1>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                  {format(dateFrom, "yyyy.MM.dd")} - {format(dateTo, "yyyy.MM.dd")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{ from: dateFrom, to: dateTo }}
                  onSelect={(range) => {
                    if (range?.from) setDateFrom(range.from);
                    if (range?.to) setDateTo(range.to);
                  }}
                  locale={ko}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="총 클릭수"
            value={dashboardKPIs.totalClicks.toLocaleString()}
            change="지난달 대비 +12.5%"
            changeType="positive"
            icon={<MousePointerClick className="h-4 w-4" />}
          />
          <KPICard
            title="총 구매수"
            value={dashboardKPIs.totalPurchases.toLocaleString()}
            change="지난달 대비 +8.2%"
            changeType="positive"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <KPICard
            title="전환율"
            value={`${dashboardKPIs.conversionRate}%`}
            change="지난달 대비 +0.3%"
            changeType="positive"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KPICard
            title="커미션 수입"
            value={formatKRW(dashboardKPIs.commissionRevenue)}
            change="지난달 대비 +15.1%"
            changeType="positive"
            icon={<DollarSign className="h-4 w-4" />}
          />
        </div>

        {/* Chart + Recent Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* Chart */}
          <Card className="lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">실적 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue">
                <TabsList className="mb-4">
                  <TabsTrigger value="revenue" className="text-xs">클릭 수입</TabsTrigger>
                  <TabsTrigger value="conversion" className="text-xs">전환율</TabsTrigger>
                  <TabsTrigger value="purchases" className="text-xs">구매수</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₩${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [formatKRW(value), "수입"]} />
                      <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="conversion">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(value: number) => [`${value}%`, "전환율"]} />
                      <Bar dataKey="conversionRate" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="purchases">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value: number) => [`${value}건`, "구매"]} />
                      <Bar dataKey="purchases" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">최근 판매</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-muted text-xs font-medium">
                        {sale.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none">{sale.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {sale.email}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      +{formatKRW(sale.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
