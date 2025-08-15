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

import { formatDateHistory } from "@/utils/formatDate";
import MessageHistoryModal from "@/components/message/MessageHistoryModal";
import SkeletonLoader from "@/components/translate/SkeletonLoader";
import { mockMessageHistory } from "@/mocks/message";
import { MessageHistoryItem } from "@/components/message/types";

// Skeleton component for loading state
const renderSkeletonItem = ({ index }: { index: number }) => (
  <View key={index} style={styles.historyCard}>
    <View style={styles.cardHeader}>
      <SkeletonLoader
        height={16}
        width="60%"
        borderRadius={4}
        marginBottom={0}
      />
      <SkeletonLoader
        height={12}
        width={60}
        borderRadius={6}
        marginBottom={0}
      />
    </View>

    <SkeletonLoader height={14} width="90%" borderRadius={4} marginBottom={4} />

    <SkeletonLoader height={14} width="75%" borderRadius={4} marginBottom={0} />
  </View>
);

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<MessageHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MessageHistoryItem | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // In real app, load from AsyncStorage
    loadHistory();
  }, []);

  const loadHistory = async () => {
    // Mock loading delay
    setTimeout(() => {
      setHistory(mockMessageHistory);
      setIsLoading(false);
    }, 1500);
  };

  const handleItemPress = (item: MessageHistoryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const renderHistoryItem = ({ item }: { item: MessageHistoryItem }) => (
    <TouchableOpacity
      style={styles.historyCard}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.dateText}>
          {formatDateHistory(item.date, i18n.language, t)}
        </Text>
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

      {isLoading ? (
        <FlatList
          data={Array.from({ length: 6 }, (_, index) => index)}
          keyExtractor={(item) => item.toString()}
          renderItem={renderSkeletonItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="history" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {t("message:history.noMessages")}
              </Text>
            </View>
          }
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <MessageHistoryModal
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
});
