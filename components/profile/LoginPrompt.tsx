import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const primaryColor = "#00B493";

interface LoginPromptProps {
  onSignInPress?: () => void;
}

export default function LoginPrompt({ onSignInPress }: LoginPromptProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <View style={styles.loginPrompt}>
        <MaterialCommunityIcons name="account-circle" size={64} color="#ccc" />
        <Text style={styles.loginTitle}>{t("profile:loginPrompt.title")}</Text>
        <Text style={styles.loginSubtitle}>
          {t("profile:loginPrompt.description")}
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={onSignInPress}>
          <Text style={styles.loginButtonText}>
            {t("profile:loginPrompt.loginButton")}
          </Text>
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
