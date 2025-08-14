import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";

import { formatDateHistory, formatEventDate } from "@/utils/formatDate";

const primaryColor = "#00B493";

interface DocumentHistoryItem {
  id: string;
  title: string;
  documentType: "pdf" | "image";
  originalText: string;
  translatedText: string;
  summary: string;
  events: {
    id: string;
    title: string;
    date: Date;
    description: string;
  }[];
  date: Date;
  fileSize?: string;
}

interface TranslationHistoryModalProps {
  visible: boolean;
  selectedItem: DocumentHistoryItem | null;
  onClose: () => void;
}

export default function TranslationHistoryModal({
  visible,
  selectedItem,
  onClose,
}: TranslationHistoryModalProps) {
  const { t, i18n } = useTranslation();

  const getDocumentIcon = (type: "pdf" | "image") => {
    return type === "pdf" ? "file-pdf-box" : "image";
  };

  const renderEventItem = (event: any) => (
    <View key={event.id} style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>
          {formatEventDate(event.date, i18n.language)}
        </Text>
      </View>
      <Text style={styles.eventDescription}>{event.description}</Text>
    </View>
  );

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
              <View style={styles.modalTitleContainer}>
                <MaterialCommunityIcons
                  name={
                    selectedItem
                      ? getDocumentIcon(selectedItem.documentType)
                      : "file"
                  }
                  size={20}
                  color={primaryColor}
                  style={styles.modalIcon}
                />
                <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
              </View>
              <Text style={styles.modalDate}>
                {selectedItem &&
                  formatDateHistory(selectedItem.date, i18n.language, t)}{" "}
                • {selectedItem?.fileSize}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalBody}>
              <Text style={styles.fieldLabel}>
                {t("translate:history.translation")}
              </Text>
              <View style={styles.textContainer}>
                <Text style={styles.translatedText}>
                  {selectedItem?.translatedText}
                </Text>
              </View>

              <Text style={styles.fieldLabel}>
                {t("translate:history.original")}
              </Text>
              <View style={styles.textContainer}>
                <Text style={styles.originalText}>
                  {selectedItem?.originalText}
                </Text>
              </View>

              {selectedItem?.events && selectedItem.events.length > 0 && (
                <>
                  <Text style={styles.fieldLabel}>
                    {t("translate:history.events")}
                  </Text>
                  <View style={styles.eventsContainer}>
                    {selectedItem.events.map(renderEventItem)}
                  </View>
                </>
              )}
            </View>
          </ScrollView>
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
  modalScrollView: {
    flexShrink: 1,
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
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  modalIcon: {
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  modalDate: {
    fontSize: 12,
    color: "#666",
  },
  closeButton: {
    padding: 4,
    marginLeft: 12,
  },
  modalBody: {},
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  textContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
  },
  translatedText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  originalText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  eventsContainer: {
    marginTop: 8,
  },
  eventItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  eventDate: {
    fontSize: 12,
    color: primaryColor,
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  copyTranslationButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  copyTranslationButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
