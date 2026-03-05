# Phase 1: 디렉토리 구조 생성

**목표:** 새로운 폴더 구조만 생성, 기존 파일은 그대로 유지
**예상 시간:** 5분
**위험도:** ⚪ 낮음

---

## 생성할 디렉토리 목록

### app 디렉토리
```
src/app/
├── (marketing)/
│   ├── login/
│   ├── signup/
│   └── _components/
└── (partners)/
    ├── dashboard/
    ├── products/
    │   └── [id]/
    ├── links/
    ├── receipt/
    ├── notice/
    ├── qna/
    └── guide/
```

### components 디렉토리
```
src/components/
├── common/
├── auth/
├── marketing/
├── dashboard/
├── campaign/
├── link/
└── notice/
```

### hooks 디렉토리
```
src/hooks/
├── campaign/
├── link/
└── notice/
```

### 기타 디렉토리
```
src/
├── auth/
└── types/
```

---

## 실행 명령어

```bash
# app 그룹 폴더
mkdir -p src/app/\(marketing\)/login
mkdir -p src/app/\(marketing\)/signup
mkdir -p src/app/\(marketing\)/_components

mkdir -p src/app/\(partners\)/dashboard
mkdir -p src/app/\(partners\)/products/\[id\]
mkdir -p src/app/\(partners\)/links
mkdir -p src/app/\(partners\)/receipt
mkdir -p src/app/\(partners\)/notice
mkdir -p src/app/\(partners\)/qna
mkdir -p src/app/\(partners\)/guide

# components 도메인 폴더
mkdir -p src/components/common
mkdir -p src/components/auth
mkdir -p src/components/marketing
mkdir -p src/components/dashboard
mkdir -p src/components/campaign
mkdir -p src/components/link
mkdir -p src/components/notice

# hooks 도메인 폴더
mkdir -p src/hooks/campaign
mkdir -p src/hooks/link
mkdir -p src/hooks/notice

# auth, types 폴더
mkdir -p src/auth
mkdir -p src/types
```

---

## 체크포인트

### 생성 확인
- [ ] `src/app/(marketing)/` 폴더 존재
- [ ] `src/app/(partners)/` 폴더 존재
- [ ] `src/components/common/` 폴더 존재
- [ ] `src/components/auth/` 폴더 존재
- [ ] `src/hooks/campaign/` 폴더 존재
- [ ] `src/auth/` 폴더 존재
- [ ] `src/types/` 폴더 존재

### 빌드 확인
- [ ] `npm run dev` 정상 실행
- [ ] 기존 페이지 접속 확인 (/, /login, /report 등)
- [ ] TypeScript 오류 없음

---

## 참고사항

- 괄호 폴더 `(marketing)`, `(partners)`는 Next.js에서 URL에 포함되지 않는 라우트 그룹
- `_components`는 라우팅에서 무시되는 폴더 (내부 사용 전용)
- `[id]`는 동적 라우트 폴더

---

## 문제 발생 시

**폴더 생성 실패:**
```bash
# 권한 확인
ls -la src/

# 수동 생성
mkdir -p [경로]
```

**폴더 이름 오타:**
- 괄호, 대괄호를 정확히 확인
- Bash 명령어에서 괄호는 `\(`, `\)`로 이스케이프 필요

---

## 다음 단계

Phase 1 완료 후 → `docs/refactoring/phase2-pages.md` 진행
