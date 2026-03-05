import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NoticeSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function NoticeSearch({ searchQuery, onSearchChange }: NoticeSearchProps) {
  return (
    <div className="relative max-w-md mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="공지사항 검색..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 text-sm"
      />
    </div>
  );
}
