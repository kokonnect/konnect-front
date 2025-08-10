import { t } from "i18next";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

const primaryColor = "#00B493";
const MAX_CHAR_LIMIT = 500;

interface MessageInputProps {
  userInput: string;
  onInputChange: (text: string) => void;
  onClear: () => void;
  onGenerate: () => void;
  onEditDraft: () => void;
  isTranslating: boolean;
  showTranslation: boolean;
}

export default function MessageInput({
  userInput,
  onInputChange,
  onClear,
  onGenerate,
  onEditDraft,
  isTranslating,
  showTranslation,
}: MessageInputProps) {
  return (
    <View
      style={[
        styles.inputSection,
        showTranslation ? styles.inputSectionShrinked : styles.inputSectionFull,
      ]}
    >
      <View style={styles.inputHeader}>
        <Text style={styles.inputLabel}>{t("message:compose.message")}</Text>
        <Text style={styles.charCount}>
          {userInput.length}/{MAX_CHAR_LIMIT}
        </Text>
      </View>

      <TextInput
        style={[styles.textInput, showTranslation && styles.textInputShrinked]}
        placeholder={t("message:compose.messagePlaceholder")}
        value={userInput}
        onChangeText={(text) => onInputChange(text.slice(0, MAX_CHAR_LIMIT))}
        multiline
        textAlignVertical="top"
        scrollEnabled={true}
        editable={!isTranslating && !showTranslation}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClear}
          disabled={isTranslating || !userInput}
        >
          <Text
            style={[
              styles.clearButtonText,
              (!userInput || isTranslating) && styles.disabledButtonText,
            ]}
          >
            {t("clear")}
          </Text>
        </TouchableOpacity>

        {!showTranslation ? (
          <TouchableOpacity
            style={[
              styles.generateButton,
              (!userInput.trim() || isTranslating) && styles.disabledButton,
            ]}
            onPress={onGenerate}
            disabled={!userInput.trim() || isTranslating}
          >
            <Text style={styles.generateButtonText}>
              {t("message:compose.generate")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editDraftButton}
            onPress={onEditDraft}
            disabled={isTranslating}
          >
            <Text style={styles.editDraftButtonText}>
              {t("message:compose.editDraft")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputSectionFull: {
    flex: 1,
  },
  inputSectionShrinked: {
    flex: 2,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  charCount: {
    fontSize: 14,
    color: "#666",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  textInputShrinked: {
    flex: 1,
    color: "lightgray",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  generateButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: primaryColor,
    alignItems: "center",
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  editDraftButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: primaryColor,
    alignItems: "center",
  },
  editDraftButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: primaryColor,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  disabledButtonText: {
    color: "#ccc",
  },
});
