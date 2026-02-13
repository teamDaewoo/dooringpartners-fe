export type QnACategory = "FAQ" | "일반";

export interface QnAItem {
  id: number;
  question: string;
  answer: string;
  category: QnACategory;
}
