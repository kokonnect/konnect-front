import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { useTranslation } from "react-i18next";

import MessageHeader from "@/components/message/MessageHeader";
import MessageInput from "@/components/message/MessageInput";
import TranslationOutput from "@/components/message/TranslationOutput";
import { showAlert } from "@/utils/alert";
import { useMessageCompose } from "@/hooks/messageHooks";

const primaryColor = "#00B493";

export default function ComposeScreen() {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const { t } = useTranslation();

  const {
    currentResult,
    isComposing,
    composeError,
    composeMessage,
    clearMessageState,
    setRequest,
    clearError,
  } = useMessageCompose();

  const translatedText = currentResult?.translatedMessage || "";

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    try {
      setRequest({ message: userInput });
      await composeMessage({ message: userInput });
      setShowTranslation(true);
    } catch (error) {
      showAlert("Error", `Failed to compose message: ${error}`);
    }
  };

  const handleClear = () => {
    setUserInput("");
    clearMessageState();
    setShowTranslation(false);
  };

  const handleEditDraft = () => {
    setShowTranslation(false);
  };

  const handleCopyTranslation = async () => {
    try {
      await Clipboard.setStringAsync(translatedText);
      showAlert("Copied", "Translation copied to clipboard");
    } catch {
      showAlert("Error", "Failed to copy text");
    }
  };

  const handleTTS = () => {
    if (translatedText) {
      Speech.speak(translatedText, { language: "ko" });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <MessageHeader
        title={t("message:compose.title")}
        subtitle={t("message:compose.description")}
        showHistoryButton={true}
        onHistoryPress={() => router.push("/(tabs)/message/history")}
      />
      <View style={styles.content}>
        {/* User Input Section */}
        <MessageInput
          userInput={userInput}
          onInputChange={(text) => setUserInput(text)}
          isTranslating={isComposing}
          onClear={handleClear}
          onEditDraft={handleEditDraft}
          onGenerate={handleGenerate}
          showTranslation={showTranslation}
        />

        {/* Translation Section */}

        {showTranslation && (
          <TranslationOutput
            isTranslating={isComposing}
            translatedText={translatedText}
            onCopy={handleCopyTranslation}
            onTTS={handleTTS}
            onTextChange={() => {}}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  historyButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    gap: 16,
  },
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
    // minHeight: 120,
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
  translationSection: {
    flex: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  translationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  translationInput: {
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
  translationActions: {
    flexDirection: "row",
    gap: 12,
  },
  ttsButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ttsButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  copyButton: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
