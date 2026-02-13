import { Image as ImageIcon } from "lucide-react";
import type { GuideItem } from "@/types/guide";

interface GuideContentProps {
  item: GuideItem | undefined;
}

export function GuideContent({ item }: GuideContentProps) {
  if (!item) return null;

  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-lg font-bold text-foreground mb-4">{item.title}</h2>
      <div className="aspect-[16/9] bg-gradient-to-br from-info/20 to-info/5 rounded-lg flex items-center justify-center mb-6">
        <ImageIcon className="h-12 w-12 text-info/30" />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
    </div>
  );
}
