import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ProductSearchHeader({ searchQuery, onSearchChange }: ProductSearchHeaderProps) {
  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="상품명을 검색하세요..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>
      <Button size="sm">검색</Button>
    </div>
  );
}
