import { Child, User, AuthResponse } from "@/types";
import { createMockUser, createMockAuthResponse } from "@/mocks";

class AuthApi {
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

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

  async getGuestToken(language: string = "ENGLISH"): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: language
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get guest token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Extract result from the response wrapper
    if (data.isSuccess && data.result) {
      return {
        accessToken: data.result.accessToken,
        refreshToken: undefined, // Guest tokens don't have refresh tokens
        user: createMockUser({ 
          id: data.result.userId.toString(),
          name: "Guest User",
          email: "",
          provider: "guest" as any,
          children: [],
        }), // Create mock user for guest
      };
    } else {
      throw new Error(data.message || "Failed to get guest token");
    }
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
