import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import SkeletonLoader from "@/components/translate/SkeletonLoader";
import TranslationHistoryModal from "@/components/translate/TranslationHistoryModal";
import { formatDateHistory } from "@/utils/formatDate";
import { TranslationResult } from "@/types";
import { useTranslationHistory } from "@/hooks";
import { mapHistoryToTranslationResults } from "@/utils/historyMapper";
import { showAlert } from "@/utils/alert";

const primaryColor = "#00B493";

// Helper function
const getDocumentIcon = (type: "pdf" | "image") => {
  return type === "pdf" ? "file-pdf-box" : "image";
};

const renderSkeletonItem = ({ index }: { index: number }) => (
  <View key={index} style={styles.historyCard}>
    <View style={styles.cardHeader}>
      <View style={styles.titleContainer}>
        <View style={styles.skeletonIconContainer}>
          <SkeletonLoader
            height={20}
            width={20}
            borderRadius={4}
            marginBottom={0}
          />
        </View>
        <SkeletonLoader
          height={16}
          width="70%"
          borderRadius={4}
          marginBottom={0}
        />
      </View>
      <View style={styles.metaInfo}>
        <SkeletonLoader
          height={12}
          width={50}
          borderRadius={6}
          marginBottom={4}
        />
        <SkeletonLoader
          height={12}
          width={60}
          borderRadius={6}
          marginBottom={0}
        />
      </View>
    </View>

    <SkeletonLoader
      height={14}
      width="100%"
      borderRadius={4}
      marginBottom={4}
    />
    <SkeletonLoader height={14} width="85%" borderRadius={4} marginBottom={8} />

    <View style={styles.skeletonEventContainer}>
      <SkeletonLoader
        height={16}
        width={100}
        borderRadius={8}
        marginBottom={0}
      />
    </View>
  </View>
);

const createRenderHistoryItem =
  (
    getDocumentIcon: (type: "pdf" | "image") => "file-pdf-box" | "image",
    handleItemPress: (item: TranslationResult) => void,
    formatDateHistory: (date: Date, language: string, t: any) => string,
    i18n: any,
    t: any,
  ) =>
  ({ item }: { item: TranslationResult }) => (
    <TouchableOpacity
      style={styles.historyCard}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name={getDocumentIcon(item.fileType)}
            size={20}
            color={primaryColor}
            style={styles.documentIcon}
          />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <View style={styles.metaInfo}>
          <Text style={styles.dateText}>
            {formatDateHistory(new Date(item.datetime), i18n.language, t)}
          </Text>
        </View>
      </View>

      <Text style={styles.summaryPreview} numberOfLines={2}>
        {item.summary}
      </Text>

      {item.events && item.events.length > 0 && (
        <View style={styles.eventsPreview}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={14}
            color={primaryColor}
            style={styles.calendarIcon}
          />
          <Text style={styles.eventsText}>
            {t("translate:history.eventsFound", { count: item.events.length })}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

export default function DocumentHistoryScreen() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<TranslationResult | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const { t, i18n } = useTranslation();
  
  // Use translation history hook
  const { history, isLoadingHistory, historyError, fetchHistory } = useTranslationHistory();
  
  // Convert API history to legacy format for UI compatibility
  const translationResults = mapHistoryToTranslationResults(history);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        await fetchHistory();
      } catch (error) {
        showAlert("Error", "Failed to load translation history");
      }
    };
    
    loadHistory();
  }, [fetchHistory]);

  const handleItemPress = (item: TranslationResult) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Create render function with current context
  const renderHistoryItem = createRenderHistoryItem(
    getDocumentIcon,
    handleItemPress,
    formatDateHistory,
    i18n,
    t,
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
        <Text style={styles.title}>{t("translate:history.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoadingHistory ? (
        <View style={styles.listContent}>
          {[0, 1, 2, 3, 4].map((index) => renderSkeletonItem({ index }))}
        </View>
      ) : (
        <FlatList
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="file-document-multiple"
                size={64}
                color="#ccc"
              />
              <Text style={styles.emptyText}>
                {t("translate:history.noHistory")}
              </Text>
            </View>
          }
          data={translationResults}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TranslationHistoryModal
        visible={showModal}
        selectedItem={selectedItem}
        onClose={() => setShowModal(false)}
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
  skeletonIconContainer: {
    marginRight: 8,
  },
  skeletonEventContainer: {
    alignSelf: "flex-start",
  },
});
