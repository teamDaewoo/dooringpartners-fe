import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartDataItem {
  name: string;
  conversionRate?: number;
  purchases?: number;
  clicks?: number;
}

interface DashboardChartProps {
  chartData: ChartDataItem[];
  isLoading: boolean;
}

export function DashboardChart({ chartData, isLoading }: DashboardChartProps) {
  const LoadingState = () => (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
      로딩 중...
    </div>
  );

  return (
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
            {isLoading ? (
              <LoadingState />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value: number) => [`${value}%`, "전환율"]} />
                  <Bar dataKey="conversionRate" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          <TabsContent value="purchases">
            {isLoading ? (
              <LoadingState />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => [`${value}건`, "구매"]} />
                  <Bar dataKey="purchases" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          <TabsContent value="clicks">
            {isLoading ? (
              <LoadingState />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => [`${value}회`, "클릭"]} />
                  <Bar dataKey="clicks" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
