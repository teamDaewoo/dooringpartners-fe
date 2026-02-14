# Vite → Next.js 마이그레이션 계획서

## 📋 현재 상태 진단

### 프로젝트 개요
- **번들러**: Vite 5.4.19
- **프레임워크**: React 18.3.1 (CSR)
- **라우팅**: React Router DOM 6.30.1
- **스타일링**: Tailwind CSS 3.4.17
- **UI 라이브러리**: Radix UI + shadcn/ui
- **상태 관리**: React Query 5.83.0, Context API (AuthContext)
- **테스팅**: Vitest 3.2.4
- **환경 변수**: 없음 (환경 변수 파일 미존재)

### 현재 구조 분석

#### 1. 라우팅 구조
```
/ - LandingPage (공개)
/login - LoginPage (공개)
/products - ProductSearchPage (보호)
/product/:id - ProductDetailPage (보호)
/links - LinkManagePage (보호)
/report - ReportPage (보호)
/receipt - ReceiptPage (보호)
/notice - NoticePage (보호)
/qna - QnAPage (보호)
/guide - UsingGuidePage (보호)
* - NotFound (404)
```

#### 2. 주요 컴포넌트
- **Layout.tsx**: 대시보드 레이아웃 (Sidebar 포함)
- **TopBar.tsx**: 상단 네비게이션
- **ProtectedRoute.tsx**: 인증 보호 래퍼
- **AuthContext.tsx**: 로컬스토리지 기반 인증 (Mock)

#### 3. UI 컴포넌트
- shadcn/ui 기반 50+ 컴포넌트
- Radix UI primitives 사용
- Tailwind CSS로 스타일링
- **수정 없이 그대로 사용 가능**

#### 4. 의존성 분석
```json
핵심 의존성:
- React 18.3.1
- React Router DOM 6.30.1 → App Router로 대체
- @tanstack/react-query 5.83.0 → 유지
- Radix UI → 유지
- Tailwind CSS → 유지
- Vite 관련 패키지 → 제거
```

---

## 🎯 마이그레이션 목표

### 1. 핵심 목표
- ✅ Vite → Next.js 15 (최신 버전)
- ✅ 완전한 CSR (Client-Side Rendering) 유지
- ✅ UI 컴포넌트 수정 없이 100% 재사용
- ✅ 현재 기능 100% 유지
- ✅ 장애 발생 최소화

### 2. 비기능적 요구사항
- ✅ TypeScript 엄격 모드 유지
- ✅ ESLint 설정 보존
- ✅ 테스팅 환경 유지 (Vitest)
- ✅ 개발 경험 향상

---

## 🚀 마이그레이션 전략

### Phase 1: 환경 설정 및 초기 구성

#### 1.1 Next.js 설치 및 기본 설정
- [ ] Next.js 15 설치
- [ ] 필요한 Next.js 패키지 추가
  - `next`
  - `@next/bundle-analyzer` (optional)
- [ ] Vite 관련 패키지 제거
  - `vite`
  - `@vitejs/plugin-react-swc`
  - `lovable-tagger` (Vite 전용)

#### 1.2 설정 파일 생성/수정
- [ ] `next.config.ts` 생성
  - CSR 강제 설정 (`'use client'` 자동화)
  - 경로 alias 설정 (`@/`)
  - SWC 최적화
  - 이미지 최적화 비활성화 (필요시)
- [ ] `tsconfig.json` Next.js 호환 수정
- [ ] `package.json` scripts 수정
  - `dev: next dev`
  - `build: next build`
  - `start: next start`
  - `lint: next lint`

#### 1.3 디렉토리 구조 재구성
```
현재 구조:
src/
  pages/         → app/ 로 이동 (App Router)
  components/    → 유지
  contexts/      → 유지
  hooks/         → 유지
  lib/           → 유지
  data/          → 유지
  main.tsx       → 삭제 (Next.js가 엔트리 관리)
  App.tsx        → 삭제 (app/layout.tsx로 통합)

변경 후 구조:
app/
  layout.tsx          (Root Layout - Client Component)
  page.tsx            (/ - LandingPage)
  login/
    page.tsx          (/login - LoginPage)
  products/
    page.tsx          (/products - ProductSearchPage)
  product/
    [id]/
      page.tsx        (/product/:id - ProductDetailPage)
  links/
    page.tsx          (/links - LinkManagePage)
  report/
    page.tsx          (/report - ReportPage)
  receipt/
    page.tsx          (/receipt - ReceiptPage)
  notice/
    page.tsx          (/notice - NoticePage)
  qna/
    page.tsx          (/qna - QnAPage)
  guide/
    page.tsx          (/guide - UsingGuidePage)
  not-found.tsx       (404 - NotFound)

src/
  components/         (유지)
  contexts/           (유지)
  hooks/              (유지)
  lib/                (유지)
  data/               (유지)
  styles/
    globals.css       (index.css → globals.css)
```

