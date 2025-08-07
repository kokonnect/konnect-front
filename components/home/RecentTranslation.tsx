import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface TranslationCard {
  id: string;
  title: string;
  description: string;
  lastViewed: Date;
}

const mockData: TranslationCard[] = [
  {
    id: "1",
    title: "School Notice",
    description:
      "Dear parents, we would like to inform you about the upcoming parent-teacher conference scheduled for next week. Please prepare any questions you may have about your child's progress.",
    lastViewed: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Field Trip Permission",
    description: "Permission slip for the science museum field trip.",
    lastViewed: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "Lunch Menu",
    description:
      "This week's lunch menu includes healthy options with fresh vegetables and fruits. Special dietary requirements can be accommodated upon request.",
    lastViewed: new Date("2024-01-13"),
  },
];

const createRecentTranslationRenderer = (truncateDescription: (text: string, lines?: number) => string, formatDate: (date: Date) => string) => 
  ({ item }: { item: { id: string; title: string; description: string; lastViewed: Date } }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>
        {truncateDescription(item.description)}
      </Text>
      <Text style={styles.cardDate}>{formatDate(item.lastViewed)}</Text>
    </TouchableOpacity>
  );

export default function RecentTranslation() {
  const router = useRouter();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const truncateDescription = (text: string, lines: number = 3) => {
    const maxLength = lines * 40; // Approximate characters per line
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const renderRecentTranslationItem = createRecentTranslationRenderer(truncateDescription, formatDate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.title}>Recent Translation</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/translate")}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={mockData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.carousel}
        renderItem={renderRecentTranslationItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  viewAll: {
    fontSize: 14,
    color: "#00B493",
    fontWeight: "500",
  },
  carousel: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    height: 80,
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 12,
    color: "#999",
  },
});
