import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock backend authentication - replace with actual API call
async function mockBackendAuth(authToken: string, provider: 'kakao' | 'google') {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response from backend
  return {
    accessToken: `access_token_${Date.now()}`,
    user: {
      id: `${provider}_${Date.now()}`,
      name: provider === 'kakao' ? '김민수' : 'John Smith',
      email: `user@${provider}.com`,
      provider,
      children: [], // New users have no children initially
    },
  };
}

interface Child {
  id: string;
  name: string;
  birthDate: string;
  school: string;
  grade: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  provider: 'kakao' | 'google';
  children?: Child[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasChildren: boolean;
  login: (authToken: string, provider: 'kakao' | 'google') => Promise<void>;
  logout: () => void;
  addChild: (child: Child) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (authToken: string, provider: 'kakao' | 'google') => {
    try {
      // Send auth token to backend and get access token + user data
      // This is a mock implementation - replace with actual API call
      const response = await mockBackendAuth(authToken, provider);
      
      setAccessToken(response.accessToken);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  const addChild = (child: Child) => {
    if (user) {
      const updatedUser = {
        ...user,
        children: [...(user.children || []), child],
      };
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    hasChildren: !!(user?.children && user.children.length > 0),
    login,
    logout,
    addChild,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}