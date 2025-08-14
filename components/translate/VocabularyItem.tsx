import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { VocabularyItem as VocabularyItemType } from "./types";

const primaryColor = "#00B493";

interface VocabularyItemProps {
  item: VocabularyItemType;
}

export default function VocabularyItem({ item }: VocabularyItemProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.vocabularyItem}>
      <View style={styles.vocabularyHeader}>
        <Text style={styles.koreanText}>{item.korean}</Text>
        <Text style={styles.romanization}>{item.romanization}</Text>
      </View>
      <Text style={styles.englishText}>{item.english}</Text>
      <Text style={styles.description}>{item.description}</Text>
      {item.example && (
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>{t("translate:vocabulary.example")}:</Text>
          <Text style={styles.exampleText}>{item.example}</Text>
          {item.exampleTranslation && (
            <Text style={styles.exampleTranslation}>→ {item.exampleTranslation}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  vocabularyItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: primaryColor,
  },
  vocabularyHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
    gap: 8,
  },
  koreanText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  romanization: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  englishText: {
    fontSize: 16,
    fontWeight: "500",
    color: primaryColor,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  exampleContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  exampleLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
    fontWeight: "500",
  },
  exampleText: {
    fontSize: 13,
    color: "#444",
    marginBottom: 2,
  },
  exampleTranslation: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
});