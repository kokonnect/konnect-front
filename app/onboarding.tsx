import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  setOnboardingComplete,
  setUserLanguage,
  setFirstLaunchComplete,
} from "@/utils/storage";
import { getAvailableLanguages, changeLanguage } from "@/locales/i18n";
import { Language } from "@/types";

const primaryColor = "#00B493";
const { width } = Dimensions.get("window");

// Get languages from i18n system with flags
const getLanguagesWithFlags = () => {
  const availableLanguages = getAvailableLanguages();
  const flagMap: { [key: string]: string } = {
    en: "🇺🇸",
    ko: "🇰🇷",
  };

  return availableLanguages.map((lang) => ({
    ...lang,
    flag: flagMap[lang.code] || "🌐",
  }));
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const [selectedLanguage, setSelectedLanguage] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const languages = getLanguagesWithFlags();

  const handleLanguageSelect = async (language: any) => {
    setSelectedLanguage(language);
    // Apply the language immediately
    await changeLanguage(language.code);
  };

  const handleGetStarted = async () => {
    if (!selectedLanguage) {
      Alert.alert(
        t("onboarding.languageRequired"),
        t("onboarding.languageRequiredMessage"),
        [
          {
            text: t("common:ok"),
            style: "default",
          },
        ],
      );
      return;
    }

    setIsLoading(true);

    try {
      // Save user preferences
      await Promise.all([
        setUserLanguage(selectedLanguage.code),
        setOnboardingComplete(),
        setFirstLaunchComplete(),
      ]);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      Alert.alert(t("common:error"), t("onboarding.somethingWentWrong"), [
        {
          text: t("common:ok"),
          onPress: () => setIsLoading(false),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name="translate"
              size={50}
              color={primaryColor}
            />
          </View>
          <Text style={styles.welcomeTitle}>{t("onboarding.title")}</Text>
          <Text style={styles.welcomeSubtitle}>
            {t("onboarding.description")}
          </Text>
        </View>

        {/* Language Selection */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>
            {t("onboarding.selectLanguage")}
          </Text>

          <View style={styles.languageGrid}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageCard,
                  selectedLanguage?.code === language.code &&
                    styles.selectedLanguageCard,
                ]}
                onPress={() => handleLanguageSelect(language)}
                disabled={isLoading}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text
                  style={[
                    styles.languageName,
                    selectedLanguage?.code === language.code &&
                      styles.selectedLanguageName,
                  ]}
                >
                  {language.name}
                </Text>
                <Text
                  style={[
                    styles.languageNative,
                    selectedLanguage?.code === language.code &&
                      styles.selectedLanguageNative,
                  ]}
                >
                  {language.nativeName}
                </Text>
                {selectedLanguage?.code === language.code && (
                  <View style={styles.checkIcon}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={primaryColor}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.getStartedButton,
            (!selectedLanguage || isLoading) && styles.getStartedButtonDisabled,
          ]}
          onPress={handleGetStarted}
          disabled={!selectedLanguage || isLoading}
        >
          {isLoading ? (
            <Text style={styles.getStartedButtonText}>Setting up...</Text>
          ) : (
            <>
              <Text style={styles.getStartedButtonText}>
                {isLoading ? t("common:loading") : t("onboarding.getStarted")}
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="#fff"
              />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerNote}>{t("onboarding.footerText")}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width * 0.85,
  },
  languageSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  languageCard: {
    width: (width - 64) / 2, // 2 columns with gaps
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  selectedLanguageCard: {
    borderColor: primaryColor,
    backgroundColor: `${primaryColor}05`,
  },
  languageFlag: {
    fontSize: 32,
    marginBottom: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  selectedLanguageName: {
    color: primaryColor,
  },
  languageNative: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  selectedLanguageNative: {
    color: "#555",
  },
  checkIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primaryColor,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  getStartedButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  footerNote: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
  },
});
