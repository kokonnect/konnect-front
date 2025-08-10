import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";

import { formatDateHistory } from "@/utils/formatDate";

const primaryColor = "#00B493";

interface HistoryItem {
  id: string;
  title: string;
  original: string;
  translated: string;
  date: Date;
}

interface MessageHistoryModalProps {
  visible: boolean;
  selectedItem: HistoryItem | null;
  onClose: () => void;
}

export default function MessageHistoryModal({
  visible,
  selectedItem,
  onClose,
}: MessageHistoryModalProps) {
  const { t, i18n } = useTranslation();
  const [editedKoreanText, setEditedKoreanText] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setEditedKoreanText(selectedItem.translated);
    }
  }, [selectedItem]);

  const handleCopyKorean = async () => {
    try {
      await Clipboard.setStringAsync(editedKoreanText);
      Alert.alert("Copied", "Korean text copied to clipboard");
    } catch {
      Alert.alert("Error", "Failed to copy text");
    }
  };

  const handleTTS = () => {
    if (editedKoreanText) {
      // Note: expo-speech would be used here if available
      // Speech.speak(editedKoreanText, { language: 'ko' });
      Alert.alert("TTS", "Text-to-speech would play the Korean text");
    }
  };

  const formatDate = (date: Date) => {
    return formatDateHistory(date, i18n.language, t);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
              <Text style={styles.modalDate}>
                {selectedItem && formatDate(selectedItem.date)}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.fieldLabel}>
              {t("message:translation.translatedMessage")}
            </Text>
            <TextInput
              style={styles.koreanTextInput}
              value={editedKoreanText}
              onChangeText={setEditedKoreanText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>
              {t("message:translation.originalMessage")}
            </Text>
            <View style={styles.originalTextContainer}>
              <Text style={styles.originalText}>{selectedItem?.original}</Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.ttsButton} onPress={handleTTS}>
              <MaterialCommunityIcons
                name="volume-high"
                size={20}
                color="#666"
              />
              <Text style={styles.ttsButtonText}>{t("common:tts")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyKorean}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={20}
                color="#fff"
              />
              <Text style={styles.copyButtonText}>
                {t("message:translation.copyTranslation")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  modalDate: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    padding: 4,
    marginLeft: 12,
  },
  modalBody: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  koreanTextInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    textAlignVertical: "top",
    minHeight: 80,
  },
  originalTextContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  originalText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  ttsButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ttsButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  copyButton: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
  copyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
