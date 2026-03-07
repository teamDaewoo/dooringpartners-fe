import { httpClient } from '@/api/httpClient';
import type {
  SignupSellerRequest,
  SignupCreatorRequest,
  LoginRequest,
  ApiResponse,
  TokenResponse,
  SignupResponse,
  OAuthProvider,
  OAuthAuthorizeResponse,
  OAuthCallbackRequest,
  NicknameRegisterRequest,
  NicknameCheckResponse,
} from './types';
import type { OAuthResponse } from '@/schema/auth';

// Seller APIs
export async function sellerSignup(data: SignupSellerRequest) {
  const response = await httpClient.post<ApiResponse<SignupResponse>>(
    '/api/auth/seller/signup',
    data
  );
  return response.data;
}

export async function sellerLogin(data: LoginRequest) {
  const response = await httpClient.post<ApiResponse<TokenResponse>>(
    '/api/auth/seller/login',
    data
  );
  return response.data;
}

export async function sellerLogout() {
  const response = await httpClient.post<ApiResponse>('/api/auth/seller/logout');
  return response.data;
}

export async function sellerRefresh() {
  const response = await httpClient.post<ApiResponse<TokenResponse>>(
    '/api/auth/seller/refresh'
  );
  return response.data;
}

// Creator APIs
export async function creatorSignup(data: SignupCreatorRequest) {
  const response = await httpClient.post<ApiResponse<SignupResponse>>(
    '/api/auth/creator/signup',
    data
  );
  return response.data;
}

export async function creatorLogin(data: LoginRequest) {
  const response = await httpClient.post<ApiResponse<TokenResponse>>(
    '/api/auth/creator/login',
    data
  );
  return response.data;
}

export async function creatorLogout() {
  const response = await httpClient.post<ApiResponse>('/api/auth/creator/logout');
  return response.data;
}

export async function creatorRefresh() {
  const response = await httpClient.post<ApiResponse<TokenResponse>>(
    '/api/auth/creator/refresh'
  );
  return response.data;
}

// OAuth APIs
export async function getOAuthAuthorizeUrl(provider: OAuthProvider, state: string) {
  const response = await httpClient.get<ApiResponse<OAuthAuthorizeResponse>>(
    `/api/auth/creator/oauth/${provider}/authorize`,
    { params: { state } }
  );
  return response.data;
}

export async function oauthCallback(provider: OAuthProvider, data: OAuthCallbackRequest) {
  const response = await httpClient.post<ApiResponse<OAuthResponse>>(
    `/api/auth/creator/oauth/${provider}/callback`,
    data
  );
  return response.data;
}

export async function registerOAuthNickname(data: NicknameRegisterRequest, tempToken: string) {
  const response = await httpClient.patch<ApiResponse<TokenResponse>>(
    '/api/auth/creator/oauth/nickname',
    data,
    { headers: { Authorization: `Bearer ${tempToken}` } }
  );
  return response.data;
}

export async function checkNicknameDuplicate(nickname: string) {
  const response = await httpClient.get<ApiResponse<NicknameCheckResponse>>(
    '/api/auth/creator/nickname/check',
    { params: { nickname } }
  );
  return response.data;
}
