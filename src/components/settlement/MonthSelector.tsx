import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSelectorProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthSelector({ currentMonth, onPrevMonth, onNextMonth }: MonthSelectorProps) {
  const monthStr = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

  return (
    <div className="flex items-center gap-3 mb-6">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={onPrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-bold text-foreground min-w-[140px] text-center">{monthStr}</h1>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
