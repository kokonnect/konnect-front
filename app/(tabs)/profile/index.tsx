import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PreferencesSection from "@/components/profile/UserPreference";
import { useTranslation } from "react-i18next";
import { useAuthAndUser } from "@/hooks";
import { Child, UserProfile } from "@/types";
import { t } from "i18next";

const primaryColor = "#00B493";

// Mock data
const mockUser: UserProfile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  language: "English",
  avatar: undefined, // Will use default avatar
};

const mockChildren: Child[] = [
  {
    id: "1",
    name: "Emma Johnson",
    birthDate: "2015-05-15",
    grade: "3rd Grade",
    school: "Riverside Elementary",
    age: 8,
    className: "3A",
    teacher: "Ms. Rodriguez",
  },
  {
    id: "2",
    name: "Lucas Johnson",
    birthDate: "2013-08-22",
    grade: "5th Grade",
    school: "Riverside Elementary",
    age: 10,
    className: "5B",
    teacher: "Mr. Thompson",
  },
];

const renderChildCard = ({ item }: { item: Child }) => (
  <View style={styles.childCard}>
    <View style={styles.childHeader}>
      <Text style={styles.childName}>{item.name}</Text>
      <Text style={styles.childGrade}>{item.grade}</Text>
    </View>
    <View style={styles.childInfo}>
      <View style={styles.childInfoRow}>
        <MaterialCommunityIcons name="account" size={16} color="#666" />
        <Text style={styles.childInfoText}>
          {t("profile:children.childInfo.age", { age: item.age })}
        </Text>
      </View>
      <View style={styles.childInfoRow}>
        <MaterialCommunityIcons name="door" size={16} color="#666" />
        <Text style={styles.childInfoText}>
          {t("profile:children.childInfo.class", { class: item.className })}
        </Text>
      </View>
      <View style={styles.childInfoRow}>
        <MaterialCommunityIcons name="account-tie" size={16} color="#666" />
        <Text style={styles.childInfoText}>
          {t("profile:children.childInfo.teacher", { teacher: item.teacher })}
        </Text>
      </View>
      <View style={styles.childInfoRow}>
        <MaterialCommunityIcons name="school" size={16} color="#666" />
        <Text style={styles.childInfoText}>
          {t("profile:children.childInfo.school", { school: item.school })}
        </Text>
      </View>
    </View>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthAndUser();

  const UserProfileComponent = () => (
    <View style={styles.section}>
      <View style={styles.userProfile}>
        <View style={styles.avatarContainer}>
          <View style={styles.defaultAvatar}>
            <MaterialCommunityIcons name="account" size={40} color="#fff" />
          </View>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.providerContainer}>
            <MaterialCommunityIcons
              name={user?.provider === "kakao" ? "chat" : "google"}
              size={16}
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
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/(tabs)/profile/edit")}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const LoginPrompt = () => (
    <View style={styles.section}>
      <View style={styles.loginPrompt}>
        <MaterialCommunityIcons name="account-circle" size={64} color="#ccc" />
        <Text style={styles.loginTitle}>{t("profile:loginPrompt.title")}</Text>
        <Text style={styles.loginSubtitle}>
          {t("profile:loginPrompt.description")}
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>
            {t("profile:loginPrompt.loginButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ChildrenSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("profile:children.title")}</Text>
      <FlatList
        data={mockChildren}
        renderItem={renderChildCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.childrenList}
      />
    </View>
  );

  const LogoutSection = () => {
    const handleLogout = () => {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: logout,
          style: "destructive",
        },
      ]);
    };

    return (
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#ff4757" />
          <Text style={styles.logoutButtonText}>{t("logout")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile or Login Prompt */}
        {isAuthenticated ? <UserProfileComponent /> : <LoginPrompt />}

        {/* Children Information - Only show for signed in users */}
        {isAuthenticated && <ChildrenSection />}

        {/* User Preferences */}
        <PreferencesSection />

        {/* Logout Section - Only show for signed in users */}
        {isAuthenticated && <LogoutSection />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  // User Profile Styles
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  defaultAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  providerText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  kakaoText: {
    color: "#3C1E1E",
  },
  googleText: {
    color: "#4285F4",
  },
  editButton: {
    padding: 8,
  },
  // Login Prompt Styles
  loginPrompt: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Children Section Styles
  childrenList: {
    paddingHorizontal: 20,
  },
  childCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  childHeader: {
    marginBottom: 12,
  },
  childName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  childGrade: {
    fontSize: 14,
    color: primaryColor,
    fontWeight: "500",
  },
  childInfo: {
    gap: 8,
  },
  childInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  childInfoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  // Logout Section Styles
  logoutSection: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ff4757",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4757",
  },
  logoutNote: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
  },
});
