import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TranslationSummaryProps {
  summary: string;
}

export default function TranslationSummary({ summary }: TranslationSummaryProps) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
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
    marginBottom: 20,
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
});