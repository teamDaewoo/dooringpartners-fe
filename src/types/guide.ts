export interface GuideItem {
  id: string;
  title: string;
  content: string;
}

export interface GuideSection {
  id: string;
  title: string;
  items: GuideItem[];
}
