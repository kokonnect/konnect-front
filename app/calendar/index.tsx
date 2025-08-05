import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import UpcomingEvents from "../../components/UpcomingEvents";
import SelectedDateSchedule from "../../components/SelectedDateSchedule";

const primaryColor = "#00B493";

// Mock data for events on specific dates
const eventsData = {
  "2025-08-20": {
    customStyles: {
      container: {
        textAlign: "center",
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 24,
        justifyContent: "center",
      },
    },
  },
  "2025-08-22": {
    customStyles: {
      container: {
        textAlign: "center",
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 24,
        justifyContent: "center",
      },
    },
  },
};

export default function CalendarScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().split("T")[0].substring(0, 7),
  );

  // Combine events data with selected date
  const getMarkedDates = () => {
    const marked = { ...eventsData };

    // Add selected date styling
    if (selected) {
      marked[selected] = {
        ...marked[selected],
        customStyles: {
          ...(marked[selected]?.customStyles || {}),
          text: {
            color: "#fff",
            width: 24,
            height: 24,
            lineHeight: 24,
            textAlign: "center",
            borderRadius: 12,
            backgroundColor: primaryColor,
          },
        },
      };
    }

    return marked;
  };

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Calendar
          style={styles.calendar}
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={getMarkedDates()}
          onMonthChange={(month) => {
            setCurrentMonth(
              `${month.year}-${String(month.month).padStart(2, "0")}`,
            );
          }}
          renderHeader={() => (
            <View style={styles.header}>
              <Text style={styles.monthText}>
                {formatMonthYear(currentMonth)}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/calendar/add")}
              >
                <MaterialCommunityIcons name="plus" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          enableSwipeMonths={true}
          hideArrows={true}
          markingType={"custom"}
          theme={{
            textDayFontSize: 14,
            contentStyle: {
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            },
            textDayStyle: {
              width: 24,
              height: 24,
              lineHeight: 24,
              textAlign: "center",
            },
          }}
        />
        {selected ? (
          <SelectedDateSchedule selectedDate={selected} />
        ) : (
          <UpcomingEvents showViewAll={false} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  calendar: {
    marginVertical: 20,
    marginHorizontal: 16,
    padding: 10,
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
  header: {
    flexDirection: "row",
    width: "100%",
    minWidth: 300,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
