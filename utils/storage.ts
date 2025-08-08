// Mock storage for development (in production, use @react-native-async-storage/async-storage)
const mockStorage = new Map<string, string>();

// Storage keys
const STORAGE_KEYS = {
  FIRST_LAUNCH: 'first_launch',
  USER_LANGUAGE: 'user_language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

// Mock AsyncStorage implementation
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    return Promise.resolve(mockStorage.get(key) || null);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    mockStorage.set(key, value);
    return Promise.resolve();
  },
  removeItem: async (key: string): Promise<void> => {
    mockStorage.delete(key);
    return Promise.resolve();
  },
  multiRemove: async (keys: string[]): Promise<void> => {
    keys.forEach(key => mockStorage.delete(key));
    return Promise.resolve();
  },
};

// First launch management
export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const hasLaunchedBefore = await storage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    return hasLaunchedBefore === null;
  } catch (error) {
    console.error('Error checking first launch:', error);
    return true; // Default to first launch if error
  }
};

export const setFirstLaunchComplete = async (): Promise<void> => {
  try {
    await storage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
  } catch (error) {
    console.error('Error setting first launch complete:', error);
  }
};

// Onboarding management
export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const completed = await storage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
};

// Language preferences
export const getUserLanguage = async (): Promise<string | null> => {
  try {
    return await storage.getItem(STORAGE_KEYS.USER_LANGUAGE);
  } catch (error) {
    console.error('Error getting user language:', error);
    return null;
  }
};

export const setUserLanguage = async (language: string): Promise<void> => {
  try {
    await storage.setItem(STORAGE_KEYS.USER_LANGUAGE, language);
  } catch (error) {
    console.error('Error setting user language:', error);
  }
};

// Clear all stored data (for testing/reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await storage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};