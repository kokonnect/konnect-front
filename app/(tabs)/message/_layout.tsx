import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, usePathname, useRouter } from "expo-router";

const primaryColor = "#00B493";

export default function MessageLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const isTemplate =
    pathname === "/message" || pathname === "/message/template";
  const isCompose = pathname === "/message/compose";
  const isHistory = pathname === "/message/history";

  const handleTabPress = (route: string) => {
    // Only navigate if not already on the same route
    if (route === "/message/template" && !isTemplate) {
      router.push(route);
    } else if (route === "/message/compose" && !isCompose) {
      router.push(route);
    }
    // Do nothing if already on the same tab
  };

  return (
    <View style={styles.container}>
      {!isHistory && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, isTemplate && styles.activeTab]}
            onPress={() => handleTabPress("/message/template")}
          >
            <Text style={[styles.tabText, isTemplate && styles.activeTabText]}>
              Template
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, isCompose && styles.activeTab]}
            onPress={() => handleTabPress("/message/compose")}
          >
            <Text style={[styles.tabText, isCompose && styles.activeTabText]}>
              Compose
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none", // Disable animation for instant switching
        }}
      >
        <Stack.Screen name="template" />
        <Stack.Screen name="compose" />
        <Stack.Screen
          name="history"
          // options={{
          //   headerShown: true,
          //   title: "History",
          //   animation: "slide_from_right",
          // }}
        />
        <Stack.Screen name="index" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 4,
    borderRadius: 24,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  activeTab: {
    backgroundColor: `${primaryColor}1A`, // primaryColor/10 (10% opacity)
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: primaryColor,
    fontWeight: "600",
  },
});
