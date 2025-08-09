// User and Child related types

export interface Child {
  id: string;
  name: string;
  birthDate: string;
  school: string;
  grade: string;
  // Optional fields for extended child information
  age?: number;
  className?: string;
  teacher?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  provider: "kakao" | "google";
  children?: Child[];
}

export interface UserProfile {
  name: string;
  email: string;
  language: string;
  avatar?: string;
}

// Redux state types
export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}