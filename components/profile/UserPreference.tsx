import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const primaryColor = "#00B493";

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
];

// Optimized render function
const createLanguageRenderItem =
  (
    language: string,
    handleLanguageSelect: (lang: string) => void,
    primaryColor: string,
  ) =>
  ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.languageOption}
      onPress={() => handleLanguageSelect(item)}
    >
      <Text style={styles.languageOptionText}>{item}</Text>
      {language === item && (
        <MaterialCommunityIcons name="check" size={20} color={primaryColor} />
      )}
    </TouchableOpacity>
  );

export default function PreferencesSection() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [historySave, setHistorySave] = useState(true);
  const [translationSave, setTranslationSave] = useState(true);
  const [language, setLanguage] = useState("English");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleSetPushNotifications = (value: boolean) => {
    setPushNotifications(value);
  };
  const handleSetHistorySave = (value: boolean) => {
    setHistorySave(value);
  };
  const handleSetTranslationSave = (value: boolean) => {
    setTranslationSave(value);
  };

  const handleLanguageSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setShowLanguageModal(false);
  };

  // Create render function with current state
  const renderLanguageItem = createLanguageRenderItem(
    language,
    handleLanguageSelect,
    primaryColor,
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.preferencesContainer}>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <MaterialCommunityIcons name="bell" size={20} color="#666" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>Push Notifications</Text>
              <Text style={styles.preferenceSubtitle}>
                Receive updates about your children
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
              <Text style={styles.preferenceTitle}>Save Message History</Text>
              <Text style={styles.preferenceSubtitle}>
                Keep history of composed messages
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
              <Text style={styles.preferenceTitle}>Save Translations</Text>
              <Text style={styles.preferenceSubtitle}>
                Keep history of translated messages
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
              <Text style={styles.preferenceTitle}>Preferred Language</Text>
              <Text style={styles.preferenceSubtitle}>
                Language for app interface
              </Text>
            </View>
          </View>
          <View style={styles.languageDisplay}>
            <Text style={styles.languageText}>{language}</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#666"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.languageModal}>
            <View style={styles.languageModalHeader}>
              <Text style={styles.languageModalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item}
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  languageModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  languageModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  languageModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  languageOptionText: {
    fontSize: 16,
    color: "#333",
  },
});
