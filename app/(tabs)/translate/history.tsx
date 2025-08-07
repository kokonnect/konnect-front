import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import SkeletonLoader from "@/components/translate/SkeletonLoader";

const primaryColor = "#00B493";

interface DocumentHistoryItem {
  id: string;
  title: string;
  documentType: "pdf" | "image";
  originalText: string;
  translatedText: string;
  summary: string;
  events: Array<{
    id: string;
    title: string;
    date: Date;
    description: string;
  }>;
  date: Date;
  fileSize?: string;
}

// Mock function to generate title from content
const generateDocumentTitle = (text: string): string => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("permission") || lowerText.includes("field trip")) {
    return "Field Trip Permission Form";
  } else if (lowerText.includes("newsletter") || lowerText.includes("weekly")) {
    return "Weekly Newsletter";
  } else if (lowerText.includes("exam") || lowerText.includes("test")) {
    return "Exam Schedule";
  } else if (
    lowerText.includes("meeting") ||
    lowerText.includes("conference")
  ) {
    return "Parent-Teacher Conference";
  } else if (lowerText.includes("holiday") || lowerText.includes("vacation")) {
    return "Holiday Notice";
  }
  return "School Document";
};

// Mock data for document translation history
const mockDocumentHistory: DocumentHistoryItem[] = [
  {
    id: "1",
    title: "Field Trip Permission Form",
    documentType: "pdf",
    originalText:
      "Annual field trip to Natural History Museum. Permission form and lunch money required for all students participating in this educational visit. Please sign and return by Friday.",
    translatedText:
      "연간 자연사 박물관 견학. 이 교육적 방문에 참여하는 모든 학생들에게 허가서와 도시락 비용이 필요합니다. 금요일까지 서명하고 반납해 주세요.",
    summary:
      "Annual field trip to Natural History Museum. Permission form and lunch required for all students.",
    events: [
      {
        id: "e1",
        title: "Field Trip",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        description: "Natural History Museum visit",
      },
    ],
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    fileSize: "245 KB",
  },
  {
    id: "2",
    title: "Parent-Teacher Conference Notice",
    documentType: "image",
    originalText:
      "Parent-teacher conference scheduled for next week. Please confirm your availability and preferred time slot. Individual meetings will be 20 minutes each.",
    translatedText:
      "다음 주에 학부모-교사 상담이 예정되어 있습니다. 가능한 시간과 선호하는 시간대를 확인해 주세요. 개별 상담은 각각 20분입니다.",
    summary:
      "Parent-teacher conference scheduled for next week. Please confirm your availability.",
    events: [
      {
        id: "e2",
        title: "Parent-Teacher Conference",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        description: "Individual 20-minute meetings",
      },
    ],
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    fileSize: "1.2 MB",
  },
  {
    id: "3",
    title: "Weekly Newsletter",
    documentType: "pdf",
    originalText:
      "This week's updates include upcoming science fair, library book return reminders, and cafeteria menu changes. PTA meeting scheduled for Thursday evening.",
    translatedText:
      "이번 주 업데이트에는 다가오는 과학 박람회, 도서관 책 반납 알림, 급식 메뉴 변경사항이 포함됩니다. PTA 회의가 목요일 저녁에 예정되어 있습니다.",
    summary:
      "Updates on school activities, upcoming events, and important reminders for parents.",
    events: [
      {
        id: "e3",
        title: "Science Fair",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        description: "Student science project exhibition",
      },
      {
        id: "e4",
        title: "PTA Meeting",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        description: "Thursday evening meeting",
      },
    ],
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    fileSize: "187 KB",
  },
  {
    id: "4",
    title: "Final Exam Schedule",
    documentType: "image",
    originalText:
      "Final examination schedule for the semester. Mathematics on Monday, Science on Wednesday, English on Friday. Please prepare accordingly and arrive 15 minutes early.",
    translatedText:
      "학기 기말고사 일정입니다. 월요일 수학, 수요일 과학, 금요일 영어입니다. 그에 따라 준비하시고 15분 일찍 도착해 주세요.",
    summary:
      "Final exam schedule for the semester. Please check the dates and prepare accordingly.",
    events: [
      {
        id: "e5",
        title: "Math Exam",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        description: "Final mathematics examination",
      },
      {
        id: "e6",
        title: "Science Exam",
        date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 2 weeks + 2 days from now
        description: "Final science examination",
      },
      {
        id: "e7",
        title: "English Exam",
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 2 weeks + 4 days from now
        description: "Final English examination",
      },
    ],
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    fileSize: "892 KB",
  },
  {
    id: "5",
    title: "Holiday Schedule Notice",
    documentType: "pdf",
    originalText:
      "School will be closed for winter holidays from December 22nd to January 8th. Classes resume on January 9th. Have a wonderful holiday season!",
    translatedText:
      "학교는 12월 22일부터 1월 8일까지 겨울 방학으로 휴교합니다. 수업은 1월 9일에 재개됩니다. 즐거운 휴일 보내세요!",
    summary:
      "School will be closed for the upcoming holidays. Please plan accordingly.",
    events: [
      {
        id: "e8",
        title: "Winter Holiday",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        description: "School closed Dec 22 - Jan 8",
      },
    ],
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    fileSize: "156 KB",
  },
];

