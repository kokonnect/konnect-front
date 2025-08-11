import React, { ReactNode, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuth } from "@/store/features/auth/authHooks";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireChildren?: boolean;
}

const primaryColor = "#00B493";

export function AuthGuard({
  children,
  fallback,
  requireChildren = false,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, hasChildren } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (requireChildren && !hasChildren) {
      router.replace("/add-child");
    }
  }, [isAuthenticated, hasChildren, requireChildren, router]);

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="lock" size={60} color={primaryColor} />
        <Text style={styles.title}>Authentication Required</Text>
        <Text style={styles.subtitle}>Please sign in to continue</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (requireChildren && !hasChildren) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="account-child"
          size={60}
          color={primaryColor}
        />
        <Text style={styles.title}>Add Your Child</Text>
        <Text style={styles.subtitle}>
          Please add your child's information to continue
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/add-child")}
        >
          <Text style={styles.buttonText}>Add Child</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: primaryColor,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
