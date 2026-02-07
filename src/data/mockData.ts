// Dashboard mock data
export const dashboardKPIs = {
  totalClicks: 12847,
  totalPurchases: 342,
  conversionRate: 2.66,
  commissionRevenue: 1_285_400,
};

export const chartData = [
  { name: "1월", clicks: 1200, purchases: 28, conversionRate: 2.3, revenue: 98000 },
  { name: "2월", clicks: 1800, purchases: 42, conversionRate: 2.3, revenue: 145000 },
  { name: "3월", clicks: 1400, purchases: 35, conversionRate: 2.5, revenue: 112000 },
  { name: "4월", clicks: 2200, purchases: 58, conversionRate: 2.6, revenue: 198000 },
  { name: "5월", clicks: 1600, purchases: 39, conversionRate: 2.4, revenue: 134000 },
  { name: "6월", clicks: 2800, purchases: 72, conversionRate: 2.6, revenue: 245000 },
  { name: "7월", clicks: 1847, purchases: 68, conversionRate: 3.7, revenue: 353400 },
];

export const recentSales = [
  { id: 1, name: "김지현", email: "jihyun.kim@email.com", amount: 45000, avatar: "JH" },
  { id: 2, name: "박서준", email: "seojun.park@email.com", amount: 32000, avatar: "SJ" },
  { id: 3, name: "이하은", email: "haeun.lee@email.com", amount: 78000, avatar: "HE" },
  { id: 4, name: "최민수", email: "minsu.choi@email.com", amount: 22000, avatar: "MS" },
  { id: 5, name: "정수빈", email: "subin.jung@email.com", amount: 56000, avatar: "SB" },
];

// Report page mock data
export const reportKPIs = {
  commissionPerUnit: 3_756,
  clicks: 8_421,
  purchases: 215,
  conversionRate: 2.55,
};

export const reportChartData = [
  { name: "1주차", conversionRate: 2.1, purchases: 12, clicks: 580 },
  { name: "2주차", conversionRate: 2.8, purchases: 18, clicks: 720 },
  { name: "3주차", conversionRate: 2.4, purchases: 15, clicks: 640 },
  { name: "4주차", conversionRate: 3.2, purchases: 22, clicks: 890 },
  { name: "5주차", conversionRate: 2.9, purchases: 19, clicks: 760 },
  { name: "6주차", conversionRate: 3.5, purchases: 25, clicks: 950 },
];

// Receipt (Settlement) page mock data
export const receiptKPIs = {
  totalSettlement: 4_285_000,
  pendingSettlement: 1_285_400,
  completedSettlement: 2_999_600,
  expectedNextMonth: 856_000,
};

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

export const settlementData: SettlementRow[] = [
  { id: 1, period: "2025.12", productName: "프리미엄 스킨케어 세트", sales: 45, commission: 285000, status: "완료", date: "2026-01-15" },
  { id: 2, period: "2025.12", productName: "무선 블루투스 이어폰", sales: 32, commission: 192000, status: "완료", date: "2026-01-15" },
  { id: 3, period: "2025.12", productName: "유기농 그래놀라 세트", sales: 28, commission: 112000, status: "완료", date: "2026-01-15" },
  { id: 4, period: "2026.01", productName: "프리미엄 스킨케어 세트", sales: 52, commission: 328000, status: "대기", date: "2026-02-15" },
  { id: 5, period: "2026.01", productName: "무선 블루투스 이어폰", sales: 38, commission: 228000, status: "대기", date: "2026-02-15" },
  { id: 6, period: "2026.01", productName: "홈트레이닝 매트", sales: 18, commission: 72000, status: "미지급", date: "2026-02-15" },
  { id: 7, period: "2026.01", productName: "유기농 그래놀라 세트", sales: 25, commission: 100000, status: "대기", date: "2026-02-15" },
  { id: 8, period: "2026.01", productName: "스마트 체중계", sales: 15, commission: 90000, status: "미지급", date: "2026-02-15" },
  { id: 9, period: "2025.11", productName: "프리미엄 스킨케어 세트", sales: 40, commission: 252000, status: "완료", date: "2025-12-15" },
  { id: 10, period: "2025.11", productName: "무선 블루투스 이어폰", sales: 29, commission: 174000, status: "완료", date: "2025-12-15" },
];

// Products mock data
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

export const categories = [
  "전체", "패션/의류", "뷰티/화장품", "식품/건강", "전자기기", "생활/주방",
  "스포츠/레저", "도서/문구", "반려동물", "유아/아동", "가구/인테리어",
  "자동차/바이크", "디지털콘텐츠", "여행/숙박", "금융/보험", "교육/강좌",
];

