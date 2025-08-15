import { Child, User, AuthResponse } from "@/types";
import { createMockUser, createMockAuthResponse } from "@/mocks";

class AuthApi {
  private baseUrl = process.env.API_URL;

  async authenticate(
    authToken: string,
    provider: "kakao" | "google",
  ): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return createMockAuthResponse({
      user: createMockUser({
        id: `${provider}_${Date.now()}`,
        name: provider === "kakao" ? "김민수" : "John Smith",
        email: `user@${provider}.com`,
        provider,
        children: [],
      })
    });
  }

  async logout(accessToken: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async addChild(accessToken: string, child: Child): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return createMockUser({ children: [child] });
  }

  async updateUser(accessToken: string, updates: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return createMockUser(updates);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return createMockAuthResponse({
      accessToken: `new_access_token_${Date.now()}`,
      refreshToken: `new_refresh_token_${Date.now()}`,
    });
  }
}

export const authApi = new AuthApi();