export default function DocumentHistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<DocumentHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DocumentHistoryItem | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    // Mock loading delay
    setTimeout(() => {
      setHistory(mockDocumentHistory);
      setIsLoading(false);
    }, 2000);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleItemPress = (item: DocumentHistoryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCopyTranslation = async () => {
    if (!selectedItem) return;
    try {
      await Clipboard.setStringAsync(selectedItem.translatedText);
      Alert.alert("Copied", "Translation copied to clipboard");
    } catch {
      Alert.alert("Error", "Failed to copy text");
    }
  };

  const handleCopyOriginal = async () => {
    if (!selectedItem) return;
    try {
      await Clipboard.setStringAsync(selectedItem.originalText);
      Alert.alert("Copied", "Original text copied to clipboard");
    } catch {
      Alert.alert("Error", "Failed to copy text");
    }
  };

  const getDocumentIcon = (type: "pdf" | "image") => {
    return type === "pdf" ? "file-pdf-box" : "image";
  };

  const renderSkeletonItem = ({ index }: { index: number }) => (
    <View key={index} style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.skeletonIconContainer}>
            <SkeletonLoader height={20} width={20} borderRadius={4} marginBottom={0} />
          </View>
          <SkeletonLoader height={16} width="70%" borderRadius={4} marginBottom={0} />
        </View>
        <View style={styles.metaInfo}>
          <SkeletonLoader height={12} width={50} borderRadius={6} marginBottom={4} />
          <SkeletonLoader height={12} width={60} borderRadius={6} marginBottom={0} />
        </View>
      </View>

      <SkeletonLoader height={14} width="100%" borderRadius={4} marginBottom={4} />
      <SkeletonLoader height={14} width="85%" borderRadius={4} marginBottom={8} />

      <View style={styles.skeletonEventContainer}>
        <SkeletonLoader height={16} width={100} borderRadius={8} marginBottom={0} />
      </View>
    </View>
  );

  const renderHistoryItem = ({ item }: { item: DocumentHistoryItem }) => (
    <TouchableOpacity
      style={styles.historyCard}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name={getDocumentIcon(item.documentType)}
            size={20}
            color={primaryColor}
            style={styles.documentIcon}
          />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <View style={styles.metaInfo}>
          <Text style={styles.fileSize}>{item.fileSize}</Text>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
      </View>

      <Text style={styles.summaryPreview} numberOfLines={2}>
        {item.summary}
      </Text>

      {item.events.length > 0 && (
        <View style={styles.eventsPreview}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={14}
            color={primaryColor}
            style={styles.calendarIcon}
          />
          <Text style={styles.eventsText}>
            {item.events.length} event{item.events.length > 1 ? "s" : ""} found
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEventItem = (event: any) => (
    <View key={event.id} style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{formatEventDate(event.date)}</Text>
      </View>
      <Text style={styles.eventDescription}>{event.description}</Text>
    </View>
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
        <Text style={styles.title}>Document Translation History</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.listContent}>
          {[0, 1, 2, 3, 4].map((index) => renderSkeletonItem({ index }))}
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="file-document-multiple"
            size={64}
            color="#ccc"
          />
          <Text style={styles.emptyText}>No document translations yet</Text>
          <Text style={styles.emptySubtext}>
            Your translated documents will appear here
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
                  {selectedItem && formatDate(selectedItem.date)} •{" "}
                  {selectedItem?.fileSize}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalBody}>
                <Text style={styles.fieldLabel}>Translation</Text>
                <View style={styles.textContainer}>
                  <Text style={styles.translatedText}>
                    {selectedItem?.translatedText}
                  </Text>
                </View>

                <Text style={styles.fieldLabel}>Original Text</Text>
                <View style={styles.textContainer}>
                  <Text style={styles.originalText}>
                    {selectedItem?.originalText}
                  </Text>
                </View>

                {selectedItem?.events && selectedItem.events.length > 0 && (
                  <>
                    <Text style={styles.fieldLabel}>
                      Events Found ({selectedItem.events.length})
                    </Text>
                    <View style={styles.eventsContainer}>
                      {selectedItem.events.map(renderEventItem)}
                    </View>
                  </>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyOriginal}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={20}
                  color="#666"
                />
                <Text style={styles.copyButtonText}>Copy Original</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.copyTranslationButton}
                onPress={handleCopyTranslation}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.copyTranslationButtonText}>
                  Copy Translation
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
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  documentIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileSize: {
    fontSize: 12,
    color: primaryColor,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  summaryPreview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  eventsPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${primaryColor}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  calendarIcon: {
    marginRight: 4,
  },
  eventsText: {
    fontSize: 12,
    color: primaryColor,
    fontWeight: "500",
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
    maxHeight: "80%",
    padding: 20,
  },
  modalScrollView: {},
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
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
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
  textContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  translatedText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  originalText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  eventsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  eventItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
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
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  copyButton: {
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
  copyButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  copyTranslationButton: {
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
  copyTranslationButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  skeletonIconContainer: {
    marginRight: 8,
  },
  skeletonEventContainer: {
    alignSelf: "flex-start",
  },
});