export const products: Product[] = [
  { id: 1, name: "프리미엄 스킨케어 세트", category: "뷰티/화장품", campaignStart: "2026-01-01", campaignEnd: "2026-03-31", commissionRate: 12, commissionAmount: 6330, price: 52750, description: "피부 고민별 맞춤 케어가 가능한 올인원 스킨케어 세트입니다." },
  { id: 2, name: "무선 블루투스 이어폰 Pro", category: "전자기기", campaignStart: "2026-01-15", campaignEnd: "2026-04-15", commissionRate: 8, commissionAmount: 6000, price: 75000, description: "노이즈캔슬링 기능이 탑재된 프리미엄 무선 이어폰입니다." },
  { id: 3, name: "유기농 그래놀라 선물세트", category: "식품/건강", campaignStart: "2026-02-01", campaignEnd: "2026-05-31", commissionRate: 10, commissionAmount: 4000, price: 40000, description: "건강한 아침을 위한 유기농 그래놀라 선물세트입니다." },
  { id: 4, name: "홈트레이닝 요가매트", category: "스포츠/레저", campaignStart: "2026-01-10", campaignEnd: "2026-06-30", commissionRate: 15, commissionAmount: 4500, price: 30000, description: "미끄럼 방지 프리미엄 요가매트입니다." },
  { id: 5, name: "스마트 체중계 X1", category: "전자기기", campaignStart: "2026-02-01", campaignEnd: "2026-04-30", commissionRate: 10, commissionAmount: 5900, price: 59000, description: "체성분 분석이 가능한 스마트 체중계입니다." },
  { id: 6, name: "아로마 디퓨저 세트", category: "생활/주방", campaignStart: "2026-01-20", campaignEnd: "2026-03-20", commissionRate: 12, commissionAmount: 4200, price: 35000, description: "천연 에센셜 오일이 포함된 디퓨저 세트입니다." },
  { id: 7, name: "반려동물 자동 급식기", category: "반려동물", campaignStart: "2026-02-10", campaignEnd: "2026-05-10", commissionRate: 9, commissionAmount: 8100, price: 90000, description: "스마트폰 앱으로 제어 가능한 자동 급식기입니다." },
  { id: 8, name: "키즈 학습 태블릿", category: "유아/아동", campaignStart: "2026-01-05", campaignEnd: "2026-07-05", commissionRate: 7, commissionAmount: 13930, price: 199000, description: "어린이 전용 학습 콘텐츠가 탑재된 태블릿입니다." },
  { id: 9, name: "프리미엄 원두 커피 세트", category: "식품/건강", campaignStart: "2026-03-01", campaignEnd: "2026-06-30", commissionRate: 11, commissionAmount: 3300, price: 30000, description: "엄선된 원두로 만든 스페셜티 커피 세트입니다." },
];

// Links management mock data
export type LinkPlatform = "네이버 블로그" | "유튜브" | "인스타그램" | "틱톡" | "기타";
export type LinkStatus = "활성" | "만료예정" | "만료";
export type LinkPriority = "높음" | "보통" | "낮음";

export interface LinkRow {
  id: number;
  issuedNumber: string;
  platform: LinkPlatform;
  url: string;
  title: string;
  expectedIncome: number;
  expiryDate: string;
  priority: LinkPriority;
  status: LinkStatus;
}

