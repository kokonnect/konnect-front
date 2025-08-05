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

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  childName: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Parent-Teacher Conference",
    date: new Date("2024-01-20"),
    time: "3:30 PM",
    childName: "Emma",
  },
  {
    id: "2",
    title: "Science Fair",
    date: new Date("2024-01-22"),
    time: "9:00 AM",
    childName: "Lucas",
  },
  {
    id: "3",
    title: "School Play Rehearsal",
    date: new Date("2024-01-25"),
    time: "4:00 PM",
    childName: "Emma",
  },
  {
    id: "4",
    title: "Math Competition",
    date: new Date("2024-01-28"),
    time: "10:00 AM",
    childName: "Lucas",
  },
];

export default function UpcomingEvents() {
  const router = useRouter();

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

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
          <Text style={styles.title}>Upcoming Events</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/calendar")}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventsList}>
        <FlatList
          data={mockEvents.slice(0, 3)}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.eventItem,
                index === mockEvents.slice(0, 3).length - 1 && styles.lastItem,
              ]}
            >
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <View style={styles.eventMeta}>
                  <Text style={styles.eventTime}>{item.time}</Text>
                  <Text style={styles.separator}>•</Text>
                  <Text style={styles.childName}>{item.childName}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
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
});
