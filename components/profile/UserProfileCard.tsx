import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { User } from "./types";

const primaryColor = "#00B493";

interface UserProfileCardProps {
  user: User;
  onEditPress: () => void;
}

export default function UserProfileCard({
  user,
  onEditPress,
}: UserProfileCardProps) {
  return (
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
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <MaterialCommunityIcons name="pencil" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
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
});
