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
import { useTranslation } from "react-i18next";

import { formatDateHistory } from "@/utils/formatDate";
import { TranslationResult , mockTranslationHistory } from "@/mocks";

export default function RecentTranslation() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const truncateDescription = (text: string, lines: number = 3) => {
    const maxLength = lines * 40; // Approximate characters per line
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const renderRecentTranslationItem = ({
    item,
  }: {
    item: TranslationResult;
  }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>
          {truncateDescription(item.summary || "")}
        </Text>
      </View>
      <Text style={styles.cardDate}>
        {formatDateHistory(item.datetime, i18n.language, t)}
      </Text>
    </View>
  );

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
          <Text style={styles.title}>{t("translate:history.recent")}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/translate")}>
          <Text style={styles.viewAll}>{t("common:more")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={mockTranslationHistory.slice(0, 3)}
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
    paddingBottom: 10,
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
    justifyContent: "space-between",
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
