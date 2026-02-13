export type SettlementStatus = "완료" | "대기" | "미지급";

export interface SettlementRow {
  id: number;
  period: string;
  productName: string;
  sales: number;
  commission: number;
  status: SettlementStatus;
  date: string;
}

export interface ReceiptKPIs {
  totalSettlement: number;
  pendingSettlement: number;
  completedSettlement: number;
  expectedNextMonth: number;
}
