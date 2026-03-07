import { z } from 'zod';

// OAuth 콜백 성공 응답 — Case A (기존 회원)
const loginSuccessSchema = z.object({
  status: z.literal('EXISTING'),
  accessToken: z.string(),
});

// OAuth 콜백 성공 응답 — Case B (신규 회원, 닉네임 미등록)
const needsNicknameSchema = z.object({
  status: z.literal('NEEDS_NICKNAME'),
  tempToken: z.string(),
});

export const oauthResponseSchema = z.discriminatedUnion('status', [
  loginSuccessSchema,
  needsNicknameSchema,
]);

// 에러 응답 — 에러 테이블과 1:1 매핑
export const oauthErrorSchema = z.object({
  code: z.enum([
    'EMAIL_ALREADY_REGISTERED',
    'TOKEN_EXPIRED',
    'NAME_MISMATCH',
    'ALREADY_VERIFIED',
    'NICKNAME_DUPLICATED',
  ]),
  message: z.string(),
});

export type OAuthResponse = z.infer<typeof oauthResponseSchema>;
export type OAuthError = z.infer<typeof oauthErrorSchema>;
export type OAuthErrorCode = OAuthError['code'];
