export interface Product {
  id: number;
  name: string;
  category: string;
  campaignStart: string;
  campaignEnd: string;
  commissionRate: number;
  commissionAmount: number;
  price: number;
  description: string;
}

export type ProductCategory =
  | "전체"
  | "패션/의류"
  | "뷰티/화장품"
  | "식품/건강"
  | "전자기기"
  | "생활/주방"
  | "스포츠/레저"
  | "도서/문구"
  | "반려동물"
  | "유아/아동"
  | "가구/인테리어"
  | "자동차/바이크"
  | "디지털콘텐츠"
  | "여행/숙박"
  | "금융/보험"
  | "교육/강좌";
