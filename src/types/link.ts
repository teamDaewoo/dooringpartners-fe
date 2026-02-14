export type LinkPlatform =
  | "네이버 블로그"
  | "유튜브"
  | "인스타그램"
  | "틱톡"
  | "기타";

export type LinkPriority = "높음" | "보통" | "낮음";

export type LinkStatus = "활성" | "만료예정" | "만료";

export interface LinkRow {
  id: number;
  issuedNumber: string;
  platform: LinkPlatform;
  title: string;
  url: string;
  expectedIncome: number;
  expiryDate: string;
  priority: LinkPriority;
  status: LinkStatus;
}
