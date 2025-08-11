import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface TranslationWarningProps {
  showWarning?: boolean;
  onDismissWarning?: () => void;
}

export default function TranslationWarning({
  showWarning = true,
  onDismissWarning,
}: TranslationWarningProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Warning Text */}
      {showWarning && (
        <View style={styles.warningContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={16}
            color="#EA580C"
          />
          <Text style={styles.warningText}>
            {t("translate:warnings.aiTranslation")}
          </Text>
          {onDismissWarning && (
            <TouchableOpacity
              onPress={onDismissWarning}
              style={styles.dismissButton}
            >
              <MaterialCommunityIcons name="close" size={16} color="#EA580C" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <Text style={styles.explanationText}>
        {t("translate:warnings.explanation")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
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
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FED7AA",
    marginBottom: 12,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#EA580C",
    fontWeight: "500",
    flex: 1,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    fontStyle: "italic",
  },
});
