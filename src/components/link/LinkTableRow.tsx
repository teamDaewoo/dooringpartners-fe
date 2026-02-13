import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LinkRow, LinkPlatform, LinkPriority, LinkStatus } from "@/types/link";

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

const platformColors: Record<LinkPlatform, string> = {
  "네이버 블로그": "bg-success/15 text-success border-success/30",
  "유튜브": "bg-destructive/15 text-destructive border-destructive/30",
  "인스타그램": "bg-info/15 text-info border-info/30",
  "틱톡": "bg-foreground/10 text-foreground border-foreground/20",
  "기타": "bg-muted text-muted-foreground border-border",
};

const priorityConfig: Record<LinkPriority, { icon: typeof ArrowUp; color: string; label: string }> = {
  "높음": { icon: ArrowUp, color: "text-destructive", label: "높음" },
  "보통": { icon: ArrowRight, color: "text-muted-foreground", label: "보통" },
  "낮음": { icon: ArrowDown, color: "text-success", label: "낮음" },
};

const statusColors: Record<LinkStatus, string> = {
  "활성": "bg-success/15 text-success",
  "만료예정": "bg-warning/15 text-warning-foreground",
  "만료": "bg-muted text-muted-foreground",
};

interface LinkTableRowProps {
  row: LinkRow;
}

export function LinkTableRow({ row }: LinkTableRowProps) {
  const PriorityIcon = priorityConfig[row.priority].icon;

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="p-3 text-sm font-mono text-muted-foreground">{row.issuedNumber}</td>
      <td className="p-3">
        <Badge variant="outline" className={cn("text-xs", platformColors[row.platform])}>
          {row.platform}
        </Badge>
      </td>
      <td className="p-3">
        <p className="text-sm font-medium">{row.title}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[250px]">{row.url}</p>
      </td>
      <td className="p-3 text-sm text-right font-medium">{formatKRW(row.expectedIncome)}</td>
      <td className="p-3 text-sm text-center text-muted-foreground">{row.expiryDate}</td>
      <td className="p-3 text-center">
        <span className={cn("inline-flex items-center gap-1 text-xs", priorityConfig[row.priority].color)}>
          <PriorityIcon className="h-3.5 w-3.5" />
          {row.priority}
        </span>
      </td>
      <td className="p-3 text-center">
        <Badge className={cn("text-xs", statusColors[row.status])} variant="secondary">
          {row.status}
        </Badge>
      </td>
    </tr>
  );
}
