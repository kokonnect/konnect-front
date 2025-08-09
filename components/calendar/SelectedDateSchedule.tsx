import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

interface ScheduleEvent {
  id: string;
  title: string;
  time?: string;
  isAllDay?: boolean;
  childName: string;
  memo: string;
}

interface SelectedDateScheduleProps {
  selectedDate: string;
}

// Mock schedule data
const mockScheduleData: { [key: string]: ScheduleEvent[] } = {
  "2025-08-20": [
    {
      id: "1",
      title: "School Field Trip",
      isAllDay: true,
      childName: "Emma",
      memo: "Annual field trip to the Natural History Museum. Pack lunch and wear comfortable shoes.",
    },
    {
      id: "2",
      title: "Parent-Teacher Conference",
      time: "3:30 PM",
      childName: "Emma",
      memo: "Please prepare questions about Emma's progress in mathematics and science subjects.",
    },
    {
      id: "3",
      title: "Soccer Practice",
      time: "6:00 PM",
      childName: "Emma",
      memo: "Soccer practice at the main field. Remember to bring water bottle and cleats.",
    },
  ],
  "2025-08-22": [
    {
      id: "4",
      title: "School Holiday",
      isAllDay: true,
      childName: "Lucas",
      memo: "School closed for professional development day. No classes scheduled.",
    },
    {
      id: "5",
      title: "Science Fair",
      time: "9:00 AM",
      childName: "Lucas",
      memo: "Science fair project presentation. Lucas will demonstrate his volcano experiment.",
    },
  ],
};

// Optimized render function
const createScheduleRenderItem =
  (router: any) =>
  ({ item }: { item: ScheduleEvent }) => (
    <TouchableOpacity
      style={styles.scheduleItem}
      onPress={() => router.push(`/calendar/modify?eventId=${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.scheduleHeader}>
        <Text style={styles.scheduleTitle}>{item.title}</Text>
        {item.isAllDay ? (
          <Text style={styles.scheduleAllDay}>All Day</Text>
        ) : (
          <Text style={styles.scheduleTime}>{item.time}</Text>
        )}
        <Text style={styles.scheduleChild}>{item.childName}</Text>
      </View>
      <Text style={styles.scheduleMemo}>{item.memo}</Text>
    </TouchableOpacity>
  );

const EmptySchedule = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>No events scheduled</Text>
    <Text style={styles.emptySubtitle}>This date has no scheduled events</Text>
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
  const scheduleEvents = mockScheduleData[selectedDate] || [];

  // Create render function with current router
  const renderScheduleItem = createScheduleRenderItem(router);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatDate(selectedDate)}</Text>
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
        <EmptySchedule />
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
