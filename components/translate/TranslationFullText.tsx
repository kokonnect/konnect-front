import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const primaryColor = "#00B493";

interface TranslationFullTextProps {
  fullText: string;
  originalText: string;
}

export default function TranslationFullText({
  fullText,
  originalText,
}: TranslationFullTextProps) {
  const [showOriginal, setShowOriginal] = useState(false);

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
          {showOriginal ? "Show Translation" : "Show Original"}
        </Text>
      </TouchableOpacity>
      <ScrollView
        style={styles.textScrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.fullText}>
          {showOriginal ? originalText : fullText}
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
    marginBottom: 20,
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
});