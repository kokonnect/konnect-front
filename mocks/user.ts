import { User, Child, UserProfile } from "@/types/user";

export const mockChildren: Child[] = [
  {
    id: "child_1",
    name: "Emma Johnson",
    birthDate: "2015-05-15",
    school: "Riverside Elementary",
    grade: "3rd Grade",
    class: "3A",
    teacherName: "Ms. Smith",
  },
  {
    id: "child_2",
    name: "Lucas Johnson",
    birthDate: "2013-08-22",
    school: "Riverside Elementary",
    grade: "5th Grade",
    class: "5B",
    teacherName: "Mr. Brown",
  },
  {
    id: "child_3",
    name: "Sophia Johnson",
    birthDate: "2016-11-08",
    school: "Oak Tree Elementary",
    grade: "2nd Grade",
    class: "2C",
    teacherName: "Mrs. Davis",
  },
];

export const mockUser: User = {
  id: `user_${Date.now()}`,
  name: "John Smith",
  email: "user@example.com",
  provider: "google",
  children: mockChildren.slice(0, 2), // Default with 2 children
};

export const mockUserProfile: UserProfile = {
  name: "Sarah Johnson",
  avatar: undefined,
  children: mockChildren.slice(0, 2),
  email: "sarah.johnson@example.com",
  language: "en",
  notificationEnabled: true,
  saveHistoryDTranslation: true, // document translation history
  saveHistoryMTranslation: true, // message translation history
};

// Function to create mock user with custom data
export const createMockUser = (overrides?: Partial<User>): User => ({
  ...mockUser,
  ...overrides,
});

// Function to create mock child with custom data
export const createMockChild = (overrides?: Partial<Child>): Child => ({
  id: `child_${Date.now()}`,
  name: "New Child",
  birthDate: "2015-01-01",
  school: "Elementary School",
  grade: "1st Grade",
  ...overrides,
});
