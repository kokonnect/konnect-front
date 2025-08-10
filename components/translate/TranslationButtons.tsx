import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { t } from "i18next";

const primaryColor = "#00B493";

interface TranslationButtonsProps {
  onDone: () => void;
  onRetranslate: () => void;
  isRetranslating?: boolean;
}

export default function TranslationButtons({
  onDone,
  onRetranslate,
  isRetranslating = false,
}: TranslationButtonsProps) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.retranslateButton}
        onPress={onRetranslate}
        disabled={isRetranslating}
      >
        <MaterialCommunityIcons
          name="refresh"
          size={18}
          color={isRetranslating ? "#ccc" : primaryColor}
        />
        <Text
          style={[
            styles.retranslateButtonText,
            isRetranslating && styles.disabledButtonText,
          ]}
        >
          {isRetranslating
            ? t("translate:translation.retranslating")
            : t("translate:translation.retranslate")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={onDone}
        disabled={isRetranslating}
      >
        <MaterialCommunityIcons name="check" size={18} color="#fff" />
        <Text style={styles.doneButtonText}>{t("common:done")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 16,
  },
  retranslateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: primaryColor,
    gap: 8,
  },
  retranslateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: primaryColor,
  },
  doneButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: primaryColor,
    gap: 8,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButtonText: {
    color: "#ccc",
  },
});
