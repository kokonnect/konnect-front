import { Child, User, AuthResponse } from "@/types";

class AuthApi {
  private baseUrl = process.env.API_URL;

  async authenticate(
    authToken: string,
    provider: "kakao" | "google",
  ): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      accessToken: `access_token_${Date.now()}`,
      refreshToken: `refresh_token_${Date.now()}`,
      user: {
        id: `${provider}_${Date.now()}`,
        name: provider === "kakao" ? "김민수" : "John Smith",
        email: `user@${provider}.com`,
        provider,
        children: [],
      },
    };
  }

  async logout(accessToken: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async addChild(accessToken: string, child: Child): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: "John Smith",
      email: "user@example.com",
      provider: "google",
      children: [child],
    };

    return mockUser;
  }

  async updateUser(accessToken: string, updates: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: "John Smith",
      email: "user@example.com",
      provider: "google",
      ...updates,
    };

    return mockUser;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      accessToken: `new_access_token_${Date.now()}`,
      refreshToken: `new_refresh_token_${Date.now()}`,
      user: {
        id: `user_${Date.now()}`,
        name: "John Smith",
        email: "user@example.com",
        provider: "google",
        children: [],
      },
    };
  }
}

export const authApi = new AuthApi();
