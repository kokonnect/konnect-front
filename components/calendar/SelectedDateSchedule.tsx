import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { formatSelectedDate } from "@/utils/formatDate";
import { mockCalendarEvents, CalendarEvent } from "@/mocks";

interface SelectedDateScheduleProps {
  selectedDate: string;
}

// Optimized render function
const createScheduleRenderItem =
  (router: any, t: any) =>
  ({ item }: { item: CalendarEvent }) => (
    <TouchableOpacity
      style={styles.scheduleItem}
      onPress={() => router.push(`/calendar/modify?eventId=${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.scheduleHeader}>
        <Text style={styles.scheduleTitle}>{item.title}</Text>
        {item.isAllDay ? (
          <Text style={styles.scheduleAllDay}>
            {t("calendar:selectedDateSchedule.allDay")}
          </Text>
        ) : (
          <Text style={styles.scheduleTime}>{item.time}</Text>
        )}
        <Text style={styles.scheduleChild}>{item.childName}</Text>
      </View>
      <Text style={styles.scheduleMemo}>{item.description}</Text>
    </TouchableOpacity>
  );

const EmptySchedule = ({ t }: { t: any }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>
      {t("calendar:selectedDateSchedule.noEventsDate")}
    </Text>
    <Text style={styles.emptySubtitle}>
      {t("calendar:selectedDateSchedule.noEventsDescription")}
    </Text>
    {/* <View style={styles.skeletonList}>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </View> */}
  </View>
);

export default function SelectedDateSchedule({
  selectedDate,
}: SelectedDateScheduleProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const scheduleEvents = mockCalendarEvents.filter(
    (event) =>
      new Date(event.date).toDateString() ===
      new Date(selectedDate).toDateString(),
  );

  // Create render function with current router and t function
  const renderScheduleItem = createScheduleRenderItem(router, t);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {formatSelectedDate(selectedDate, i18n.language)}
        </Text>
      </View>

      {scheduleEvents.length > 0 ? (
        <FlatList
          data={scheduleEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderScheduleItem}
          style={styles.list}
          scrollEnabled={false}
        />
      ) : (
        <EmptySchedule t={t} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  list: {
    marginHorizontal: 20,
  },
  scheduleItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 12,
  },
  scheduleTime: {
    fontSize: 14,
    color: "#00B493",
    marginRight: 12,
  },
  scheduleAllDay: {
    fontSize: 14,
    color: "#EA580C",
    fontWeight: "500",
    marginRight: 12,
  },
  scheduleChild: {
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  scheduleMemo: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyContainer: {
    marginHorizontal: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  skeletonList: {
    width: "100%",
  },
  skeletonContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  skeletonTime: {
    width: 60,
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginRight: 12,
  },
  skeletonChild: {
    width: 50,
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  skeletonMemo: {
    width: "80%",
    height: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});
