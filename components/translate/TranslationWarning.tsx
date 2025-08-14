import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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

  if (!showWarning) return null;

  return (
    <View style={styles.container}>
      <View style={styles.gradientBackground}>
        {onDismissWarning && (
          <TouchableOpacity
            onPress={onDismissWarning}
            style={styles.dismissButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="close" size={18} color="#9A3412" />
          </TouchableOpacity>
        )}

        <View style={styles.contentContainer}>
          <View style={styles.warningRow}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={18}
              color="#EA580C"
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>
              {t("translate:warnings.aiTranslation")}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.explanationRow}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={16}
              color="#92400E"
              style={styles.explanationIcon}
            />
            <Text style={styles.explanationText}>
              {t("translate:warnings.explanation")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 1000,
    borderRadius: 12,
    shadowColor: "#EA580C",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientBackground: {
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  dismissButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    zIndex: 1,
  },
  contentContainer: {
    paddingTop: 8,
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    marginTop: 1,
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "500",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#FED7AA",
    marginVertical: 12,
    opacity: 0.5,
  },
  explanationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  explanationIcon: {
    marginTop: 2,
  },
  explanationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#78350F",
    lineHeight: 18,
    opacity: 0.9,
  },
});
