import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SkeletonLoader from "./SkeletonLoader";

interface TranslationSummaryProps {
  summary: string;
  isLoading?: boolean;
}

export default function TranslationSummary({
  summary,
  isLoading = false,
}: TranslationSummaryProps) {
  if (isLoading) {
    return (
      <View style={styles.tabContent}>
        <View style={styles.skeletonContainer}>
          <SkeletonLoader height={16} width="100%" marginBottom={12} />
          <SkeletonLoader height={16} width="90%" marginBottom={12} />
          <SkeletonLoader height={16} width="95%" marginBottom={12} />
          <SkeletonLoader height={16} width="85%" marginBottom={0} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    marginBottom: 4,
    flex: 1,
  },
  summaryText: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  skeletonContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
