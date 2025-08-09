// Authentication related types

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthProvider = "kakao" | "google";

export interface LoginCredentials {
  authToken: string;
  provider: AuthProvider;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}