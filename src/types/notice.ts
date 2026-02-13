export type NoticeCategory =
  | "중요"
  | "공지사항"
  | "프로모션 및 이벤트"
  | "기타";

export interface Notice {
  id: number;
  title: string;
  date: string;
  category: NoticeCategory;
}
