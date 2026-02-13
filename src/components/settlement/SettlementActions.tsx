import { FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettlementActions() {
  return (
    <div className="flex gap-2 mb-4">
      <Button size="sm" variant="outline" className="text-xs">
        <FileText className="h-3.5 w-3.5 mr-1.5" />
        명세서 발급
      </Button>
      <Button size="sm" variant="outline" className="text-xs">
        <Mail className="h-3.5 w-3.5 mr-1.5" />
        확인 이메일 전송
      </Button>
    </div>
  );
}