### Phase 2: 코드 마이그레이션

#### 2.1 Root Layout 생성
- [ ] `app/layout.tsx` 생성
  - `'use client'` 지시어 추가
  - QueryClientProvider 통합
  - TooltipProvider 통합
  - AuthProvider 통합
  - Toaster 컴포넌트 포함
  - 메타데이터 설정

#### 2.2 페이지 컴포넌트 마이그레이션
- [ ] 각 페이지를 App Router 형식으로 변환
  - `src/pages/*.tsx` → `app/*/page.tsx`
  - 모든 페이지에 `'use client'` 추가
  - ProtectedRoute 로직을 각 페이지 또는 Layout으로 이동
  - 동적 라우팅 처리 (`[id]` 폴더 사용)

#### 2.3 라우팅 로직 변경
- [ ] React Router 제거
  - `BrowserRouter`, `Routes`, `Route` 제거
  - `useNavigate` → `useRouter` (next/navigation)
  - `useParams` → `useParams` (next/navigation)
  - `Link` → `Link` (next/link)
- [ ] ProtectedRoute 컴포넌트 수정
  - Client Component로 변환
  - Next.js의 `redirect` 또는 `useRouter` 사용

#### 2.4 컴포넌트 마이그레이션
- [ ] NavLink 컴포넌트 수정
  - `react-router-dom` Link → `next/link` Link
  - `useLocation` → `usePathname` (next/navigation)
- [ ] AuthContext 수정 (필요시)
  - Client Component 명시
- [ ] Layout 컴포넌트 확인
  - Client Component 명시

#### 2.5 스타일 및 에셋
- [ ] `src/index.css` → `app/globals.css`
- [ ] CSS imports 경로 확인
- [ ] public 폴더 구조 확인 (Next.js는 root의 public 사용)

### Phase 3: 의존성 및 설정 최적화

#### 3.1 패키지 정리
- [ ] `package.json` 정리
  - React Router 제거
  - Vite 관련 제거
  - Next.js 관련 추가
- [ ] `package-lock.json` 재생성

#### 3.2 환경 변수 설정 (필요시)
- [ ] `.env.local` 파일 생성 (필요한 경우)
- [ ] Next.js 환경 변수 컨벤션 적용
  - `NEXT_PUBLIC_` 접두사 사용

#### 3.3 ESLint 및 타입 체크
- [ ] ESLint 설정 Next.js 호환
  - `eslint-config-next` 추가
  - 기존 규칙과 통합
- [ ] TypeScript 에러 수정
- [ ] 타입 안전성 확인

### Phase 4: 테스팅 및 검증

#### 4.1 빌드 및 실행 테스트
- [ ] `npm run dev` 로컬 개발 서버 실행
- [ ] 모든 라우트 접근 확인
- [ ] 인증 플로우 테스트
- [ ] 동적 라우팅 테스트 (`/product/:id`)

#### 4.2 기능 검증
- [ ] 로그인/로그아웃 기능
- [ ] 보호된 라우트 리다이렉션
- [ ] LocalStorage 상태 유지
- [ ] React Query 동작 확인
- [ ] UI 컴포넌트 렌더링 확인

#### 4.3 프로덕션 빌드
- [ ] `npm run build` 성공 확인
- [ ] 빌드 최적화 확인
- [ ] 번들 크기 분석
- [ ] `npm run start` 프로덕션 서버 실행

#### 4.4 성능 및 품질 검증
- [ ] Lighthouse 스코어 확인
- [ ] 콘솔 에러 확인
- [ ] 네트워크 요청 확인
- [ ] 크로스 브라우저 테스트

### Phase 5: 정리 및 문서화

#### 5.1 불필요한 파일 제거
- [ ] `vite.config.ts` 삭제
- [ ] `src/main.tsx` 삭제
- [ ] `src/App.tsx` 삭제
- [ ] `src/vite-env.d.ts` 삭제 (필요시)
- [ ] `index.html` 삭제 (Next.js가 자동 생성)

#### 5.2 문서 업데이트
- [ ] README.md 업데이트
  - Next.js 기반으로 변경
  - 실행 방법 업데이트
- [ ] MIGRATION_PLAN.md 완료 체크

