import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

export default function KPICard({ title, value, change, changeType = "neutral", icon }: KPICardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {change && (
          <p
            className={cn(
              "text-xs mt-1",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
