import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Import translation files
import enCommon from "./en/common.json";
import enAuth from "./en/auth.json";
import enCalendar from "./en/calendar.json";
import enMessage from "./en/message.json";
import enProfile from "./en/profile.json";
import enTranslate from "./en/translate.json";

import koCommon from "./ko/common.json";
import koAuth from "./ko/auth.json";
import koCalendar from "./ko/calendar.json";
import koMessage from "./ko/message.json";
import koProfile from "./ko/profile.json";
import koTranslate from "./ko/translate.json";

const LANGUAGE_KEY = "@app_language";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    calendar: enCalendar,
    message: enMessage,
    profile: enProfile,
    translate: enTranslate,
  },
  ko: {
    common: koCommon,
    auth: koAuth,
    calendar: koCalendar,
    message: koMessage,
    profile: koProfile,
    translate: koTranslate,
  },
};

// Track initialization state
let isInitialized = false;

// Synchronous initialization for web
const initI18nSync = () => {
  if (isInitialized) return;

  // Get device language for web
  const deviceLanguage = Localization.getLocales()[0]?.languageCode || "en";
  const defaultLanguage = (resources as any)[deviceLanguage] ? deviceLanguage : "en";

  i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "auth", "calendar", "message", "profile", "translate"],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

  isInitialized = true;
};

// Async initialization for mobile
const initI18n = async () => {
  if (isInitialized) return;

  // For web, use synchronous initialization
  if (Platform.OS === 'web') {
    initI18nSync();
    return;
  }

  // For mobile, check saved language preference
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

  if (!savedLanguage) {
    // Get device language
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || "en";
    // Check if we support this language, otherwise default to English
    savedLanguage = (resources as any)[deviceLanguage] ? deviceLanguage : "en";
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "auth", "calendar", "message", "profile", "translate"],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

  isInitialized = true;
};

// Save language preference
export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
};

// Get current language
export const getCurrentLanguage = () => i18n.language;

// Get available languages
export const getAvailableLanguages = () => [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
];

// Initialize immediately for web platform
if (Platform.OS === 'web') {
  initI18nSync();
}

export { initI18n, isInitialized };
export default i18n;