#### 5.3 Git 커밋
- [ ] 변경사항 커밋
- [ ] 브랜치 병합 (필요시)

---

## ⚠️ 주요 리스크 및 대응 방안

### 1. 라우팅 변경
**리스크**: React Router → Next.js App Router 변경으로 인한 동작 차이
**대응**:
- 모든 라우트를 수동으로 테스트
- `useNavigate`, `useLocation` 등 훅 사용처 전수 조사
- 동적 라우팅 (`[id]`) 정확한 구현

### 2. Client Component 강제
**리스크**: Next.js는 기본 Server Component이나, 우리는 CSR만 사용
**대응**:
- 모든 페이지와 레이아웃에 `'use client'` 명시
- Context API 사용하는 컴포넌트는 반드시 Client Component
- `next.config.ts`에서 CSR 최적화 설정

### 3. 의존성 충돌
**리스크**: Next.js와 기존 라이브러리 간 버전 충돌
**대응**:
- 점진적 패키지 업데이트
- Peer dependency 경고 확인
- 필요시 호환 버전 다운그레이드

### 4. 빌드 최적화
**리스크**: Next.js는 SSR 최적화가 기본이라 CSR에서는 번들 크기 증가 가능
**대응**:
- Dynamic imports 활용
- 코드 스플리팅 전략
- `next/dynamic` 활용

### 5. 환경 변수
**리스크**: Vite의 `import.meta.env` → Next.js의 `process.env`
**대응**:
- 현재 환경 변수 없음으로 리스크 최소
- 향후 추가 시 `NEXT_PUBLIC_` 접두사 사용

---

## 📊 예상 작업 시간

| Phase | 작업 내용 | 예상 복잡도 |
|-------|----------|------------|
| Phase 1 | 환경 설정 및 초기 구성 | 낮음 |
| Phase 2 | 코드 마이그레이션 | 중간 |
| Phase 3 | 의존성 및 설정 최적화 | 낮음 |
| Phase 4 | 테스팅 및 검증 | 중간 |
| Phase 5 | 정리 및 문서화 | 낮음 |

---

## ✅ 성공 기준

1. ✅ 모든 페이지가 정상적으로 렌더링
2. ✅ 로그인/로그아웃 기능 정상 동작
3. ✅ 보호된 라우트 접근 제어 정상 동작
4. ✅ UI 컴포넌트 시각적 변화 없음
5. ✅ 콘솔 에러 0개
6. ✅ 프로덕션 빌드 성공
7. ✅ 개발 서버 HMR 정상 동작
8. ✅ TypeScript 에러 0개

---

## 🔄 롤백 계획

만약 마이그레이션 중 심각한 문제 발생 시:
1. Git 브랜치로 이전 Vite 버전 보존
2. `package.json` 백업
3. 단계별 커밋으로 롤백 지점 명확화

---

## 📝 의사결정 필요 사항

### 1. Next.js 버전 선택
- **옵션 A**: Next.js 15 (최신, App Router 완전 지원)
- **옵션 B**: Next.js 14 (안정성 우선)
- **추천**: Next.js 15 (최신 기능 및 최적화)

### 2. ESLint 설정
- **옵션 A**: `eslint-config-next` 사용 (Next.js 권장)
- **옵션 B**: 기존 ESLint 설정 유지
- **추천**: `eslint-config-next` + 기존 규칙 병합

### 3. 테스팅 도구
- **옵션 A**: Vitest 유지
- **옵션 B**: Jest + React Testing Library로 전환
- **추천**: Vitest 유지 (Next.js는 Vitest 지원)

### 4. 프로젝트 구조
- **옵션 A**: `app/` 폴더만 사용 (모든 코드를 app 아래)
- **옵션 B**: `app/` + `src/` 병용 (페이지만 app, 나머지 src)
- **추천**: `app/` + `src/` 병용 (관심사 분리)

### 5. ProtectedRoute 처리
- **옵션 A**: Middleware 사용 (서버 사이드 체크)
- **옵션 B**: Client Component로 유지 (현재 방식)
- **추천**: Client Component 유지 (CSR 전략 일관성)

### 6. 포트 번호
- **현재**: 8080
- **옵션 A**: 8080 유지
- **옵션 B**: Next.js 기본값 3000 사용
- **추천**: 기존 팀 컨벤션 따르기

---

## 📌 다음 단계

마이그레이션 계획을 검토하신 후:
1. 의사결정 필요 사항에 대한 피드백
2. 추가 고려사항 확인
3. 작업 시작 승인

**준비 완료 시 Phase 1부터 순차적으로 진행하겠습니다.**
