import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { showAlert } from "@/utils/alert";

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
import {
  mockTranslationResult,
  mockTranslationHistory,
  createMockUploadedFile,
} from "@/mocks/translate";

export default function TranslateScreen() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
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
  const [recentTranslations, setRecentTranslations] = useState<
    TranslationResult[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const { t } = useTranslation();

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
    showAlert(
      "Image Upload",
      "Image upload functionality will be handled by UploadButtons component",
    );
  };

  const handlePdfUpload = () => {
    showAlert(
      "PDF Upload",
      "PDF upload functionality requires expo-document-picker package",
    );
    setTimeout(() => {
      const uploadedFile = createMockUploadedFile("document.pdf", "pdf");
      setUploadedFile(uploadedFile);
      startTranslation();
    }, 1000);
  };

  const handleCameraCapture = () => {
    showAlert(
      "Camera",
      "Camera functionality requires expo-image-picker package",
    );
    setTimeout(() => {
      const uploadedFile = createMockUploadedFile("photo_capture.jpg", "image");
      setUploadedFile(uploadedFile);
      startTranslation();
    }, 1000);
  };

  const handleGallerySelect = () => {
    showAlert(
      "Gallery",
      "Gallery functionality requires expo-image-picker package",
    );
    setTimeout(() => {
      const uploadedFile = createMockUploadedFile(
        "selected_image.jpg",
        "image",
      );
      setUploadedFile(uploadedFile);
      startTranslation();
    }, 1000);
  };

  const startTranslation = () => {
    setIsTranslating(true);
    setShowWarning(true); // Reset warning for new translation

    setTimeout(() => {
      setTranslationResult(mockTranslationResult);
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
      setTranslationResult(mockTranslationResult);
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
            fullText={translationResult.fullText || ""}
            originalText={translationResult.originalText || ""}
            isLoading={isRetranslating}
          />
        );
      case "events":
        return (
          <TranslationEvents
            events={translationResult.events || []}
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
            onCameraCapture={handleCameraCapture}
            onGallerySelect={handleGallerySelect}
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
});
