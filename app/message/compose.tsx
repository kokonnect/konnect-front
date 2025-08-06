import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  childName: string;
}

const mockTeachers: Teacher[] = [
  { id: "1", name: "Ms. Johnson", subject: "Math", childName: "Emma" },
  { id: "2", name: "Mr. Smith", subject: "English", childName: "Emma" },
  { id: "3", name: "Mrs. Davis", subject: "Science", childName: "Lucas" },
  { id: "4", name: "Mr. Wilson", subject: "History", childName: "Lucas" },
];

export default function ComposeScreen() {
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!selectedTeacher || !subject || !message) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields before sending.",
      );
      return;
    }

    Alert.alert("Message Sent", "Your message has been sent successfully!", [
      {
        text: "OK",
        onPress: () => {
          setSelectedTeacher("");
          setSubject("");
          setMessage("");
        },
      },
    ]);
  };

  const handleSaveDraft = () => {
    Alert.alert("Draft Saved", "Your message has been saved as a draft.");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Compose Message</Text>
        <Text style={styles.sectionSubtitle}>
          Send a message to your child's teacher
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Recipient *</Text>
          <View style={styles.teacherList}>
            {mockTeachers.map((teacher) => (
              <TouchableOpacity
                key={teacher.id}
                style={[
                  styles.teacherCard,
                  selectedTeacher === teacher.id && styles.selectedTeacherCard,
                ]}
                onPress={() => setSelectedTeacher(teacher.id)}
              >
                <View style={styles.teacherInfo}>
                  <Text
                    style={[
                      styles.teacherName,
                      selectedTeacher === teacher.id &&
                        styles.selectedTeacherText,
                    ]}
                  >
                    {teacher.name}
                  </Text>
                  <Text
                    style={[
                      styles.teacherSubject,
                      selectedTeacher === teacher.id &&
                        styles.selectedTeacherSubtext,
                    ]}
                  >
                    {teacher.subject} - {teacher.childName}
                  </Text>
                </View>
                {selectedTeacher === teacher.id && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#00B493"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Subject *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter message subject"
            value={subject}
            onChangeText={setSubject}
            maxLength={100}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Message *</Text>
          <TextInput
            style={[styles.textInput, styles.messageInput]}
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.characterCount}>
            {message.length}/1000 characters
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.draftButton}
            onPress={handleSaveDraft}
          >
            <MaterialCommunityIcons
              name="content-save"
              size={20}
              color="#666"
            />
            <Text style={styles.draftButtonText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <MaterialCommunityIcons name="send" size={20} color="#fff" />
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
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
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  teacherList: {
    gap: 8,
  },
  teacherCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedTeacherCard: {
    borderColor: "#00B493",
    backgroundColor: "#00B4930A",
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  selectedTeacherText: {
    color: "#00B493",
  },
  teacherSubject: {
    fontSize: 14,
    color: "#666",
  },
  selectedTeacherSubtext: {
    color: "#00B493",
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#333",
  },
  messageInput: {
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  draftButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  draftButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  sendButton: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "#00B493",
    padding: 14,
    borderRadius: 8,
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
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
