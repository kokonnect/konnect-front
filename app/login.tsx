import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks";

const primaryColor = "#00B493";
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "kakao" | "google" | null
  >(null);

  const handleOAuthLogin = async (provider: "kakao" | "google") => {
    setIsLoading(true);
    setLoadingProvider(provider);

    try {
      // Step 1: Get OAuth authorization token (mock - replace with actual OAuth flow)
      const authToken = await mockGetOAuthToken(provider);

      // Step 2: Exchange auth token with backend for access token
      await login(authToken, provider);

      setIsLoading(false);
      setLoadingProvider(null);

      // Step 3: Navigate to add-child screen for new users
      router.replace("/add-child");
    } catch (error) {
      Alert.alert("Login Error", `Failed to login with ${provider}`);
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  // Mock OAuth token retrieval - replace with actual OAuth implementation
  const mockGetOAuthToken = async (provider: "kakao" | "google") => {
    // Simulate OAuth flow delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `${provider}_auth_token_${Date.now()}`;
  };

  const handleKakaoLogin = () => handleOAuthLogin("kakao");
  const handleGoogleLogin = () => handleOAuthLogin("google");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Brand Section */}
        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name="translate"
              size={60}
              color={primaryColor}
            />
          </View>
          <Text style={styles.brandTitle}>Konnect</Text>
          <Text style={styles.brandSubtitle}>
            Connect with your child's school through seamless translation
          </Text>
        </View>

        {/* Login Buttons Section */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Sign in to get started</Text>

          {/* Kakao Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              styles.kakaoButton,
              isLoading && loadingProvider !== "kakao" && styles.disabledButton,
            ]}
            onPress={handleKakaoLogin}
            disabled={isLoading}
          >
            {loadingProvider === "kakao" ? (
              <ActivityIndicator size="small" color="#3C1E1E" />
            ) : (
              <>
                <MaterialCommunityIcons name="chat" size={24} color="#3C1E1E" />
                <Text style={styles.kakaoButtonText}>Continue with Kakao</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Google Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              styles.googleButton,
              isLoading &&
                loadingProvider !== "google" &&
                styles.disabledButton,
            ]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            {loadingProvider === "google" ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="google"
                  size={24}
                  color="#4285F4"
                />
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Secure authentication powered by Kakao and Google
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  loginContainer: {
    alignItems: "center",
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 32,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
    borderWidth: 1,
    borderColor: "#F5D700",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  disabledButton: {
    opacity: 0.5,
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C1E1E",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  termsText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 24,
    maxWidth: width * 0.8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
