// User and Child related types

export interface Child {
  id: string;
  name: string;
  birthDate: string;
  school: string;
  grade: string;
  // Optional fields for extended child information
  age?: number;
  class?: string; // Standardize to 'class' instead of 'className'
  className?: string; // Keep for backward compatibility
  teacher?: string;
  teacherName?: string; // Extended teacher information
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
  email?: string;
  language?: string;
  avatar?: string;
  children?: Child[];
  notificationEnabled?: boolean;
  saveHistoryDTranslation: boolean; // document translation history
  saveHistoryMTranslation: boolean; // message translation history
}

// Redux state types
export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
