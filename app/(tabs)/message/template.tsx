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
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

interface MessageTemplate {
  id: string;
  title: string;
  messageKr: string;
  messageEn: string;
  category: string;
  lastUsed?: Date;
  isFavorite?: boolean;
}

const mockTemplates: MessageTemplate[] = [
  {
    id: "1",
    title: "Absence Notification",
    messageKr:
      "안녕하세요, 제 아이 [아이 이름]이 [날짜]에 [사유]로 인해 학교를 결석하게 됩니다. 결석을 양해해 주시기 바랍니다.",
    messageEn:
      "Hi, my child [Child Name] will be absent from school on [Date] due to [Reason]. Please excuse their absence.",
    category: "Attendance",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Late Arrival",
    messageKr:
      "안녕하세요, [아이 이름]이 오늘 [사유]로 인해 대략 [시간]에 늦게 등교할 예정입니다.",
    messageEn:
      "Good morning, [Child Name] will be arriving late to school today at approximately [Time] due to [Reason].",
    category: "Attendance",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Early Dismissal Request",
    messageKr:
      "안녕하세요, [사유]로 인해 오늘 [시간]에 [아이 이름]을 일찍 데려가야 합니다. 사무실에서 준비시켜 주세요.",
    messageEn:
      "Hello, I need to pick up [Child Name] early today at [Time] for [Reason]. Please have them ready in the office.",
    category: "Attendance",
    isFavorite: false,
  },
  {
    id: "4",
    title: "Homework Question",
    messageKr:
      "안녕하세요, [아이 이름]이 [날짜]에 내주신 [과목] 숙제에 대해 질문이 있습니다. [질문] 내용을 명확히 해주실 수 있나요?",
    messageEn:
      "Hi, [Child Name] has a question about the [Subject] homework assigned on [Date]. Could you please clarify [Question]?",
    category: "Academic",
    isFavorite: false,
  },
  {
    id: "5",
    title: "Meeting Request",
    messageKr:
      "안녕하세요, [아이 이름]의 학습 진행 상황에 대해 상담을 요청드리고 싶습니다. [날짜] [시간]에 시간이 되시나요?",
    messageEn:
      "Hello, I would like to schedule a meeting to discuss [Child Name]'s progress. Are you available on [Date] at [Time]?",
    category: "Meeting",
    isFavorite: false,
  },
  {
    id: "6",
    title: "Lunch Money Request",
    messageKr:
      "안녕하세요, [아이 이름]이 오늘 점심 도시락을 가져오지 못했습니다. 급식비를 지불하겠습니다.",
    messageEn:
      "Hello, [Child Name] forgot their lunch today. We will pay for the school lunch.",
    category: "General",
    isFavorite: true,
  },
  {
    id: "7",
    title: "Permission Slip",
    messageKr:
      "안녕하세요, [행사명] 관련 동의서를 보내드립니다. 검토 후 서명하여 보내드리겠습니다.",
    messageEn:
      "Hello, I'm sending the permission slip for [Event Name]. I will review, sign, and return it.",
    category: "Permission",
    isFavorite: false,
  },
];

export default function TemplateScreen() {
  const [templates, setTemplates] = useState(mockTemplates);
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
      Alert.alert("TTS", "Text-to-speech would play here");
    }
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(editedKoreanText);
      Alert.alert("Copied", "Korean text copied to clipboard");
    } catch {
      Alert.alert("Error", "Failed to copy text");
    }
  };

  const renderFilterTag = (category: string) => {
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
          {category}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderTemplate = ({ item }: { item: MessageTemplate }) => (
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
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.useButton}
          onPress={() => handleUseTemplate(item)}
        >
          <Text style={styles.useButtonText}>Use</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messagesContainer}>
        <Text style={styles.koreanMessage}>{item.messageKr}</Text>
        <View style={styles.separator} />
        <Text style={styles.englishMessage}>{item.messageEn}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Message Templates</Text>
        <Text style={styles.sectionSubtitle}>
          Quick templates for common messages
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {getCategories().map(renderFilterTag)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTemplates}
        keyExtractor={(item) => item.id}
        renderItem={renderTemplate}
        scrollEnabled={false}
        contentContainerStyle={styles.templateList}
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
                  {selectedTemplate?.category}
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
              <Text style={styles.fieldLabel}>Korean Version</Text>
              <TextInput
                style={styles.koreanTextInput}
                value={editedKoreanText}
                onChangeText={setEditedKoreanText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <Text style={styles.fieldLabel}>English Version</Text>
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
                <Text style={styles.ttsButtonText}>TTS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.copyButtonText}>Copy Korean</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    paddingVertical: 16,
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
