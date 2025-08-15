import { AuthTokens } from "@/types/auth";
import { AuthResponse } from "@/types/api";
import { User } from "@/types/user";

export const mockAuthTokens: AuthTokens = {
  accessToken: `mock_access_token_${Date.now()}`,
  refreshToken: `mock_refresh_token_${Date.now()}`,
};

export const mockAuthUser: User = {
  id: `user_${Date.now()}`,
  name: "User",
  email: "user@example.com",
  provider: "google",
  children: [],
};

export const mockAuthResponse: AuthResponse = {
  ...mockAuthTokens,
  user: mockAuthUser,
};

export const createMockAuthResponse = (
  overrides?: Partial<AuthResponse>,
): AuthResponse => ({
  ...mockAuthResponse,
  ...overrides,
});
