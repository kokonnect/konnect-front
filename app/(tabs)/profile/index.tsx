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
import { useTranslation } from "react-i18next";

import PreferencesSection from "@/components/profile/UserPreference";
import LoginPrompt from "@/components/profile/LoginPrompt";
import { useAuthAndUser } from "@/hooks";
import { Child, User } from "@/types";
import UserProfileCard from "@/components/profile/UserProfileCard";
import ChildrenSection from "@/components/profile/ChildrenSection";

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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthAndUser();
  const { t } = useTranslation();

  const LogoutSection = () => {
    const handleLogout = () => {
      Alert.alert(t("logoutConfirmTitle"), t("logoutConfirmMessage"), [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("logout"),
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
        {isAuthenticated ? (
          <UserProfileCard
            user={user}
            onEditPress={() => router.push("/profile/edit")}
          />
        ) : (
          <LoginPrompt onSignInPress={() => router.push("/login")} />
        )}

        {/* Children Information - Only show for signed in users */}
        {isAuthenticated && <ChildrenSection childrenList={mockChildren} />}

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
