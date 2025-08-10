import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const primaryColor = "#00B493";

interface TranslationOutputProps {
  translatedText: string;
  isTranslating: boolean;
  onTextChange: (text: string) => void;
  onCopy: () => void;
  onTTS: () => void;
}

export default function TranslationOutput({
  translatedText,
  isTranslating,
  onTextChange,
  onCopy,
  onTTS,
}: TranslationOutputProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.translationSection}>
      <Text style={styles.translationLabel}>
        {t("message:compose.koreanTranslation")}
      </Text>

      {isTranslating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={styles.loadingText}>
            {t("message:compose.translating")}
          </Text>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.translationInput}
            value={translatedText}
            onChangeText={onTextChange}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.translationActions}>
            <TouchableOpacity style={styles.ttsButton} onPress={onTTS}>
              <MaterialCommunityIcons
                name="volume-high"
                size={20}
                color="#666"
              />
              <Text style={styles.ttsButtonText}>{t("tts")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.copyButton} onPress={onCopy}>
              <MaterialCommunityIcons
                name="content-copy"
                size={20}
                color="#fff"
              />
              <Text style={styles.copyButtonText}>{t("copy")}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
