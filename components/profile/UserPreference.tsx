import { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage, getAvailableLanguages } from "@/locales/i18n";
import LanguageSelectionModal from "@/components/profile/LanguageSelectionModal";

const primaryColor = "#00B493";

export default function PreferencesSection() {
  const { t } = useTranslation("profile");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [historySave, setHistorySave] = useState(true);
  const [translationSave, setTranslationSave] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const currentLanguage = getCurrentLanguage();
  const availableLanguages = getAvailableLanguages();
  const currentLanguageDisplay =
    availableLanguages.find((lang) => lang.code === currentLanguage)
      ?.nativeName || currentLanguage;

  const handleSetPushNotifications = (value: boolean) => {
    setPushNotifications(value);
  };
  const handleSetHistorySave = (value: boolean) => {
    setHistorySave(value);
  };
  const handleSetTranslationSave = (value: boolean) => {
    setTranslationSave(value);
  };

  const handleLanguageChanged = () => {
    // Language change is handled by the modal component
    // This callback is just for any additional logic if needed
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("preferences.title")}</Text>
      <View style={styles.preferencesContainer}>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <MaterialCommunityIcons name="bell" size={20} color="#666" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>
                {t("preferences.notifications.title")}
              </Text>
            </View>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={handleSetPushNotifications}
            trackColor={{ false: "#e0e0e0", true: `${primaryColor}40` }}
            thumbColor={pushNotifications ? primaryColor : "#f4f3f4"}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <MaterialCommunityIcons name="history" size={20} color="#666" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>
                {t("preferences.translation.saveMessageHistory")}
              </Text>
            </View>
          </View>
          <Switch
            value={historySave}
            onValueChange={handleSetHistorySave}
            trackColor={{ false: "#e0e0e0", true: `${primaryColor}40` }}
            thumbColor={historySave ? primaryColor : "#f4f3f4"}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <MaterialCommunityIcons name="translate" size={20} color="#666" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>
                {t("preferences.translation.saveDocHistory")}
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#e0e0e0", true: `${primaryColor}40` }}
            thumbColor={translationSave ? primaryColor : "#f4f3f4"}
            onValueChange={handleSetTranslationSave}
            value={translationSave}
          />
        </View>

        <TouchableOpacity
          style={styles.preferenceItem}
          onPress={() => setShowLanguageModal(true)}
        >
          <View style={styles.preferenceInfo}>
            <MaterialCommunityIcons name="earth" size={20} color="#666" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>
                {t("preferences.language")}
              </Text>
              <Text style={styles.preferenceSubtitle}>
                {t("preferences.languageDescription")}
              </Text>
            </View>
          </View>
          <View style={styles.languageDisplay}>
            <Text style={styles.languageText}>{currentLanguageDisplay}</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#666"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onLanguageChanged={handleLanguageChanged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Preferences Section Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  preferencesContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  preferenceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  preferenceText: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  languageDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
});
