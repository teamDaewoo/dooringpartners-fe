import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductImageDisplay() {
  return (
    <div className="w-1/2 shrink-0">
      <div className="aspect-square bg-gradient-to-br from-info/30 to-info/10 rounded-lg flex items-center justify-center">
        <ImageIcon className="h-16 w-16 text-info/40" />
      </div>
      <Button variant="outline" className="w-full mt-3 text-sm">
        <ImageIcon className="h-4 w-4 mr-2" />
        이미지 더보기
      </Button>
    </div>
  );
}
