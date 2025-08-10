import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { t } from "i18next";

const primaryColor = "#00B493";

interface HistoryItem {
  id: string;
  title: string; // AI-generated title
  original: string;
  translated: string;
  date: Date;
}

// Mock data for history with AI-generated titles
const mockHistoryData: HistoryItem[] = [
  {
    id: "1",
    title: "Absence Notification",
    original: "Hello, my child will be absent today due to illness.",
    translated: "안녕하세요, 오늘 저희 아이가 아파서 결석할 예정입니다.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "2",
    title: "Meeting Request",
    original: "Can we schedule a meeting to discuss my child's progress?",
    translated: "제 아이의 학습 진행 상황에 대해 상담을 예약할 수 있을까요?",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "3",
    title: "Thank You Message",
    original: "Thank you for your support with Emma's learning.",
    translated: "Emma의 학습에 대한 선생님의 지원에 감사드립니다.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "4",
    title: "Late Arrival Notice",
    original:
      "Please excuse Lucas for being late today. We had a doctor's appointment.",
    translated:
      "오늘 Lucas가 병원 예약으로 인해 늦었습니다. 양해 부탁드립니다.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editedKoreanText, setEditedKoreanText] = useState("");

  useEffect(() => {
    // In real app, load from AsyncStorage
    loadHistory();
  }, []);

  const loadHistory = async () => {
    // Mock loading delay
    setTimeout(() => {
      setHistory(mockHistoryData);
    }, 100);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return t("common:today");
    if (diffInDays === 1) return t("common:yesterday");
    if (diffInDays < 7) return t("common:daysAgo", { count: diffInDays });

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleItemPress = (item: HistoryItem) => {
    setSelectedItem(item);
    setEditedKoreanText(item.translated);
    setShowModal(true);
  };

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

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.historyCard}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
      </View>

      <Text style={styles.koreanPreview} numberOfLines={1}>
        {item.translated}
      </Text>

      <Text style={styles.originalPreview} numberOfLines={1}>
        {item.original}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("message:history.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="history" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {t("message:history.noMessages")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
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
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
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
                <Text style={styles.originalText}>
                  {selectedItem?.original}
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ttsButton} onPress={handleTTS}>
                <MaterialCommunityIcons
                  name="volume-high"
                  size={20}
                  color="#666"
                />
                <Text style={styles.ttsButtonText}>{t("tts")}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  headerSpacer: {
    width: 32,
  },
  listContent: {
    padding: 20,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  koreanPreview: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "500",
  },
  originalPreview: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
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
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
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
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  originalTextContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  originalText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
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
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ttsButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  copyButton: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
