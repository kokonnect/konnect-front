import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const primaryColor = "#00B493";

interface LoginPromptProps {
  onSignInPress?: () => void;
}

export default function LoginPrompt({ onSignInPress }: LoginPromptProps) {
  return (
    <View style={styles.section}>
      <View style={styles.loginPrompt}>
        <MaterialCommunityIcons name="account-circle" size={64} color="#ccc" />
        <Text style={styles.loginTitle}>Sign in to access your profile</Text>
        <Text style={styles.loginSubtitle}>
          Connect with teachers and manage your children&apos;s information
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={onSignInPress}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
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
});
