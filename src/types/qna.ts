export interface QnAItem {
  id: number;
  question: string;
  answer: string;
  category: "FAQ" | "일반";
}
