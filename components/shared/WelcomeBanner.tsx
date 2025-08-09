import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/auth/AuthContext";
import { useTranslation } from "react-i18next";

const primaryColor = "#00B493";

export default function WelcomeBanner() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleLogin = () => {
    router.push("/login");
  };

  // Note: handleLogout is available if needed for future logout functionality
  // const handleLogout = () => {
  //   Alert.alert(t('logoutConfirmTitle'), t('logoutConfirmMessage'), [
  //     {
  //       text: t('cancel'),
  //       style: "cancel",
  //     },
  //     {
  //       text: t('logout'),
  //       onPress: logout,
  //       style: "destructive",
  //     },
  //   ]);
  // };

  if (isAuthenticated && user) {
    return (
      <View style={styles.banner}>
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeText}>
            <Text style={styles.greeting}>{t('welcomeBack')}</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <View style={styles.providerBadge}>
            <MaterialCommunityIcons
              name={user.provider === "kakao" ? "chat" : "google"}
              size={16}
              color={user.provider === "kakao" ? "#3C1E1E" : "#4285F4"}
            />
            <Text
              style={[
                styles.providerText,
                user.provider === "kakao"
                  ? styles.kakaoText
                  : styles.googleText,
              ]}
            >
              {user.provider === "kakao" ? "Kakao" : "Google"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.banner}>
      <View style={styles.guestContainer}>
        <View style={styles.guestText}>
          <Text style={styles.guestGreeting}>{t('welcomeToApp')}</Text>
          <Text style={styles.guestSubtext}>
            {t('auth:login.syncDataAcrossDevices')}
          </Text>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <MaterialCommunityIcons name="login" size={20} color={primaryColor} />
          <Text style={styles.loginButtonText}>{t('signIn')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    color: primaryColor,
    fontWeight: "500",
  },
  providerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
  actionButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  guestContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  guestText: {
    flex: 1,
    marginRight: 16,
  },
  guestGreeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  guestSubtext: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${primaryColor}10`,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: primaryColor,
  },
});
