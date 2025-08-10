import { Child, User } from "@/types";

class UserApi {
  private baseUrl = process.env.API_URL;

  async fetchUserProfile(accessToken: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: "John Smith",
      email: "user@example.com",
      provider: "google",
      children: [],
    };

    return mockUser;
  }

  async updateUserProfile(
    accessToken: string,
    updates: Partial<User>,
  ): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock updated user
    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: "John Smith",
      email: "user@example.com",
      provider: "google",
      ...updates,
    };

    return mockUser;
  }

  async addChild(accessToken: string, child: Child): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user with new child
    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: "John Smith",
      email: "user@example.com",
      provider: "google",
      children: [child],
    };

    return mockUser;
  }

  async removeChild(accessToken: string, childId: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user with child removed
    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: "John Smith",
      email: "user@example.com",
      provider: "google",
      children: [],
    };

    return mockUser;
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
      id: childId,
      name: "Emma Johnson",
      birthDate: "2015-05-15",
      school: "Riverside Elementary",
      grade: "3rd Grade",
      ...updates,
    };

    // Mock user with updated child
    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: "John Smith",
      email: "user@example.com",
      provider: "google",
      children: [updatedChild],
    };

    return mockUser;
  }

  async getChildren(accessToken: string): Promise<Child[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock children data
    const mockChildren: Child[] = [
      {
        id: "child_1",
        name: "Emma Johnson",
        birthDate: "2015-05-15",
        school: "Riverside Elementary",
        grade: "3rd Grade",
      },
      {
        id: "child_2",
        name: "Lucas Johnson",
        birthDate: "2013-08-22",
        school: "Riverside Elementary",
        grade: "5th Grade",
      },
    ];

    return mockChildren;
  }
}

export const userApi = new UserApi();
