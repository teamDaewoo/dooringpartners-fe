

# 토탈 파트너스 (Total Partners) — Build Plan

A Korean-language affiliate link management platform for content creators to browse products, manage links, track performance, and handle settlements. All pages use mock data (no backend needed).

---

## Phase 1: Foundation — Layout & Navigation

### Global TopBar
- Persistent 45px top bar with "토탈 파트너스" branding on the left
- Center navigation: 홈, 상품 둘러보기, 내 링크 (dropdown), 고객지원 (dropdown)
- Dropdowns for "내 링크" → 컨텐츠 관리, and "고객지원" → 공지사항, Q&A, 사용가이드
- Right side: 마이페이지 user link
- Active route highlighting with green underline
- Design system setup: custom color tokens (black primary, green accent #10B981), Pretendard font, Korean typography scale

### Routing Setup
- 9 routes: Home `/`, Products `/products`, Product Detail `/product/:id`, Links `/links`, Report `/report`, Receipt `/receipt`, Notice `/notice`, QnA `/qna`, Guide `/guide`

---

## Phase 2: Dashboard & Analytics Pages

### HomePage (Dashboard) — `/`
- "실적 리포트" page title with date range picker
- 4 KPI cards: Total Clicks, Total Purchases, Conversion Rate, Commission Revenue
- Bar chart with tabs (Click Revenue, Conversion Rate, Purchases) using Recharts
- Recent Sales section with 5 user entries showing avatars, names, emails, and amounts

### ReportPage (Performance Report Detail) — `/report`
- Page header with description and search bar for registered products
- Quick date filter chips
- 4 KPI cards (Commission Per Unit, Clicks, Purchases, Conversion Rate)
- Bar chart with tabs (Conversion Rate, Purchases, Clicks)

### ReceiptPage (Settlement Management) — `/receipt`
- Month selector with arrow navigation
- 4 KPI cards for settlement amounts
- Info notice box
- Action buttons (Issue Statement, Send Confirmation Email)
- Settlement table with status badges (Pending/Unpaid/Completed), checkboxes, and pagination

---

## Phase 3: Product Discovery

### ProductSearchPage (Browse Products) — `/products`
- Page title and search bar with search button
- Two-column layout: left sidebar with radio button category filter (16 categories), right side product grid
- Result count header with toggle for "Include products with issued links"
- 3-column product card grid showing image placeholder, campaign period, product name, commission info
- Pagination with Previous/Next and page numbers

### Product Detail Page — `/product/:id`
- Two-column layout: left column with product image (blue gradient placeholder) and "View more images" button
- Right column (sticky): product title, description, price, campaign period with commission info (highlighted yellow box), previous commission history list, additional notes with blue left-border quote box, and "링크 발급하기" (Issue Link) CTA button

---

## Phase 4: Content & Link Management

### LinkManagePage — `/links`
- Page header section with gray background
- Search/filter dropdowns and action buttons (Expected Income, Until Expiry, Status)
- Data table with 10 rows showing: issued number, platform badge (color-coded), URL/title, expected income, expiry/priority indicators
- Priority indicators: High (red ↑), Medium (gray →), Low (green ↓)
- Pagination with rows per page selector

---

## Phase 5: Customer Support Pages

### NoticePage — `/notice`
- Search bar and filter tabs (전체, 중요, 공지사항, 최신순, 프로모션 및 이벤트, 기타)
- Notice table with ID, title, and date columns
- Clickable rows with hover effects
- Pagination

### QnAPage — `/qna`
- Search bar for FAQ
- Filter tabs (1:1 Chat, FAQ, Inquiry History)
- Accordion list with Q badge icons, expandable answers
- Pagination

### UsingGuidePage — `/guide`
- Two-column layout: left sticky sidebar with 5 collapsible navigation sections (Complete Profile, Create Links, Create Content, Generate Revenue, Use Two Teams)
- Right content area that changes based on sidebar selection
- Content includes titles, feature images (blue gradient placeholders), and description text

---

## Interactions & Polish

- Hover states on all interactive elements (table rows, cards, buttons, nav items)
- Skeleton loading states for data tables and card grids
- Toast notifications for actions like "Issue Link"
- Smooth chart animations on load and tab switching
- Debounced search inputs
- Working pagination across all tables
- Dropdown menus with shadow and rounded corners
- All text in Korean (한국어), currency in Korean Won (₩)

