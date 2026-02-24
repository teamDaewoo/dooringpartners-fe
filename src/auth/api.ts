import { httpClient } from '@/api/httpClient';
import type {
  SignupSellerRequest,
  SignupCreatorRequest,
  LoginRequest,
  ApiResponse,
  TokenResponse,
  SignupResponse,
} from './types';

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
