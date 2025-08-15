import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { isFirstLaunch, isOnboardingCompleted } from "@/utils/storage";
import { shouldShowLanguageOnboarding, initI18n } from "@/locales/i18n";

const primaryColor = "#00B493";
const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      // Initialize i18n first
      await initI18n();

      // Add a minimum splash duration for better UX
      const minSplashTime = new Promise((resolve) => setTimeout(resolve, 2000));

      // Check app state
      const [firstLaunch, onboardingCompleted, showLanguageOnboarding] = await Promise.all([
        isFirstLaunch(),
        isOnboardingCompleted(),
        shouldShowLanguageOnboarding(),
        minSplashTime, // Ensure minimum splash time
      ]);

      console.log("First Launch:", firstLaunch);
      console.log("Onboarding Completed:", onboardingCompleted);
      console.log("Show Language Onboarding:", showLanguageOnboarding);

      // Navigation logic
      if (firstLaunch || !onboardingCompleted || showLanguageOnboarding) {
        // First time user or language not set - go to onboarding
        router.replace("/onboarding");
      } else {
        // Returning user - go to main app
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Error in splash screen:", error);
      // Fallback to onboarding if there's an error
      router.replace("/onboarding");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="translate" size={60} color="#fff" />
          </View>
          <Text style={styles.appName}>Konnect</Text>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: `${primaryColor}05`,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
});
