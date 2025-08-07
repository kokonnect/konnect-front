import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SkeletonLoader from "./SkeletonLoader";

const primaryColor = "#00B493";

interface RecentTranslationItem {
  id: string;
  title: string;
  date: Date;
  summary: string;
}

interface RecentTranslationsProps {
  translations: RecentTranslationItem[];
  isLoading?: boolean;
  onItemPress?: (item: RecentTranslationItem) => void;
}

export default function RecentTranslations({
  translations,
  isLoading = false,
  onItemPress,
}: RecentTranslationsProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(" ");
    const maxWordsPerLine = 8; // Approximate words per line
    const maxWords = maxLines * maxWordsPerLine;

    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  const renderSkeletonItem = ({ index }: { index: number }) => (
    <View key={index} style={styles.translationItem}>
      <View style={styles.itemContent}>
        <SkeletonLoader height={16} width="70%" marginBottom={4} />
        <SkeletonLoader height={12} width="40%" marginBottom={8} />
        <SkeletonLoader height={14} width="100%" marginBottom={4} />
        <SkeletonLoader height={14} width="80%" marginBottom={0} />
      </View>
    </View>
  );

  const renderTranslationItem = ({ item }: { item: RecentTranslationItem }) => (
    <TouchableOpacity
      style={styles.translationItem}
      onPress={() => onItemPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
        <Text style={styles.itemSummary} numberOfLines={2} ellipsizeMode="tail">
          {truncateText(item.summary)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="translate" size={48} color="#ccc" />
      <Text style={styles.emptyText}>No recent translations</Text>
      <Text style={styles.emptySubtext}>
        Your recent document translations will appear here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Recent Translations</Text>
        {/* <View style={styles.listContainer}> */}
        {[0, 1, 2, 3, 4].map((index) => renderSkeletonItem({ index }))}
        {/* </View> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Recent Translations</Text>
        }
        style={styles.listContainer}
        data={translations}
        keyExtractor={(item) => item.id}
        renderItem={renderTranslationItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        // scrollEnabled={translations.length > 3} // Disable scrolling since we're limiting to 5 items
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  listContainer: {
    // maxHeight: 400, // Limit height to show only a few items
  },
  translationItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  itemContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: primaryColor,
    fontWeight: "500",
    marginBottom: 8,
  },
  itemSummary: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 20,
  },
});
