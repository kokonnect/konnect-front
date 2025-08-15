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

import viCommon from "./vi/common.json";
import viAuth from "./vi/auth.json";
import viCalendar from "./vi/calendar.json";
import viMessage from "./vi/message.json";
import viProfile from "./vi/profile.json";
import viTranslate from "./vi/translate.json";

import zhCommon from "./zh/common.json";
import zhAuth from "./zh/auth.json";
import zhCalendar from "./zh/calendar.json";
import zhMessage from "./zh/message.json";
import zhProfile from "./zh/profile.json";
import zhTranslate from "./zh/translate.json";

import thCommon from "./th/common.json";
import thAuth from "./th/auth.json";
import thCalendar from "./th/calendar.json";
import thMessage from "./th/message.json";
import thProfile from "./th/profile.json";
import thTranslate from "./th/translate.json";

import jaCommon from "./ja/common.json";
import jaAuth from "./ja/auth.json";
import jaCalendar from "./ja/calendar.json";
import jaMessage from "./ja/message.json";
import jaProfile from "./ja/profile.json";
import jaTranslate from "./ja/translate.json";

import tlCommon from "./tl/common.json";
import tlAuth from "./tl/auth.json";
import tlCalendar from "./tl/calendar.json";
import tlMessage from "./tl/message.json";
import tlProfile from "./tl/profile.json";
import tlTranslate from "./tl/translate.json";

import kmCommon from "./km/common.json";
import kmAuth from "./km/auth.json";
import kmCalendar from "./km/calendar.json";
import kmMessage from "./km/message.json";
import kmProfile from "./km/profile.json";
import kmTranslate from "./km/translate.json";

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
  vi: {
    common: viCommon,
    auth: viAuth,
    calendar: viCalendar,
    message: viMessage,
    profile: viProfile,
    translate: viTranslate,
  },
  zh: {
    common: zhCommon,
    auth: zhAuth,
    calendar: zhCalendar,
    message: zhMessage,
    profile: zhProfile,
    translate: zhTranslate,
  },
  th: {
    common: thCommon,
    auth: thAuth,
    calendar: thCalendar,
    message: thMessage,
    profile: thProfile,
    translate: thTranslate,
  },
  ja: {
    common: jaCommon,
    auth: jaAuth,
    calendar: jaCalendar,
    message: jaMessage,
    profile: jaProfile,
    translate: jaTranslate,
  },
  tl: {
    common: tlCommon,
    auth: tlAuth,
    calendar: tlCalendar,
    message: tlMessage,
    profile: tlProfile,
    translate: tlTranslate,
  },
  km: {
    common: kmCommon,
    auth: kmAuth,
    calendar: kmCalendar,
    message: kmMessage,
    profile: kmProfile,
    translate: kmTranslate,
  },
};

// Track initialization state
let isInitialized = false;

// Synchronous initialization for web
const initI18nSync = () => {
  if (isInitialized) return;

  // Use enhanced device language detection for web too
  const defaultLanguage = detectDeviceLanguage();

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

// Enhanced device language detection
const detectDeviceLanguage = () => {
  const locales = Localization.getLocales();
  const deviceLanguages = locales.map(locale => locale.languageCode?.toLowerCase()).filter(Boolean);
  
  // Check for exact matches first
  for (const lang of deviceLanguages) {
    if ((resources as any)[lang]) {
      return lang;
    }
  }
  
  // Check for language family matches (e.g., zh-CN -> zh)
  for (const locale of locales) {
    if (locale.languageCode) {
      const langCode = locale.languageCode.toLowerCase();
      const baseLang = langCode.split('-')[0]; // Extract base language (zh from zh-CN)
      
      if ((resources as any)[baseLang]) {
        return baseLang;
      }
    }
  }
  
  // Default to English if no supported language found
  return "en";
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
    // Use enhanced device language detection
    savedLanguage = detectDeviceLanguage();
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

// Get device language without initialization
export const getDeviceLanguage = () => detectDeviceLanguage();

// Check if language onboarding should be shown
export const shouldShowLanguageOnboarding = async () => {
  if (Platform.OS === 'web') {
    // For web, always use detected device language
    return false;
  }
  
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  return !savedLanguage; // Show onboarding if no language is saved
};

// Get available languages
export const getAvailableLanguages = () => [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ", flag: "🇰🇭" },
];

// Initialize immediately for web platform
if (Platform.OS === 'web') {
  initI18nSync();
}

export { initI18n, isInitialized };
export default i18n;
