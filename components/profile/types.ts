export interface Child {
  id: string;
  name: string;
  grade: string;
  age: number;
  className: string;
  teacher: string;
  school: string;
}

export interface UserProfile {
  name: string;
  email: string;
  language: string;
  avatar?: string;
}
