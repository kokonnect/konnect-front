import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        selectedDate.getMonth() === new Date().getMonth() &&
        selectedDate.getFullYear() === new Date().getFullYear();

      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.dayCell, isToday && styles.todayCell]}
        >
          <ThemedText style={[styles.dayText, isToday && styles.todayText]}>
            {day}
          </ThemedText>
        </TouchableOpacity>,
      );
    }

    return days;
  };

  const events = [
    { id: "1", time: "09:00 AM", title: "Team Meeting", color: "#00B493" },
    { id: "2", time: "12:00 PM", title: "Lunch with Client", color: "#34C759" },
    { id: "3", time: "03:00 PM", title: "Project Review", color: "#FF9500" },
    { id: "4", time: "05:00 PM", title: "Gym Session", color: "#AF52DE" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Calendar</ThemedText>
        </ThemedView>

        <ThemedView style={styles.monthHeader}>
          <ThemedText type="subtitle">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.calendarContainer}>
          <ThemedView style={styles.calendar}>
            <ThemedView style={styles.weekDaysRow}>
              {weekDays.map((day) => (
                <ThemedText key={day} style={styles.weekDayText}>
                  {day}
                </ThemedText>
              ))}
            </ThemedView>

            <ThemedView style={styles.daysGrid}>
              {renderCalendarDays()}
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.eventsSection}>
          <ThemedText type="subtitle" style={styles.eventsTitle}>
            Todays Events
          </ThemedText>
          {events.map((event) => (
            <ThemedView key={event.id} style={styles.eventItem}>
              <View
                style={[
                  styles.eventIndicator,
                  { backgroundColor: event.color },
                ]}
              />
              s
              <ThemedView style={styles.eventDetails}>
                <ThemedText style={styles.eventTime}>{event.time}</ThemedText>
                <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  monthHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  calendar: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    fontSize: 12,
    opacity: 0.6,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
  },
  todayCell: {
    backgroundColor: "#00B493",
    borderRadius: 20,
  },
  todayText: {
    color: "white",
    fontWeight: "600",
  },
  eventsSection: {
    gap: 12,
    paddingHorizontal: 20,
  },
  eventsTitle: {
    marginBottom: 8,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
  eventIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  eventDetails: {
    flex: 1,
  },
  eventTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  eventTitle: {
    fontSize: 16,
    marginTop: 2,
  },
});
