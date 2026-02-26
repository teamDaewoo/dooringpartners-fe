// User Types
export type UserType = 'seller' | 'creator';

export type UserStatus = 'pending' | 'active' | 'suspended';

// API Request Types
export interface SignupSellerRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignupCreatorRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface TokenResponse {
  accessToken: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  userType: UserType;
}

// Auth User
export interface AuthUser {
  userId: number;
  userType: UserType;
  status: UserStatus;
}

// JWT Payload
export interface JwtPayload {
  sub: string; // userId
  type: UserType;
  status: UserStatus;
  iat?: number;
  exp?: number;
}

// Legacy types (기존 코드 호환용)
export interface User {
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
