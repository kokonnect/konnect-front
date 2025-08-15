import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { formatMonthShortDate } from "@/utils/formatDate";
import { CalendarEvent } from "@/types/calendar";

interface UpcomingEventsProps {
  isMain?: boolean;
  showViewAll?: boolean;
  events: CalendarEvent[];
  currentMonth?: string; // Format: "YYYY-MM"
}

const createEventItemRenderer =
  (
    events: CalendarEvent[],
    formatDate: (date: Date, lang: string) => string,
    language: string,
  ) =>
  ({ item, index }: { item: CalendarEvent; index: number }) => (
    <View
      style={[styles.eventItem, index === events.length - 1 && styles.lastItem]}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {formatDate(item.date as Date, language)}
        </Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventMeta}>
          <Text style={styles.eventTime}>{item.time}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.childName}>{item.childName}</Text>
        </View>
      </View>
    </View>
  );

export default function UpcomingEvents({
  showViewAll = true,
  events,
}: UpcomingEventsProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const renderEventItem = createEventItemRenderer(
    events,
    formatMonthShortDate,
    i18n.language,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.title}>{t("calendar:eventList.upcoming")}</Text>
        </View>
        {showViewAll && (
          <TouchableOpacity onPress={() => router.push("/calendar")}>
            <Text style={styles.viewAll}>{t("common:more")}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.eventsList}>
        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t("calendar:eventList.noEventsDescription")}
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={renderEventItem}
          />
        )}
      </View>
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
  eventsList: {
    marginHorizontal: 20,
  },
  eventItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  dateContainer: {
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    color: "#EA580C",
    fontSize: 12,
    fontWeight: "600",
  },
  eventDetails: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    marginHorizontal: 6,
    color: "#999",
  },
  childName: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
