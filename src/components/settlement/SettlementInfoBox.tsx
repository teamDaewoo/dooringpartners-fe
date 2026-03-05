import { Info } from "lucide-react";

export function SettlementInfoBox() {
  return (
    <div className="flex items-start gap-3 p-4 bg-info/10 rounded-lg border border-info/20 mb-6">
      <Info className="h-5 w-5 text-info mt-0.5 shrink-0" />
      <p className="text-sm text-foreground">
        정산은 매월 15일에 전월 실적 기준으로 진행됩니다. 정산 내역에 이상이 있을 경우 고객지원으로 문의해주세요.
      </p>
    </div>
  );
}
