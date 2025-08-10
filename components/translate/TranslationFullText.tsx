import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SkeletonLoader from "./SkeletonLoader";
import { t } from "i18next";

const primaryColor = "#00B493";

interface TranslationFullTextProps {
  fullText: string;
  originalText: string;
  isLoading?: boolean;
}

const escapeMap: { [key: string]: string } = {
  n: "\n",
  t: "\t",
  r: "\r",
  "\\": "\\",
  '"': '"',
  "'": "'",
  b: "\b",
  f: "\f",
  v: "\v",
};

export default function TranslationFullText({
  fullText,
  originalText,
  isLoading = false,
}: TranslationFullTextProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const formatText = (text: string) => {
    return text.replace(
      /\\(n|t|r|\\|"|'|b|f|v)/g,
      (match, char) => escapeMap[char] ?? match,
    );
  };

  if (isLoading) {
    return (
      <View style={styles.tabContent}>
        <View style={styles.skeletonToggle}>
          <SkeletonLoader
            height={12}
            width={80}
            borderRadius={6}
            marginBottom={0}
          />
        </View>
        <View style={styles.skeletonTextContainer}>
          <SkeletonLoader height={14} width="100%" marginBottom={8} />
          <SkeletonLoader height={14} width="95%" marginBottom={8} />
          <SkeletonLoader height={14} width="90%" marginBottom={8} />
          <SkeletonLoader height={14} width="100%" marginBottom={8} />
          <SkeletonLoader height={14} width="85%" marginBottom={8} />
          <SkeletonLoader height={14} width="95%" marginBottom={8} />
          <SkeletonLoader height={14} width="90%" marginBottom={8} />
          <SkeletonLoader height={14} width="80%" marginBottom={0} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowOriginal(!showOriginal)}
      >
        <MaterialCommunityIcons
          name={showOriginal ? "translate" : "translate-off"}
          size={20}
          color={primaryColor}
        />
        <Text style={styles.toggleButtonText}>
          {showOriginal
            ? t("translate:translation.showTranslation")
            : t("translate:translation.showOriginal")}
        </Text>
      </TouchableOpacity>
      <ScrollView
        style={styles.textScrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.fullText}>
          {formatText(showOriginal ? originalText : fullText)}
        </Text>
      </ScrollView>
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
    marginBottom: 4,
    flex: 1,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${primaryColor}10`,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: primaryColor,
  },
  textScrollView: {
    flex: 1,
  },
  fullText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  skeletonToggle: {
    backgroundColor: `${primaryColor}10`,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonTextContainer: {
    flex: 1,
  },
});
