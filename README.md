# Dooring Partners Frontend

두링파트너스 프론트엔드 애플리케이션

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Query, React Context
- **Charts**: Recharts
- **Icons**: Lucide React

## 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### Lint 검사

```bash
npm run lint
```

## 프로젝트 구조

```
├── src/
│   ├── app/              # Next.js App Router 페이지
│   │   ├── layout.tsx    # Root Layout
│   │   ├── page.tsx      # 메인 페이지 (/)
│   │   ├── login/        # 로그인 페이지
│   │   ├── report/       # 실적 리포트
│   │   ├── products/     # 상품 검색
│   │   ├── product/[id]/ # 상품 상세
│   │   ├── links/        # 링크 관리
│   │   ├── receipt/      # 정산 관리
│   │   ├── notice/       # 공지사항
│   │   ├── qna/          # 문의하기
│   │   └── guide/        # 이용 가이드
│   ├── components/       # React 컴포넌트
│   │   ├── ui/           # shadcn/ui 컴포넌트
│   │   ├── Layout.tsx    # 레이아웃 컴포넌트
│   │   ├── TopBar.tsx    # 상단 네비게이션
│   │   └── ...
│   ├── contexts/         # React Context
│   │   └── AuthContext.tsx
│   ├── hooks/            # Custom Hooks
│   ├── lib/              # 유틸리티 함수
│   └── data/             # Mock 데이터
├── public/               # 정적 파일
├── next.config.ts        # Next.js 설정
├── tailwind.config.ts    # Tailwind CSS 설정
└── tsconfig.json         # TypeScript 설정
```

## 주요 기능

- **인증 시스템**: Mock 인증 (LocalStorage 기반)
- **실적 리포트**: 차트 및 KPI 대시보드
- **상품 관리**: 상품 검색 및 상세 보기
- **링크 관리**: 컨텐츠 링크 관리
- **정산 관리**: 파트너 정산 내역 관리
- **고객 지원**: 공지사항, Q&A, 사용 가이드

## 라우팅

이 프로젝트는 Next.js App Router를 사용하여 완전한 CSR(Client-Side Rendering) 방식으로 구현되었습니다.

- 모든 페이지는 `'use client'` 지시어를 사용하여 클라이언트 컴포넌트로 구성됩니다.
- ProtectedRoute를 통한 인증 보호 기능 제공

## 환경 변수

현재 환경 변수가 설정되어 있지 않습니다. 필요한 경우 `.env.local` 파일을 생성하여 사용하세요.

```bash
# .env.local 예시
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 마이그레이션 히스토리

이 프로젝트는 Vite + React에서 Next.js 15로 마이그레이션되었습니다.

- **이전**: Vite + React Router
- **이후**: Next.js 15 (App Router) + CSR
- **마이그레이션 날짜**: 2026-02-12

자세한 마이그레이션 과정은 `MIGRATION_PLAN.md`를 참고하세요.

## 라이센스

Private
