import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

interface ScheduleEvent {
  id: string;
  time: string;
  date: string;
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
      time: "3:30 PM",
      date: "Aug 20",
      childName: "Emma",
      memo: "Please prepare questions about Emma's progress in mathematics and science subjects.",
    },
    {
      id: "2",
      time: "6:00 PM",
      date: "Aug 20",
      childName: "Emma",
      memo: "Soccer practice at the main field. Remember to bring water bottle and cleats.",
    },
  ],
  "2025-08-22": [
    {
      id: "3",
      time: "9:00 AM",
      date: "Aug 22",
      childName: "Lucas",
      memo: "Science fair project presentation. Lucas will demonstrate his volcano experiment.",
    },
  ],
};

const SkeletonItem = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonHeader}>
      <View style={styles.skeletonTime} />
      <View style={styles.skeletonChild} />
    </View>
    <View style={styles.skeletonMemo} />
  </View>
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
  const scheduleEvents = mockScheduleData[selectedDate] || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderScheduleItem = ({ item }: { item: ScheduleEvent }) => (
    <View style={styles.scheduleItem}>
      <View style={styles.scheduleHeader}>
        <Text style={styles.scheduleTime}>{item.time}</Text>
        <Text style={styles.scheduleDate}>{item.date}</Text>
        <Text style={styles.scheduleChild}>{item.childName}</Text>
      </View>
      <Text style={styles.scheduleMemo}>{item.memo}</Text>
    </View>
  );

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
  scheduleTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00B493",
    marginRight: 12,
  },
  scheduleDate: {
    fontSize: 14,
    color: "#666",
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
