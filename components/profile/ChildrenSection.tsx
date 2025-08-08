import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Child } from "./types";

const primaryColor = "#00B493";

interface ChildrenSectionProps {
  children: Child[];
}

export default function ChildrenSection({ children }: ChildrenSectionProps) {
  const renderChildCard = ({ item }: { item: Child }) => (
    <View style={styles.childCard}>
      <View style={styles.childHeader}>
        <Text style={styles.childName}>{item.name}</Text>
        <Text style={styles.childGrade}>{item.grade}</Text>
      </View>
      <View style={styles.childInfo}>
        <View style={styles.childInfoRow}>
          <MaterialCommunityIcons name="account" size={16} color="#666" />
          <Text style={styles.childInfoText}>Age: {item.age}</Text>
        </View>
        <View style={styles.childInfoRow}>
          <MaterialCommunityIcons name="door" size={16} color="#666" />
          <Text style={styles.childInfoText}>Class: {item.className}</Text>
        </View>
        <View style={styles.childInfoRow}>
          <MaterialCommunityIcons name="account-tie" size={16} color="#666" />
          <Text style={styles.childInfoText}>Teacher: {item.teacher}</Text>
        </View>
        <View style={styles.childInfoRow}>
          <MaterialCommunityIcons name="school" size={16} color="#666" />
          <Text style={styles.childInfoText}>{item.school}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Children Information</Text>
      <FlatList
        data={children}
        renderItem={renderChildCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.childrenList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  childrenList: {
    paddingHorizontal: 20,
  },
  childCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  childHeader: {
    marginBottom: 12,
  },
  childName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  childGrade: {
    fontSize: 14,
    color: primaryColor,
    fontWeight: "500",
  },
  childInfo: {
    gap: 8,
  },
  childInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  childInfoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
});