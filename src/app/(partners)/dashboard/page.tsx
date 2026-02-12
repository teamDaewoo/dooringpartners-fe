'use client';

import { useState } from "react";
import { Search, MousePointerClick, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KPICard from "@/components/common/KPICard";
import { reportKPIs, reportChartData } from "@/data/mockData";

const dateChips = ["오늘", "7일", "30일", "3개월", "6개월", "1년"];

export default function DashboardPage() {
  const [selectedChip, setSelectedChip] = useState("30일");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-1">
            <h1 className="text-xl font-bold text-foreground">실적 리포트</h1>
            <p className="text-sm text-muted-foreground mt-1">
              등록한 상품별 실적을 확인하고 분석하세요.
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-2 my-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="등록된 상품 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
            <Button size="sm" variant="outline">
              검색
            </Button>
          </div>

          {/* Date chips */}
          <div className="flex gap-2 mb-6">
            {dateChips.map((chip) => (
              <Button
                key={chip}
                size="sm"
                variant={selectedChip === chip ? "default" : "outline"}
                onClick={() => setSelectedChip(chip)}
                className="text-xs h-8"
              >
                {chip}
              </Button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="건당 커미션"
              value={`₩${reportKPIs.commissionPerUnit.toLocaleString()}`}
              change="평균 기준"
              changeType="neutral"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <KPICard
              title="클릭수"
              value={reportKPIs.clicks.toLocaleString()}
              change="지난 기간 대비 +5.2%"
              changeType="positive"
              icon={<MousePointerClick className="h-4 w-4" />}
            />
            <KPICard
              title="구매수"
              value={reportKPIs.purchases.toLocaleString()}
              change="지난 기간 대비 +3.8%"
              changeType="positive"
              icon={<ShoppingCart className="h-4 w-4" />}
            />
            <KPICard
              title="전환율"
              value={`${reportKPIs.conversionRate}%`}
              change="지난 기간 대비 -0.1%"
              changeType="negative"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">기간별 실적</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="conversion">
                <TabsList className="mb-4">
                  <TabsTrigger value="conversion" className="text-xs">전환율</TabsTrigger>
                  <TabsTrigger value="purchases" className="text-xs">구매수</TabsTrigger>
                  <TabsTrigger value="clicks" className="text-xs">클릭수</TabsTrigger>
                </TabsList>
                <TabsContent value="conversion">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(value: number) => [`${value}%`, "전환율"]} />
                      <Bar dataKey="conversionRate" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="purchases">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value: number) => [`${value}건`, "구매"]} />
                      <Bar dataKey="purchases" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="clicks">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value: number) => [`${value}회`, "클릭"]} />
                      <Bar dataKey="clicks" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
    </div>
  );
}
