import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { t } from "i18next";
import MessageHeader from "@/components/message/MessageHeader";
import { showAlert } from "@/utils/alert";
import { mockMessageTemplates, MessageTemplate } from "@/mocks/message";


// Factory functions for render items (defined outside component)
const createRenderFilterTag =
  (
    selectedFilter: string,
    setSelectedFilter: (filter: string) => void,
    t: any,
  ) =>
  (category: string) => {
    const isActive = selectedFilter === category;
    return (
      <TouchableOpacity
        key={category}
        style={[styles.filterTag, isActive && styles.activeFilterTag]}
        onPress={() => setSelectedFilter(category)}
      >
        <Text
          style={[styles.filterTagText, isActive && styles.activeFilterTagText]}
        >
          {t(`message:templates.categories.${category.toLowerCase()}`)}
        </Text>
      </TouchableOpacity>
    );
  };

const createRenderTemplate =
  (
    toggleFavorite: (id: string) => void,
    handleUseTemplate: (template: MessageTemplate) => void,
    t: any,
  ) =>
  ({ item }: { item: MessageTemplate }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateTitleContainer}>
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <MaterialCommunityIcons
              name={item.isFavorite ? "star" : "star-outline"}
              size={24}
              color={item.isFavorite ? "#FFD700" : "#e9e9e9"}
            />
          </TouchableOpacity>
          <View style={styles.templateHeaderText}>
            <Text style={styles.templateTitle}>{item.title}</Text>
            <Text style={styles.categoryText}>
              {t(`message:templates.categories.${item.category.toLowerCase()}`)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.useButton}
          onPress={() => handleUseTemplate(item)}
        >
          <Text style={styles.useButtonText}>
            {t("message:templates.useTemplate")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messagesContainer}>
        <Text style={styles.koreanMessage}>{item.messageKr}</Text>
        <View style={styles.separator} />
        <Text style={styles.englishMessage}>{item.messageEn}</Text>
      </View>
    </View>
  );

export default function TemplateScreen() {
  const [templates, setTemplates] = useState(mockMessageTemplates);
  const [selectedTemplate, setSelectedTemplate] =
    useState<MessageTemplate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editedKoreanText, setEditedKoreanText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Extract unique categories from templates
  const getCategories = () => {
    const categories = Array.from(new Set(templates.map((t) => t.category)));
    return ["All", "Favorite", ...categories];
  };

  // Filter templates based on selected filter
  const getFilteredTemplates = () => {
    if (selectedFilter === "All") {
      return templates;
    }
    if (selectedFilter === "Favorite") {
      return templates.filter((t) => t.isFavorite);
    }
    return templates.filter((t) => t.category === selectedFilter);
  };

  const filteredTemplates = getFilteredTemplates();

  const toggleFavorite = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, isFavorite: !template.isFavorite }
          : template,
      ),
    );
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setEditedKoreanText(template.messageKr);
    setShowModal(true);
  };

  const handleTTS = () => {
    if (editedKoreanText) {
      // Note: expo-speech would be used here if available
      // Speech.speak(editedKoreanText, { language: 'ko' });
      showAlert("TTS", "Text-to-speech would play here");
    }
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(editedKoreanText);
      showAlert("Copied", "Korean text copied to clipboard");
    } catch {
      showAlert("Error", "Failed to copy text");
    }
  };

  // Create render functions using factory functions
  const renderFilterTag = createRenderFilterTag(
    selectedFilter,
    setSelectedFilter,
    t,
  );
  const renderTemplate = createRenderTemplate(
    toggleFavorite,
    handleUseTemplate,
    t,
  );

  return (
    <View style={styles.container}>
      <MessageHeader
        title={t("message:templates.title")}
        subtitle={t("message:templates.description")}
        showHistoryButton={false}
      />

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
          data={getCategories()}
          renderItem={({ item }) => renderFilterTag(item)}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={filteredTemplates}
        keyExtractor={(item) => item.id}
        renderItem={renderTemplate}
        scrollEnabled={true}
        contentContainerStyle={styles.templateList}
        showsVerticalScrollIndicator={false}
      />

      {/* <TouchableOpacity style={styles.addButton}>
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Create New Template</Text>
      </TouchableOpacity> */}

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>{selectedTemplate?.title}</Text>
                <Text style={styles.modalCategory}>
                  {t(
                    `message:templates.categories.${selectedTemplate?.category.toLowerCase()}`,
                  )}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.fieldLabel}>
                {t("message:templates.koreanVersion")}
              </Text>
              <TextInput
                style={styles.koreanTextInput}
                value={editedKoreanText}
                onChangeText={setEditedKoreanText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <Text style={styles.fieldLabel}>
                {t("message:templates.yourLanguageVersion")}
              </Text>
              <Text style={styles.englishText}>
                {selectedTemplate?.messageEn}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ttsButton} onPress={handleTTS}>
                <MaterialCommunityIcons
                  name="volume-high"
                  size={20}
                  color="#666"
                />
                <Text style={styles.ttsButtonText}>{t("tts")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.copyButtonText}>
                  {t("message:templates.copyKorean")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  templateList: {
    paddingHorizontal: 20,
  },
  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  templateTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  templateHeaderText: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 4,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  categoryText: {
    backgroundColor: "#00B4931A",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: "#00B493",
    fontWeight: "500",
  },
  messagesContainer: {
    marginTop: 12,
  },
  koreanMessage: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  englishMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  useButton: {
    backgroundColor: "#00B493",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  useButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  favButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#00B493",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalHeaderText: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  modalCategory: {
    backgroundColor: "#00B4931A",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: "#00B493",
    fontWeight: "500",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  koreanTextInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  englishText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  ttsButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ttsButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  copyButton: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "#00B493",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 4,
  },
  filterTag: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeFilterTag: {
    backgroundColor: "#00B4931A",
    borderColor: "#00B493",
  },
  filterTagText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeFilterTagText: {
    color: "#00B493",
    fontWeight: "600",
  },
});
