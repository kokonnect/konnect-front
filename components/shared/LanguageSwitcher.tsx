import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguage, getAvailableLanguages } from "@/locales/i18n";

const primaryColor = "#00B493";

export default function LanguageSwitcher() {
  const { t } = useTranslation('profile');
  const currentLanguage = getCurrentLanguage();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      await changeLanguage(languageCode);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('preferences.language')}</Text>
      <View style={styles.languageOptions}>
        {availableLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageOption,
              currentLanguage === language.code && styles.activeOption,
            ]}
            onPress={() => handleLanguageChange(language.code)}
          >
            <View style={styles.languageInfo}>
              <Text
                style={[
                  styles.languageName,
                  currentLanguage === language.code && styles.activeText,
                ]}
              >
                {language.nativeName}
              </Text>
              <Text
                style={[
                  styles.languageCode,
                  currentLanguage === language.code && styles.activeSubtext,
                ]}
              >
                {language.name}
              </Text>
            </View>
            {currentLanguage === language.code && (
              <MaterialCommunityIcons
                name="check"
                size={24}
                color={primaryColor}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  languageOptions: {
    gap: 8,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },
  activeOption: {
    borderColor: primaryColor,
    backgroundColor: `${primaryColor}10`,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  languageCode: {
    fontSize: 14,
    color: "#666",
  },
  activeText: {
    color: primaryColor,
  },
  activeSubtext: {
    color: primaryColor,
    opacity: 0.8,
  },
});