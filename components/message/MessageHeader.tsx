import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MessageHeaderProps {
  title: string;
  subtitle: string;
  onHistoryPress?: () => void;
  showHistoryButton?: boolean;
}

export default function MessageHeader({
  title,
  subtitle,
  onHistoryPress,
  showHistoryButton = true,
}: MessageHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {showHistoryButton && onHistoryPress && (
        <TouchableOpacity style={styles.historyButton} onPress={onHistoryPress}>
          <MaterialCommunityIcons name="history" size={24} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  historyButton: {
    padding: 8,
  },
});
