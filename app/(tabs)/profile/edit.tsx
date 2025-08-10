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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAuthAndUser } from "@/hooks";
import { Child as BaseChild, UserProfile as BaseUserProfile } from "@/types";
import AddChildrenModal from "@/components/profile/AddChildrenModal";

const primaryColor = "#00B493";

// Extended Child interface for edit form
interface Child extends BaseChild {
  birthdate: Date;
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
      birthDate: "2015-06-15",
      school: "Greenfield Elementary",
      grade: "3rd Grade",
      class: "3A",
      teacherName: "Ms. Smith",
    },
    {
      id: "2",
      name: "Lucas Johnson",
      birthDate: "2018-03-08",
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
  } = useAuthAndUser();

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

  // Child form states
  const [childName, setChildName] = useState("");
  const [childBirthdate, setChildBirthdate] = useState(new Date());
  const [childSchool, setChildSchool] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [childClass, setChildClass] = useState("");
  const [childTeacherName, setChildTeacherName] = useState("");

  const { t } = useTranslation();

  const handleSave = () => {
    // In real app, save to backend/state management
    Alert.alert(
      t("profile:editProfile.successTitle"),
      t("profile:editProfile.successMessage"),
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
      Alert.alert(
        t("error"),
        t("profile:editProfile.validation.requiredWarning"),
      );
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

    resetChildForm();

    setShowChildModal(false);
  };

  const handleDeleteChild = () => {
    if (editingChild) {
      Alert.alert(
        t("profile:children.removeChild"),
        t("profile:children.confirmRemoveMessage", { name: editingChild.name }),
        [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("delete"),
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

  return (
    <SafeAreaView style={styles.container}>
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
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {t("profile:editProfile.form.name")}
            </Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder={t("profile:editProfile.namePlaceholder")}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {t("profile:editProfile.form.email")}
            </Text>
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
              {t("profile:editProfile.emailProviderCantChange")}
            </Text>
          </View>
        </View>

        {/* Children Section */}
        <View style={styles.childrenSection}>
          <Text style={styles.sectionTitle}>{t("profile:children.title")}</Text>
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
            <Text style={styles.addChildText}>
              {t("profile:children.addChild")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <View style={styles.doneSection}>
          <TouchableOpacity style={styles.doneButton} onPress={handleSave}>
            <Text style={styles.doneButtonText}>
              {t("profile:editProfile.form.save")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AddChildrenModal
        showChildModal={showChildModal}
        editingChild={editingChild}
        childName={childName}
        childBirthdate={childBirthdate}
        childSchool={childSchool}
        childGrade={childGrade}
        childClass={childClass}
        childTeacherName={childTeacherName}
        setChildName={setChildName}
        setChildBirthdate={setChildBirthdate}
        setChildSchool={setChildSchool}
        setChildGrade={setChildGrade}
        setChildClass={setChildClass}
        setChildTeacherName={setChildTeacherName}
        handleModalClose={() => setShowChildModal(false)}
        handleSaveChild={handleSaveChild}
        handleDeleteChild={handleDeleteChild}
      />
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
