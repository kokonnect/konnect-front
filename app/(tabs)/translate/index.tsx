import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import UploadButtons from "@/components/translate/UploadButtons";
import FileStatus from "@/components/translate/FileStatus";
import TranslationTabs from "@/components/translate/TranslationTabs";
import TranslationSummary from "@/components/translate/TranslationSummary";
import TranslationFullText from "@/components/translate/TranslationFullText";
import TranslationEvents from "@/components/translate/TranslationEvents";
import TranslationWarning from "@/components/translate/TranslationWarning";
import TranslationButtons from "@/components/translate/TranslationButtons";
import CalendarModal from "@/components/translate/CalendarModal";
import RecentTranslations from "@/components/translate/RecentTranslations";
import VocabularyGuide from "@/components/translate/VocabularyGuide";
import VocabularyModal from "@/components/translate/VocabularyModal";
import {
  TranslationResult,
  TabType,
  UploadedFile,
} from "@/components/translate/types";

const primaryColor = "#00B493";

export default function TranslateScreen() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRetranslating, setIsRetranslating] = useState(false);
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [showWarning, setShowWarning] = useState(true);

  // Calendar modal states
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);

  // Vocabulary modal states
  const [showVocabularyModal, setShowVocabularyModal] = useState(false);

  // Recent translations states
  const [recentTranslations, setRecentTranslations] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const { t } = useTranslation();

  // Load recent translations on component mount
  useEffect(() => {
    const loadRecentTranslations = async () => {
      setIsLoadingHistory(true);

      // Simulate API call delay
      setTimeout(() => {
        // Mock data - in real app, this would come from API/storage
        const mockTranslations = [
          {
            id: "1",
            title: "Field Trip Permission Form",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            summary:
              "Annual field trip to Natural History Museum. Permission form and lunch required for all students.",
          },
          {
            id: "2",
            title: "School Event Notification",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            summary:
              "Parent-teacher conference scheduled for next week. Please confirm your availability.",
          },
          {
            id: "3",
            title: "Weekly Newsletter",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            summary:
              "Updates on school activities, upcoming events, and important reminders for parents.",
          },
          {
            id: "4",
            title: "Exam Schedule",
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            summary:
              "Final exam schedule for the semester. Please check the dates and prepare accordingly.",
          },
          {
            id: "5",
            title: "Holiday Notice",
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            summary:
              "School will be closed for the upcoming holidays. Please plan accordingly.",
          },
        ];

        setRecentTranslations(mockTranslations);
        setIsLoadingHistory(false);
      }, 1500);
    };

    loadRecentTranslations();
  }, []);

  const handleImageUpload = () => {
    setShowImageModal(true);
  };

  const handlePdfUpload = () => {
    Alert.alert(
      "PDF Upload",
      "PDF upload functionality requires expo-document-picker package",
    );
    setTimeout(() => {
      const uploadedFile: UploadedFile = {
        name: "document.pdf",
        type: "pdf",
      };
      setUploadedFile(uploadedFile);
      startTranslation();
    }, 1000);
  };

  const handleCameraCapture = () => {
    setShowImageModal(false);
    Alert.alert(
      "Camera",
      "Camera functionality requires expo-image-picker package",
    );
    setTimeout(() => {
      const uploadedFile: UploadedFile = {
        name: "photo_capture.jpg",
        type: "image",
      };
      setUploadedFile(uploadedFile);
      startTranslation();
    }, 1000);
  };

  const handleGallerySelect = () => {
    setShowImageModal(false);
    Alert.alert(
      "Gallery",
      "Gallery functionality requires expo-image-picker package",
    );
    setTimeout(() => {
      const uploadedFile: UploadedFile = {
        name: "selected_image.jpg",
        type: "image",
      };
      setUploadedFile(uploadedFile);
      startTranslation();
    }, 1000);
  };

  const startTranslation = () => {
    setIsTranslating(true);
    setShowWarning(true); // Reset warning for new translation

    setTimeout(() => {
      setTranslationResult({
        summary:
          "School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.",
        fullText:
          "Dear Parents,\\n\\nWe are excited to announce our annual field trip to the Natural History Museum scheduled for August 20th, 2025. All students are required to bring a packed lunch and wear comfortable walking shoes.\\n\\nPlease submit the signed permission form by August 15th. The trip will start at 9:00 AM and we will return by 3:00 PM.\\n\\nBest regards,\\nSchool Administration",
        originalText:
          "학부모님께,\\n\\n2025년 8월 20일로 예정된 자연사 박물관으로의 연례 현장 학습을 알려드리게 되어 기쁩니다. 모든 학생들은 도시락을 지참하고 편안한 운동화를 착용해야 합니다.\\n\\n8월 15일까지 서명된 동의서를 제출해 주시기 바랍니다. 견학은 오전 9시에 시작하여 오후 3시에 돌아올 예정입니다.\\n\\n감사합니다,\\n학교 행정실",
        events: [
          {
            id: "1",
            title: "Field Trip - Natural History Museum",
            date: "2025-08-20",
            time: "9:00 AM",
            description:
              "Annual school field trip. Bring lunch and wear comfortable shoes.",
          },
          {
            id: "2",
            title: "Permission Form Deadline",
            date: "2025-08-15",
            description: "Submit signed permission form for field trip.",
          },
        ],
        vocabulary: [
          {
            id: "v1",
            korean: "학부모",
            romanization: "hakbumo",
            english: "Parents",
            description: "Parents or guardians of students",
            example: "학부모님께 알려드립니다",
            exampleTranslation: "Notice to parents",
          },
          {
            id: "v2",
            korean: "현장학습",
            romanization: "hyeonjang hakseup",
            english: "Field Trip",
            description: "Educational trip outside of school",
            example: "박물관 현장학습이 있습니다",
            exampleTranslation: "There is a field trip to the museum",
          },
          {
            id: "v3",
            korean: "동의서",
            romanization: "dong-uiseo",
            english: "Permission Form",
            description: "Consent or permission document",
            example: "동의서를 제출해 주세요",
            exampleTranslation: "Please submit the permission form",
          },
          {
            id: "v4",
            korean: "도시락",
            romanization: "dosirak",
            english: "Packed Lunch",
            description: "Lunch box or packed meal",
            example: "도시락을 지참해 주세요",
            exampleTranslation: "Please bring a packed lunch",
          },
        ],
      });
      setIsTranslating(false);
    }, 3000);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setTranslationResult(null);
  };

  const handleAddEvent = (event: any) => {
    setSelectedEventData(event);
    setShowCalendarModal(true);
  };

  const handleDone = () => {
    // Save to history first
    if (translationResult && uploadedFile) {
      const historyItem = {
        id: Date.now().toString(),
        fileName: uploadedFile.name,
        fileType: uploadedFile.type,
        summary: translationResult.summary,
        fullText: translationResult.fullText,
        originalText: translationResult.originalText,
        events: translationResult.events,
        date: new Date(),
      };
      console.log("Saved to history:", historyItem);
    }

    // Reset to initial state
    setUploadedFile(null);
    setTranslationResult(null);
    setActiveTab("summary");
    setShowWarning(true);
  };

  const handleDismissWarning = () => {
    setShowWarning(false);
  };

  const handleRetranslate = () => {
    if (!uploadedFile) return;

    setIsRetranslating(true);
    setActiveTab("summary"); // Reset to summary tab

    // Simulate retranslation process
    setTimeout(() => {
      // Generate slightly different translation to show it's working
      setTranslationResult({
        summary:
          "School field trip announcement for Natural History Museum visit on August 20th, 2025. Permission slip and packed lunch are required for all students.",
        fullText:
          "Dear Parents,\\n\\nThis is to inform you about our upcoming educational field trip to the Natural History Museum on August 20th, 2025. All students must bring their own packed lunch and wear comfortable walking shoes.\\n\\nKindly return the signed permission form by August 15th. The trip begins at 9:00 AM and students will return by 3:00 PM.\\n\\nThank you for your cooperation,\\nSchool Administration Team",
        originalText:
          "학부모님께,\\n\\n2025년 8월 20일로 예정된 자연사 박물관으로의 연례 현장 학습을 알려드리게 되어 기쁩니다. 모든 학생들은 도시락을 지참하고 편안한 운동화를 착용해야 합니다.\\n\\n8월 15일까지 서명된 동의서를 제출해 주시기 바랍니다. 견학은 오전 9시에 시작하여 오후 3시에 돌아올 예정입니다.\\n\\n감사합니다,\\n학교 행정실",
        events: [
          {
            id: "1",
            title: "Field Trip - Natural History Museum",
            date: "2025-08-20",
            time: "9:00 AM",
            description:
              "Educational field trip to Natural History Museum. Bring lunch and comfortable shoes.",
          },
          {
            id: "2",
            title: "Permission Form Due",
            date: "2025-08-15",
            description: "Return signed permission form for the field trip.",
          },
        ],
        vocabulary: [
          {
            id: "v1",
            korean: "학부모",
            romanization: "hakbumo",
            english: "Parents",
            description: "Parents or guardians of students",
            example: "학부모님께 알려드립니다",
            exampleTranslation: "Notice to parents",
          },
          {
            id: "v2",
            korean: "현장학습",
            romanization: "hyeonjang hakseup",
            english: "Field Trip",
            description: "Educational trip outside of school",
            example: "박물관 현장학습이 있습니다",
            exampleTranslation: "There is a field trip to the museum",
          },
          {
            id: "v3",
            korean: "동의서",
            romanization: "dong-uiseo",
            english: "Permission Form",
            description: "Consent or permission document",
            example: "동의서를 제출해 주세요",
            exampleTranslation: "Please submit the permission form",
          },
          {
            id: "v4",
            korean: "도시락",
            romanization: "dosirak",
            english: "Packed Lunch",
            description: "Lunch box or packed meal",
            example: "도시락을 지참해 주세요",
            exampleTranslation: "Please bring a packed lunch",
          },
        ],
      });
      setIsRetranslating(false);
    }, 2500);
  };

  // Calendar modal handlers
  const handleCalendarClose = () => {
    setShowCalendarModal(false);
  };

  const handleCalendarSave = () => {
    // Calendar save logic handled by CalendarModal component
  };

  // History navigation handlers
  const handleHistoryPress = () => {
    router.push("/(tabs)/translate/history");
  };

  const handleRecentTranslationPress = (item: any) => {
    // Handle recent translation item press
    Alert.alert("Translation", `Opening: ${item.title}`);
  };

  const renderTabContent = () => {
    if (!translationResult) return null;

    switch (activeTab) {
      case "summary":
        return (
          <>
            <TranslationSummary
              summary={translationResult.summary}
              isLoading={isRetranslating}
            />
            <VocabularyGuide
              vocabulary={translationResult.vocabulary}
              isLoading={isRetranslating}
              onPress={() => setShowVocabularyModal(true)}
            />
          </>
        );
      case "fullText":
        return (
          <TranslationFullText
            fullText={translationResult.fullText}
            originalText={translationResult.originalText}
            isLoading={isRetranslating}
          />
        );
      case "events":
        return (
          <TranslationEvents
            events={translationResult.events}
            onAddEvent={handleAddEvent}
            isLoading={isRetranslating}
          />
        );
      default:
        return null;
    }
  };

  const renderTranslationResults = () => {
    if (!translationResult) return null;

    return (
      <View
        style={styles.resultsContainer}
        // showsVerticalScrollIndicator={false}
        // nestedScrollEnabled={true}
      >
        <TranslationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <View style={styles.tabContentWrapper}>{renderTabContent()}</View>
        <TranslationWarning
          showWarning={showWarning}
          onDismissWarning={handleDismissWarning}
        />
        <TranslationButtons
          onDone={handleDone}
          onRetranslate={handleRetranslate}
          isRetranslating={isRetranslating}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{t("translate:title")}</Text>
            <Text style={styles.headerSubtitle}>
              {t("translate:description")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={handleHistoryPress}
          >
            <MaterialCommunityIcons name="history" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {!uploadedFile && (
        <ScrollView
          contentContainerStyle={styles.initialContent}
          showsVerticalScrollIndicator={false}
        >
          <UploadButtons
            onImageUpload={handleImageUpload}
            onPdfUpload={handlePdfUpload}
          />
          <RecentTranslations
            translations={recentTranslations}
            isLoading={isLoadingHistory}
            onItemPress={handleRecentTranslationPress}
          />
        </ScrollView>
      )}

      <View style={styles.content}>
        <FileStatus
          uploadedFile={uploadedFile}
          isTranslating={isTranslating}
          onRemoveFile={handleRemoveFile}
        />
        {renderTranslationResults()}
      </View>

      {/* Image Upload Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("translate:upload.chooseImageSource")}
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleCameraCapture}
            >
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color={primaryColor}
              />
              <Text style={styles.modalOptionText}>
                {t("translate:upload.takePhoto")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleGallerySelect}
            >
              <MaterialCommunityIcons
                name="image"
                size={24}
                color={primaryColor}
              />
              <Text style={styles.modalOptionText}>
                {t("translate:upload.fromGallery")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalCancelText}>{t("common:cancel")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Calendar Modal */}
      <CalendarModal
        visible={showCalendarModal}
        onClose={handleCalendarClose}
        onSave={handleCalendarSave}
        eventData={selectedEventData}
      />

      {/* Vocabulary Modal */}
      <VocabularyModal
        visible={showVocabularyModal}
        onClose={() => setShowVocabularyModal(false)}
        vocabulary={translationResult?.vocabulary}
        isLoading={isRetranslating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  historyButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  initialContent: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 16,
  },
  tabContentWrapper: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  modalOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});
