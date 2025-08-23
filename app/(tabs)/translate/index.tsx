import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { showAlert } from "@/utils/alert";
import { useFileTranslation } from "@/hooks";
import {
  pickImageFromGallery,
  pickImageFromCamera,
  pickPDF,
} from "@/utils/filePicker";

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
import { FileTranslationRequest, FileType } from "@/types/translate";
import { TabType, UploadedFile } from "@/components/translate/types";
import { mockTranslationHistory } from "@/mocks/translate";

export default function TranslateScreen() {
  const router = useRouter();

  // Hook for translation state management
  const {
    currentRequest,
    isTranslating,
    translationResult,
    translationError,
    translateFile,
    clearTranslation,
  } = useFileTranslation();

  // Local UI state (keep for performance)
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [showWarning, setShowWarning] = useState(true);

  // Image upload modal state
  const [showImageModal, setShowImageModal] = useState(false);

  // Calendar modal states
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);

  // Vocabulary modal states
  const [showVocabularyModal, setShowVocabularyModal] = useState(false);

  // Recent translations states
  const [recentTranslations, setRecentTranslations] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const { t } = useTranslation();

  const getUploadedFileFromRequest = (
    request: FileTranslationRequest | null,
  ): UploadedFile | null => {
    if (!request) return null;

    const fileName =
      request.file instanceof FormData
        ? "uploaded_file"
        : request.file.name || "uploaded_file";

    return {
      name: fileName,
      type: request.fileType === FileType.PDF ? "pdf" : "image",
      size: request.file instanceof FormData ? 0 : request.file.size,
    };
  };

  // Load recent translations on component mount
  useEffect(() => {
    const loadRecentTranslations = async () => {
      setIsLoadingHistory(true);

      // Simulate API call delay
      setTimeout(() => {
        setRecentTranslations(mockTranslationHistory);
        setIsLoadingHistory(false);
      }, 1500);
    };

    loadRecentTranslations();
  }, []);

  const handleImageUpload = () => {
    setShowImageModal(true);
  };

  const handlePdfUpload = async () => {
    try {
      const request = await pickPDF();
      if (request) {
        await translateFile(request);
      }
    } catch (error) {
      console.error("PDF translation failed:", error);
      showAlert("Translation Error", "Failed to translate the PDF");
    }
  };

  const handleCameraCapture = async () => {
    try {
      const request = await pickImageFromCamera();
      if (request) {
        setShowImageModal(false);
        await translateFile(request);
      }
    } catch (error) {
      console.error("Camera translation failed:", error);
      showAlert("Translation Error", "Failed to translate the captured image");
    }
  };

  const handleGallerySelect = async () => {
    try {
      const request = await pickImageFromGallery();
      if (request) {
        setShowImageModal(false);
        await translateFile(request);
      }
    } catch (error) {
      console.error("Gallery translation failed:", error);
      showAlert("Translation Error", "Failed to translate the selected image");
    }
  };

  const handleRemoveFile = () => {
    clearTranslation();
    setShowWarning(true);
  };

  const handleAddEvent = (event: any) => {
    setSelectedEventData(event);
    setShowCalendarModal(true);
  };

  const handleDone = () => {
    // Reset to initial state
    clearTranslation();
    setActiveTab("summary");
    setShowWarning(true);
  };

  const handleDismissWarning = () => {
    setShowWarning(false);
  };

  const handleRetranslate = async () => {
    if (!currentRequest) return;

    setActiveTab("summary"); // Reset to summary tab

    try {
      // Re-translate with the current request
      await translateFile(currentRequest);
    } catch (error) {
      console.error("Retranslation failed:", error);
      showAlert("Retranslation Error", "Failed to retranslate the document");
    }
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
    showAlert("Translation", `Opening: ${item.title}`);
  };

  const renderTabContent = () => {
    if (!translationResult) return null;

    switch (activeTab) {
      case "summary":
        return (
          <>
            <TranslationSummary
              summary={translationResult.summary || ""}
              isLoading={isTranslating}
            />
            <VocabularyGuide
              vocabulary={[]} // Vocabulary not available in API yet
              isLoading={isTranslating}
              onPress={() => setShowVocabularyModal(true)}
            />
          </>
        );
      case "fullText":
        return (
          <TranslationFullText
            fullText={translationResult.translatedText || ""}
            originalText={translationResult.extractedText || ""}
            isLoading={isTranslating}
          />
        );
      case "events":
        return (
          <TranslationEvents
            events={[]} // Events not available in API yet
            onAddEvent={handleAddEvent}
            isLoading={isTranslating}
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
          isRetranslating={isTranslating}
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

      {!currentRequest && (
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
          uploadedFile={getUploadedFileFromRequest(currentRequest)}
          isTranslating={isTranslating}
          onRemoveFile={handleRemoveFile}
        />

        {/* Show translation error if exists */}
        {translationError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Translation Error: {translationError}
            </Text>
          </View>
        )}

        {renderTranslationResults()}
      </View>

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
        vocabulary={[]} // Vocabulary not available in API yet
        isLoading={isTranslating}
      />

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
              <MaterialCommunityIcons name="camera" size={24} color="#00B493" />
              <Text style={styles.modalOptionText}>
                {t("translate:upload.takePhoto")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleGallerySelect}
            >
              <MaterialCommunityIcons name="image" size={24} color="#00B493" />
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
  errorContainer: {
    backgroundColor: "#fee",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f44",
  },
  errorText: {
    color: "#c44",
    fontSize: 14,
    fontWeight: "500",
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