export const linksData: LinkRow[] = [
  { id: 1, issuedNumber: "LNK-001", platform: "네이버 블로그", url: "https://blog.naver.com/example1", title: "프리미엄 스킨케어 세트 리뷰", expectedIncome: 125000, expiryDate: "2026-03-31", priority: "높음", status: "활성" },
  { id: 2, issuedNumber: "LNK-002", platform: "유튜브", url: "https://youtube.com/watch?v=abc123", title: "무선 이어폰 언박싱 영상", expectedIncome: 89000, expiryDate: "2026-04-15", priority: "높음", status: "활성" },
  { id: 3, issuedNumber: "LNK-003", platform: "인스타그램", url: "https://instagram.com/p/xyz789", title: "그래놀라 세트 일상 포스팅", expectedIncome: 45000, expiryDate: "2026-02-28", priority: "보통", status: "만료예정" },
  { id: 4, issuedNumber: "LNK-004", platform: "틱톡", url: "https://tiktok.com/@user/video1", title: "요가매트 운동 숏폼", expectedIncome: 67000, expiryDate: "2026-06-30", priority: "낮음", status: "활성" },
  { id: 5, issuedNumber: "LNK-005", platform: "네이버 블로그", url: "https://blog.naver.com/example2", title: "스마트 체중계 후기", expectedIncome: 52000, expiryDate: "2026-04-30", priority: "보통", status: "활성" },
  { id: 6, issuedNumber: "LNK-006", platform: "유튜브", url: "https://youtube.com/watch?v=def456", title: "아로마 디퓨저 ASMR", expectedIncome: 38000, expiryDate: "2026-02-20", priority: "낮음", status: "만료예정" },
  { id: 7, issuedNumber: "LNK-007", platform: "인스타그램", url: "https://instagram.com/p/uvw321", title: "반려동물 급식기 리뷰", expectedIncome: 71000, expiryDate: "2026-05-10", priority: "높음", status: "활성" },
  { id: 8, issuedNumber: "LNK-008", platform: "기타", url: "https://example.com/review8", title: "키즈 태블릿 교육 리뷰", expectedIncome: 95000, expiryDate: "2026-01-31", priority: "보통", status: "만료" },
  { id: 9, issuedNumber: "LNK-009", platform: "네이버 블로그", url: "https://blog.naver.com/example3", title: "원두 커피 맛 비교", expectedIncome: 28000, expiryDate: "2026-06-30", priority: "낮음", status: "활성" },
  { id: 10, issuedNumber: "LNK-010", platform: "유튜브", url: "https://youtube.com/watch?v=ghi789", title: "홈트레이닝 루틴 브이로그", expectedIncome: 112000, expiryDate: "2026-03-15", priority: "높음", status: "활성" },
];

// Notice mock data
export interface Notice {
  id: number;
  title: string;
  date: string;
  category: "중요" | "공지사항" | "프로모션 및 이벤트" | "기타";
}

export const notices: Notice[] = [
  { id: 1, title: "[중요] 2026년 1월 정산 일정 안내", date: "2026-01-20", category: "중요" },
  { id: 2, title: "신규 파트너 가입 이벤트 안내", date: "2026-01-18", category: "프로모션 및 이벤트" },
  { id: 3, title: "커미션 정책 변경 안내 (2월 적용)", date: "2026-01-15", category: "공지사항" },
  { id: 4, title: "[중요] 시스템 점검 안내 (1/25 02:00-06:00)", date: "2026-01-14", category: "중요" },
  { id: 5, title: "설 연휴 고객지원 운영 안내", date: "2026-01-12", category: "공지사항" },
  { id: 6, title: "2025년 연간 실적 리포트 다운로드", date: "2026-01-10", category: "기타" },
  { id: 7, title: "신규 카테고리 추가 안내 (디지털콘텐츠)", date: "2026-01-08", category: "공지사항" },
  { id: 8, title: "겨울 시즌 프로모션 상품 안내", date: "2026-01-05", category: "프로모션 및 이벤트" },
  { id: 9, title: "링크 발급 절차 변경 안내", date: "2025-12-28", category: "공지사항" },
  { id: 10, title: "2025년 우수 파트너 선정 안내", date: "2025-12-20", category: "기타" },
];

// QnA mock data
export interface QnAItem {
  id: number;
  question: string;
  answer: string;
  category: "FAQ" | "일반";
}

export const qnaItems: QnAItem[] = [
  { id: 1, question: "커미션은 어떻게 계산되나요?", answer: "커미션은 상품별로 설정된 커미션율에 따라 실제 판매 금액 기준으로 계산됩니다. 상품 상세 페이지에서 각 상품의 커미션율을 확인하실 수 있습니다.", category: "FAQ" },
  { id: 2, question: "정산은 언제 이루어지나요?", answer: "정산은 매월 15일에 전월 실적을 기준으로 진행됩니다. 정산 금액은 정산 관리 페이지에서 확인하실 수 있습니다.", category: "FAQ" },
  { id: 3, question: "링크 발급 후 수정이 가능한가요?", answer: "발급된 링크의 URL은 변경할 수 없으나, 링크에 연결된 콘텐츠 제목과 플랫폼 정보는 수정이 가능합니다.", category: "FAQ" },
  { id: 4, question: "여러 플랫폼에서 동시에 활동할 수 있나요?", answer: "네, 하나의 상품에 대해 여러 플랫폼용 링크를 각각 발급받아 사용하실 수 있습니다. 각 링크별로 실적이 별도로 추적됩니다.", category: "FAQ" },
  { id: 5, question: "링크 만료 후에도 커미션을 받을 수 있나요?", answer: "링크가 만료된 이후에는 새로운 클릭 및 구매에 대한 커미션이 발생하지 않습니다. 만료 전 구매 건에 대해서는 정상적으로 커미션이 지급됩니다.", category: "FAQ" },
  { id: 6, question: "계좌 정보를 변경하고 싶어요.", answer: "마이페이지 > 정산 정보에서 계좌 정보를 변경하실 수 있습니다. 변경 후 다음 정산부터 새 계좌로 입금됩니다.", category: "일반" },
  { id: 7, question: "탈퇴 후 재가입이 가능한가요?", answer: "탈퇴 후 30일이 경과하면 동일한 이메일로 재가입이 가능합니다. 단, 이전 실적 데이터는 복구되지 않습니다.", category: "일반" },
  { id: 8, question: "프로모션 상품의 커미션율은 어떻게 다른가요?", answer: "프로모션 기간에는 일반 커미션율보다 높은 특별 커미션율이 적용됩니다. 프로모션 상세 내용은 공지사항에서 확인하실 수 있습니다.", category: "FAQ" },
];

