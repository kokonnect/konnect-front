import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  changeLanguage,
  getCurrentLanguage,
  getAvailableLanguages,
} from "@/locales/i18n";

import { Language } from "@/types";

const primaryColor = "#00B493";

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onLanguageChanged?: (languageCode: string) => void;
}

export default function LanguageSelectionModal({
  visible,
  onClose,
  onLanguageChanged,
}: LanguageSelectionModalProps) {
  const { t } = useTranslation("profile");
  const currentLanguage = getCurrentLanguage();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageSelect = async (language: Language) => {
    if (language.code !== currentLanguage) {
      await changeLanguage(language.code);
      onLanguageChanged?.(language.code);
    }
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={styles.languageOption}
      onPress={() => handleLanguageSelect(item)}
    >
      <View style={styles.languageRow}>
        <Text style={styles.languageFlag}>{item.flag}</Text>
        <View style={styles.languageInfo}>
          <Text style={styles.languageName}>{item.nativeName}</Text>
          <Text style={styles.languageSubtext}>{item.name}</Text>
        </View>
      </View>
      {currentLanguage === item.code && (
        <MaterialCommunityIcons name="check" size={24} color={primaryColor} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("preferences.language")}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={availableLanguages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            style={styles.languageList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    maxHeight: 300,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
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
  languageSubtext: {
    fontSize: 14,
    color: "#666",
  },
});
