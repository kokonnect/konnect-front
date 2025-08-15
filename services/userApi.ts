import { Child, User } from "@/types";
import { mockChildren, createMockUser } from "@/mocks/user";

class UserApi {
  private baseUrl = process.env.API_URL;

  async fetchUserProfile(accessToken: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return createMockUser();
  }

  async updateUserProfile(
    accessToken: string,
    updates: Partial<User>,
  ): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return createMockUser(updates);
  }

  async addChild(accessToken: string, child: Child): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return createMockUser({ children: [child] });
  }

  async removeChild(accessToken: string, childId: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return createMockUser({ children: [] });
  }

  async updateChild(
    accessToken: string,
    childId: string,
    updates: Partial<Child>,
  ): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock updated child
    const updatedChild: Child = {
      ...mockChildren[0],
      id: childId,
      ...updates,
    };

    return createMockUser({ children: [updatedChild] });
  }

  async getChildren(accessToken: string): Promise<Child[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockChildren;
  }
}

export const userApi = new UserApi();
