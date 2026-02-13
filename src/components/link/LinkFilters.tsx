import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LinkFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function LinkFilters({ searchQuery, onSearchChange }: LinkFiltersProps) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="링크 또는 제목 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>
      <Select>
        <SelectTrigger className="w-[140px] text-xs">
          <SelectValue placeholder="예상 수입" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">높은 순</SelectItem>
          <SelectItem value="low">낮은 순</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[140px] text-xs">
          <SelectValue placeholder="만료일" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="soon">임박순</SelectItem>
          <SelectItem value="far">여유순</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[120px] text-xs">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">활성</SelectItem>
          <SelectItem value="expiring">만료예정</SelectItem>
          <SelectItem value="expired">만료</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