// Guide data
export interface GuideSection {
  id: string;
  title: string;
  items: { id: string; title: string; content: string }[];
}

export const guideSections: GuideSection[] = [
  {
    id: "profile",
    title: "프로필 완성하기",
    items: [
      { id: "profile-1", title: "기본 정보 입력", content: "토탈 파트너스에 가입한 후 가장 먼저 프로필을 완성해주세요. 마이페이지에서 이름, 연락처, 활동 플랫폼 등 기본 정보를 입력하면 맞춤형 상품 추천을 받을 수 있습니다." },
      { id: "profile-2", title: "정산 정보 설정", content: "커미션 수입을 받기 위해 정산 계좌 정보를 등록해주세요. 은행명, 계좌번호, 예금주명을 정확히 입력해야 정산이 원활하게 진행됩니다." },
    ],
  },
  {
    id: "links",
    title: "링크 생성하기",
    items: [
      { id: "links-1", title: "상품 선택 및 링크 발급", content: "상품 둘러보기에서 홍보하고 싶은 상품을 찾아 '링크 발급하기' 버튼을 클릭하세요. 발급된 링크를 통해 발생하는 모든 구매에 대해 커미션을 받을 수 있습니다." },
      { id: "links-2", title: "링크 관리", content: "내 링크 > 컨텐츠 관리에서 발급된 모든 링크를 확인하고 관리할 수 있습니다. 만료일, 예상 수입, 우선순위 등을 한눈에 확인하세요." },
    ],
  },
  {
    id: "content",
    title: "콘텐츠 만들기",
    items: [
      { id: "content-1", title: "효과적인 콘텐츠 전략", content: "높은 전환율을 위해 솔직한 사용 후기와 상세한 제품 비교를 포함한 콘텐츠를 제작하세요. 실제 사용 경험을 바탕으로 한 리뷰가 가장 높은 전환율을 보입니다." },
      { id: "content-2", title: "플랫폼별 최적화", content: "각 플랫폼의 특성에 맞게 콘텐츠를 최적화하세요. 블로그는 상세 리뷰, 유튜브는 언박싱/비교 영상, 인스타그램은 비주얼 중심의 포스팅이 효과적입니다." },
    ],
  },
  {
    id: "revenue",
    title: "수익 창출하기",
    items: [
      { id: "revenue-1", title: "실적 분석", content: "홈 대시보드와 실적 리포트에서 클릭수, 구매수, 전환율, 커미션 수입을 확인하세요. 데이터를 분석하여 가장 효과적인 상품과 콘텐츠 전략을 파악할 수 있습니다." },
      { id: "revenue-2", title: "수입 최적화", content: "커미션율이 높은 상품을 우선적으로 홍보하고, 시즌별 프로모션 상품을 적극 활용하세요. 정기적인 콘텐츠 업로드가 안정적인 수입 확보의 핵심입니다." },
    ],
  },
  {
    id: "teams",
    title: "팀 활용하기",
    items: [
      { id: "teams-1", title: "팀 구성", content: "팀 기능을 활용하면 여러 크리에이터가 함께 협업하여 더 큰 성과를 낼 수 있습니다. 팀원 초대 기능을 통해 손쉽게 팀을 구성하세요." },
      { id: "teams-2", title: "팀 실적 관리", content: "팀 대시보드에서 팀 전체의 실적을 확인하고, 개별 팀원의 기여도를 분석할 수 있습니다. 팀 목표를 설정하고 함께 달성해보세요." },
    ],
  },
];
