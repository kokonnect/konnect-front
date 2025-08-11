import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function Header({ title, icon }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color="#fff"
            style={styles.icon}
          />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00B493",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});
