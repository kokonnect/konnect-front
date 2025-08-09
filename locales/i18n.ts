import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const initI18n = async () => {
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

export { initI18n };
export default i18n;
