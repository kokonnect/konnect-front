import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/auth/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const primaryColor = "#00B493";

export default function AddChildScreen() {
  const router = useRouter();
  const { user, addChild } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [addedChildren, setAddedChildren] = useState<
    {
      id: string;
      name: string;
      birthDate: string;
      school: string;
      grade: string;
    }[]
  >([]);

  // Child form states - matching profile edit structure
  const [childName, setChildName] = useState("");
  const [childBirthdate, setChildBirthdate] = useState(new Date());
  const [childSchool, setChildSchool] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [childClass, setChildClass] = useState("");
  const [childTeacherName, setChildTeacherName] = useState("");

  const resetForm = () => {
    setChildName("");
    setChildBirthdate(new Date());
    setChildSchool("");
    setChildGrade("");
    setChildClass("");
    setChildTeacherName("");
  };

  const handleAddChild = async () => {
    if (!childName.trim() || !childSchool.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Create child object - matching profile edit structure
      const newChild = {
        id: `child_${Date.now()}`,
        name: childName,
        birthDate: childBirthdate.toISOString(),
        school: childSchool,
        grade: childGrade,
      };

      // Add child to user profile and local state
      addChild(newChild);
      setAddedChildren((prev) => [...prev, newChild]);

      // Reset form for next child
      resetForm();
      setIsLoading(false);

      // Show success message with options
      Alert.alert(
        addedChildren.length === 0 ? "Great!" : "Child Added!",
        `${childName} has been added successfully.`,
        [
          {
            text: "Add Another Child",
            onPress: () => {
              // Form is already reset, user can add another
            },
          },
          {
            text: "Continue to App",
            onPress: () => {
              router.replace("/(tabs)");
            },
          },
        ],
      );
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to add child information. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleContinueToApp = () => {
    if (addedChildren.length === 0) {
      Alert.alert("Add a Child", "Please add at least one child to continue.");
      return;
    }
    router.replace("/(tabs)");
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setChildBirthdate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Complete Your Profile</Text>
          </View>

          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="account-child"
                  size={40}
                  color="#fff"
                />
              </View>
              <Text style={styles.title}>Add Your Child</Text>
              <Text style={styles.subtitle}>
                Welcome {user?.name}! Please add your child&apos;s information
                to get started with Konnect.
              </Text>
            </View>

            {/* Added Children List */}
            {addedChildren.length > 0 && (
              <View style={styles.addedChildrenSection}>
                <Text style={styles.addedChildrenTitle}>
                  Children Added ({addedChildren.length})
                </Text>
                {addedChildren.map((child) => (
                  <View key={child.id} style={styles.addedChildCard}>
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childSchool}>{child.school}</Text>
                      {child.grade && (
                        <Text style={styles.childGrade}>{child.grade}</Text>
                      )}
                    </View>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#00B493"
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Form Container - matching profile edit modal structure */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Child Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={childName}
                  onChangeText={setChildName}
                  placeholder="Enter child's name"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Birthdate</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {formatDate(childBirthdate)}
                  </Text>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={childBirthdate}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>School Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={childSchool}
                  onChangeText={setChildSchool}
                  placeholder="Enter school name"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Grade</Text>
                <TextInput
                  style={styles.textInput}
                  value={childGrade}
                  onChangeText={setChildGrade}
                  placeholder="Enter grade (e.g., 3rd Grade)"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Class</Text>
                <TextInput
                  style={styles.textInput}
                  value={childClass}
                  onChangeText={setChildClass}
                  placeholder="Enter class (e.g., 3A)"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teacher Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={childTeacherName}
                  onChangeText={setChildTeacherName}
                  placeholder="Enter teacher's name"
                  editable={!isLoading}
                />
              </View>

              {/* Primary Action Buttons */}
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleAddChild}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading
                    ? "Adding..."
                    : addedChildren.length === 0
                      ? "Add Child"
                      : "Add Another Child"}
                </Text>
              </TouchableOpacity>

              {/* Continue Button - only show if at least one child is added */}
              {addedChildren.length > 0 && (
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinueToApp}
                  disabled={isLoading}
                >
                  <Text style={styles.continueButtonText}>Continue to App</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Match profile edit background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20, // Match profile edit header
    fontWeight: "600",
    color: "#333",
  },
  skipButton: {
    padding: 4,
  },
  skipButtonText: {
    fontSize: 16,
    color: primaryColor,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 20, // Match profile edit padding
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: primaryColor, // Match profile edit default avatar
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18, // Match profile edit section title
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 20,
  },
  formContainer: {
    gap: 20, // Match profile edit form spacing
  },
  inputGroup: {
    marginBottom: 16,
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#333",
  },
  dateInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: primaryColor,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
  },
  addMoreText: {
    fontSize: 14,
    color: primaryColor,
    fontWeight: "500",
  },
  addedChildrenSection: {
    marginBottom: 24,
  },
  addedChildrenTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  addedChildCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  childSchool: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  childGrade: {
    fontSize: 12,
    color: "#999",
  },
  continueButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 2,
    borderColor: primaryColor,
  },
  continueButtonText: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: "600",
  },
});
