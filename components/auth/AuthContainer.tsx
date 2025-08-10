import React, { ReactNode, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAppAuth } from "@/store/features/auth/authHooks";

interface AuthContainerProps {
  children: ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  const { isLoading, error, clearAuthError } = useAppAuth();

  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
      const timer = setTimeout(() => {
        clearAuthError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearAuthError]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B493" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
});