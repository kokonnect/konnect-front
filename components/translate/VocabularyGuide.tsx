import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { VocabularyItem as VocabularyItemType } from "./types";
import SkeletonLoader from "./SkeletonLoader";

const primaryColor = "#00B493";

interface VocabularyGuideProps {
  vocabulary?: VocabularyItemType[];
  isLoading?: boolean;
  onPress?: () => void;
}

export default function VocabularyGuide({
  vocabulary = [],
  isLoading = false,
  onPress,
}: VocabularyGuideProps) {
  const { t } = useTranslation();

  // Don't render if no vocabulary items and not loading
  if (!isLoading && (!vocabulary || vocabulary.length === 0)) {
    return null;
  }

  const previewItems = vocabulary.slice(0, 2);

  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <SkeletonLoader height={14} width="60%" marginBottom={12} />
      <SkeletonLoader height={12} width="80%" marginBottom={8} />
      <SkeletonLoader height={12} width="70%" marginBottom={0} />
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="book-education"
            size={20}
            color={primaryColor}
          />
          <Text style={styles.headerTitle}>
            {t("translate:vocabulary.title")}
          </Text>
          {!isLoading && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{vocabulary.length}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.viewAllText}>{isLoading ? " " : t("more")}</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
        </View>
      </View>

      <View style={styles.preview}>
        {isLoading ? (
          renderLoadingSkeleton()
        ) : (
          <>
            <Text style={styles.description}>
              {t("translate:vocabulary.description")}
            </Text>
            {previewItems.length > 0 && (
              <View style={styles.previewList}>
                {previewItems.map((item, index) => (
                  <View key={item.id} style={styles.previewItem}>
                    <Text style={styles.previewTerm} numberOfLines={1}>
                      {item.korean}
                    </Text>
                    <Text style={styles.previewTranslation} numberOfLines={1}>
                      {item.english}
                    </Text>
                  </View>
                ))}
                {vocabulary.length > 2 && (
                  <Text style={styles.moreText}>
                    +{vocabulary.length - 2} more terms
                  </Text>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  badge: {
    backgroundColor: `${primaryColor}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    color: primaryColor,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: primaryColor,
    fontWeight: "500",
    marginRight: 4,
  },
  preview: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  previewList: {
    gap: 8,
  },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAF9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: primaryColor,
  },
  previewTerm: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    minWidth: 80,
  },
  previewTranslation: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  moreText: {
    fontSize: 12,
    color: primaryColor,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 2,
    fontStyle: "italic",
  },
  skeletonContainer: {
    padding: 4,
  },
});
