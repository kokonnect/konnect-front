import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import UserPreference from "@/components/profile/UserPreference";
import { useAuth } from "@/components/auth/AuthContext";

const primaryColor = "#00B493";

interface Child {
  id: string;
  name: string;
  birthdate: Date;
  school: string;
  grade: string;
  class: string;
  teacherName: string;
}

interface UserProfile {
  name: string;
  children: Child[];
  avatar?: string;
}

// Mock user data (would come from state management in real app)
const mockUser: UserProfile = {
  name: "Sarah Johnson",
  avatar: undefined,
  children: [
    {
      id: "1",
      name: "Emma Johnson",
      birthdate: new Date(2015, 5, 15),
      school: "Greenfield Elementary",
      grade: "3rd Grade",
      class: "3A",
      teacherName: "Ms. Smith",
    },
    {
      id: "2",
      name: "Lucas Johnson",
      birthdate: new Date(2018, 2, 8),
      school: "Greenfield Elementary",
      grade: "Kindergarten",
      class: "K2",
      teacherName: "Mr. Brown",
    },
  ],
};

export default function EditProfileScreen() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    hasChildren,
    addChild: addChildToAuth,
  } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(tabs)/profile");
    }
  }, [isAuthenticated, router]);

  const [name, setName] = useState(user?.name || "");
  const [children, setChildren] = useState(user?.children || []);
  const [showChildModal, setShowChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Show add child modal automatically for new users without children
  useEffect(() => {
    if (isAuthenticated && !hasChildren) {
      setShowChildModal(true);
    }
  }, [isAuthenticated, hasChildren]);

  // Child form states
  const [childName, setChildName] = useState("");
  const [childBirthdate, setChildBirthdate] = useState(new Date());
  const [childSchool, setChildSchool] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [childClass, setChildClass] = useState("");
  const [childTeacherName, setChildTeacherName] = useState("");

  const handleSave = () => {
    // In real app, save to backend/state management
    Alert.alert(
      "Profile Updated",
      "Your profile has been updated successfully",
    );
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const openAddChildModal = () => {
    setEditingChild(null);
    resetChildForm();
    setShowChildModal(true);
  };

  const openEditChildModal = (child: Child) => {
    setEditingChild(child);
    setChildName(child.name);
    setChildBirthdate(child.birthdate);
    setChildSchool(child.school);
    setChildGrade(child.grade);
    setChildClass(child.class);
    setChildTeacherName(child.teacherName);
    setShowChildModal(true);
  };

  const resetChildForm = () => {
    setChildName("");
    setChildBirthdate(new Date());
    setChildSchool("");
    setChildGrade("");
    setChildClass("");
    setChildTeacherName("");
  };

  const handleSaveChild = () => {
    if (!childName.trim() || !childSchool.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const childData: Child = {
      id: editingChild?.id || Date.now().toString(),
      name: childName,
      birthdate: childBirthdate,
      school: childSchool,
      grade: childGrade,
      class: childClass,
      teacherName: childTeacherName,
    };

    if (editingChild) {
      setChildren(
        children.map((child) =>
          child.id === editingChild.id ? childData : child,
        ),
      );
    } else {
      setChildren([...children, childData]);
      // Also add to AuthContext for new children
      addChildToAuth({
        id: childData.id,
        name: childData.name,
        birthDate: childData.birthdate.toISOString(),
        school: childData.school,
        grade: childData.grade,
      });
    }

    setShowChildModal(false);
    resetChildForm();

    // Show success message for first child
    if (!hasChildren) {
      Alert.alert(
        "Welcome to Konnect!",
        "Your child has been added successfully. You can now use all features of the app.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }],
      );
    }
  };

  const handleDeleteChild = () => {
    if (editingChild) {
      Alert.alert(
        "Delete Child",
        `Are you sure you want to remove ${editingChild.name} from your profile?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              setChildren(
                children.filter((child) => child.id !== editingChild.id),
              );
              setShowChildModal(false);
            },
          },
        ],
      );
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
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
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {mockUser.avatar ? (
              <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <MaterialCommunityIcons name="account" size={40} color="#fff" />
              </View>
            )}
            <TouchableOpacity style={styles.avatarEditButton}>
              <MaterialCommunityIcons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarText}>Change Photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.providerInfo}>
              <Text style={styles.emailText}>{user?.email}</Text>
              <View style={styles.providerBadge}>
                <MaterialCommunityIcons
                  name={user?.provider === "kakao" ? "chat" : "google"}
                  size={14}
                  color={user?.provider === "kakao" ? "#3C1E1E" : "#4285F4"}
                />
                <Text
                  style={[
                    styles.providerText,
                    user?.provider === "kakao"
                      ? styles.kakaoText
                      : styles.googleText,
                  ]}
                >
                  {user?.provider === "kakao" ? "Kakao" : "Google"}
                </Text>
              </View>
            </View>
            <Text style={styles.providerNote}>
              Email and login provider cannot be changed
            </Text>
          </View>
        </View>

        {/* Children Section */}
        <View style={styles.childrenSection}>
          <Text style={styles.sectionTitle}>Children Information</Text>
          {children.map((child) => (
            <View key={child.id} style={styles.childBlock}>
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childSchool}>{child.school}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditChildModal(child)}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={18}
                  color={primaryColor}
                />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addChildButton}
            onPress={openAddChildModal}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={primaryColor}
            />
            <Text style={styles.addChildText}>Add Child Information</Text>
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <View style={styles.doneSection}>
          <TouchableOpacity style={styles.doneButton} onPress={handleSave}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Child Form Modal */}
      <Modal
        visible={showChildModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          // Don't allow closing modal if user has no children (must add at least one)
          if (hasChildren) {
            setShowChildModal(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.childModal}>
            <View style={styles.childModalHeader}>
              <Text style={styles.childModalTitle}>
                {!hasChildren
                  ? "Complete Your Profile"
                  : editingChild
                    ? "Edit Child"
                    : "Add Child"}
              </Text>
              {hasChildren && (
                <TouchableOpacity onPress={() => setShowChildModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            {!hasChildren && (
              <View style={styles.welcomeMessage}>
                <Text style={styles.welcomeText}>
                  Welcome! Please add your child's information to get started
                  with Konnect.
                </Text>
              </View>
            )}

            <ScrollView
              style={styles.childForm}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Child Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={childName}
                  onChangeText={setChildName}
                  placeholder="Enter child's name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Birthdate</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  {/* <Text style={styles.dateText}>
                    {formatDate(childBirthdate)}
                  </Text> */}
                  <DateTimePicker
                    value={childBirthdate}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                  />
                  {/* <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#666"
                  /> */}
                </TouchableOpacity>
                {/* {showDatePicker && (
                  <DateTimePicker
                    value={childBirthdate}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )} */}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>School Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={childSchool}
                  onChangeText={setChildSchool}
                  placeholder="Enter school name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Grade</Text>
                <TextInput
                  style={styles.textInput}
                  value={childGrade}
                  onChangeText={setChildGrade}
                  placeholder="Enter grade (e.g., 3rd Grade)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Class</Text>
                <TextInput
                  style={styles.textInput}
                  value={childClass}
                  onChangeText={setChildClass}
                  placeholder="Enter class (e.g., 3A)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teacher Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={childTeacherName}
                  onChangeText={setChildTeacherName}
                  placeholder="Enter teacher's name"
                />
              </View>

              <View style={styles.modalButtons}>
                <View style={styles.actionButtons}>
                  {editingChild && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={handleDeleteChild}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.saveChildButton}
                    onPress={handleSaveChild}
                  >
                    <Text style={styles.saveChildButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: primaryColor,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 14,
    color: "#666",
  },
  formSection: {
    gap: 20,
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
  childrenSection: {
    marginTop: 32,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  childBlock: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  childSchool: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    padding: 8,
  },
  addChildButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: primaryColor,
    gap: 8,
  },
  addChildText: {
    fontSize: 16,
    color: primaryColor,
    fontWeight: "500",
  },
  doneSection: {
    marginTop: 32,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: primaryColor,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  childModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  childModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  childModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  childForm: {
    padding: 20,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
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
  modalButtons: {
    marginTop: 24,
    gap: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff4757",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveChildButton: {
    flex: 1,
    backgroundColor: primaryColor,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveChildButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  emailText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  providerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  providerText: {
    fontSize: 12,
    fontWeight: "500",
  },
  kakaoText: {
    color: "#3C1E1E",
  },
  googleText: {
    color: "#4285F4",
  },
  providerNote: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
  welcomeMessage: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
  },
});
