import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TranslateScreen() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const borderColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const handleTranslate = () => {
    // Mock translation - in a real app, this would call a translation API
    setTranslatedText(`Translated: ${sourceText}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Translate</ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <ThemedView style={styles.languageSelector}>
            <TouchableOpacity style={styles.languageButton}>
              <ThemedText>English</ThemedText>
            </TouchableOpacity>
            <IconSymbol size={24} name="arrow.right" color={borderColor} />
            <TouchableOpacity style={styles.languageButton}>
              <ThemedText>Spanish</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView
            style={[styles.inputContainer, { borderColor: borderColor }]}
          >
            <TextInput
              style={[styles.input, { color: borderColor }]}
              placeholder="Enter text to translate..."
              placeholderTextColor="#808080"
              multiline
              value={sourceText}
              onChangeText={setSourceText}
            />
          </ThemedView>

          <TouchableOpacity
            style={styles.translateButton}
            onPress={handleTranslate}
          >
            <ThemedText style={styles.translateButtonText}>Translate</ThemedText>
          </TouchableOpacity>

          {translatedText ? (
            <ThemedView
              style={[styles.outputContainer, { borderColor: borderColor }]}
            >
              <ThemedText style={styles.outputText}>{translatedText}</ThemedText>
            </ThemedView>
          ) : null}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  content: {
    gap: 16,
    paddingHorizontal: 20,
  },
  languageSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  languageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0, 180, 147, 0.1)",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
  },
  translateButton: {
    backgroundColor: "#00B493",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  translateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  outputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    backgroundColor: "rgba(0, 180, 147, 0.05)",
  },
  outputText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
