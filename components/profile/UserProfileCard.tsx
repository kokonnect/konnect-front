import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserProfile } from "./types";

const primaryColor = "#00B493";

interface UserProfileCardProps {
  user: UserProfile;
  onEditPress: () => void;
}

export default function UserProfileCard({ user, onEditPress }: UserProfileCardProps) {
  return (
    <View style={styles.section}>
      <View style={styles.userProfile}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <MaterialCommunityIcons name="account" size={40} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.languageContainer}>
            <MaterialCommunityIcons name="translate" size={16} color="#666" />
            <Text style={styles.userLanguage}>{user.language}</Text>
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
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userLanguage: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
});