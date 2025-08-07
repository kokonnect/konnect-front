import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";

const primaryColor = "#00B493";
const MAX_CHAR_LIMIT = 500;

// Mock translation function - replace with actual API call
const mockTranslate = async (text: string): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock Korean translation
  const mockTranslations: { [key: string]: string } = {
    hello: "안녕하세요",
    "thank you": "감사합니다",
    "my child will be absent today": "오늘 저희 아이가 결석할 예정입니다",
    "can we schedule a meeting": "미팅 일정을 잡을 수 있을까요",
  };

  // Simple mock translation logic
  const lowerText = text.toLowerCase();
  for (const [eng, kor] of Object.entries(mockTranslations)) {
    if (lowerText.includes(eng)) {
      return text.toLowerCase().replace(eng, kor);
    }
  }

  // Default mock translation
  return `[번역됨] ${text}`;
};

// Mock storage functions - replace with AsyncStorage
const mockStorage = {
  history: [] as {
    id: string;
    original: string;
    translated: string;
    date: Date;
  }[],

  async saveTranslation(original: string, translated: string) {
    const item = {
      id: Date.now().toString(),
      original,
      translated,
      date: new Date(),
    };
    this.history.unshift(item);
    // In real app, save to AsyncStorage here
    return item;
  },

  async getHistory() {
    // In real app, load from AsyncStorage here
    return this.history;
  },
};

export default function ComposeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [userInput, setUserInput] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Handle prefilled data from history
  useEffect(() => {
    if (params.prefillOriginal) {
      setUserInput(params.prefillOriginal as string);
    }
    if (params.prefillTranslated) {
      setTranslatedText(params.prefillTranslated as string);
      setShowTranslation(true);
    }
  }, [params]);

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setIsTranslating(true);
    setShowTranslation(true);

    try {
      const translation = await mockTranslate(userInput);
      setTranslatedText(translation);

      // Save to history
      await mockStorage.saveTranslation(userInput, translation);
    } catch {
      Alert.alert("Error", "Failed to translate. Please try again.");
      setShowTranslation(false);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClear = () => {
    setUserInput("");
    setTranslatedText("");
    setShowTranslation(false);
  };

  const handleEditDraft = () => {
    setShowTranslation(false);
  };

  const handleCopyTranslation = async () => {
    try {
      await Clipboard.setStringAsync(translatedText);
      Alert.alert("Copied", "Translation copied to clipboard");
    } catch {
      Alert.alert("Error", "Failed to copy text");
    }
  };

  const handleTTS = () => {
    if (translatedText) {
      // Note: expo-speech would be used here if available
      // Speech.speak(translatedText, { language: 'ko' });
      Alert.alert("TTS", "Text-to-speech would play the Korean translation");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Create a Custom Message</Text>
          <Text style={styles.subtitle}>
            Draft messages for teacher communication in your language
          </Text>
        </View>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push("/(tabs)/message/history")}
        >
          <MaterialCommunityIcons name="history" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* User Input Section */}
        <View
          style={[
            styles.inputSection,
            showTranslation
              ? styles.inputSectionShrinked
              : styles.inputSectionFull,
          ]}
        >
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>Your Message</Text>
            <Text style={styles.charCount}>
              {userInput.length}/{MAX_CHAR_LIMIT}
            </Text>
          </View>

          <TextInput
            style={[
              styles.textInput,
              showTranslation && styles.textInputShrinked,
            ]}
            placeholder="Type your message here..."
            value={userInput}
            onChangeText={(text) => setUserInput(text.slice(0, MAX_CHAR_LIMIT))}
            multiline
            textAlignVertical="top"
            scrollEnabled={true}
            editable={!isTranslating && !showTranslation}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              disabled={isTranslating || !userInput}
            >
              <Text
                style={[
                  styles.clearButtonText,
                  (!userInput || isTranslating) && styles.disabledButtonText,
                ]}
              >
                Clear
              </Text>
            </TouchableOpacity>

            {!showTranslation ? (
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  (!userInput.trim() || isTranslating) && styles.disabledButton,
                ]}
                onPress={handleGenerate}
                disabled={!userInput.trim() || isTranslating}
              >
                <Text style={styles.generateButtonText}>Generate</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.editDraftButton}
                onPress={handleEditDraft}
                disabled={isTranslating}
              >
                <Text style={styles.editDraftButtonText}>Edit Draft</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Translation Section */}
        {showTranslation && (
          <View style={styles.translationSection}>
            <Text style={styles.translationLabel}>Korean Translation</Text>

            {isTranslating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={primaryColor} />
                <Text style={styles.loadingText}>Translating...</Text>
              </View>
            ) : (
              <>
                <TextInput
                  style={styles.translationInput}
                  value={translatedText}
                  onChangeText={setTranslatedText}
                  multiline
                  textAlignVertical="top"
                />

                <View style={styles.translationActions}>
                  <TouchableOpacity
                    style={styles.ttsButton}
                    onPress={handleTTS}
                  >
                    <MaterialCommunityIcons
                      name="volume-high"
                      size={20}
                      color="#666"
                    />
                    <Text style={styles.ttsButtonText}>TTS</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={handleCopyTranslation}
                  >
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
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
