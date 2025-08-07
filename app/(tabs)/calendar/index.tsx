import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import UpcomingEvents from "@/components/shared/UpcomingEvents";
import SelectedDateSchedule from "@/components/calendar/SelectedDateSchedule";

const primaryColor = "#00B493";

const months = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - 5 + i,
);

// Optimized render functions
const createYearRenderItem = (tempYear: number, setTempYear: (year: number) => void) => 
  ({ item }: { item: number }) => (
    <TouchableOpacity
      style={[
        styles.pickerItem,
        tempYear === item && styles.selectedPickerItem,
      ]}
      onPress={() => setTempYear(item)}
    >
      <Text
        style={[
          styles.pickerItemText,
          tempYear === item && styles.selectedPickerItemText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

const createMonthRenderItem = (tempMonth: number, setTempMonth: (month: number) => void) => 
  ({ item }: { item: { id: number; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.pickerItem,
        tempMonth === item.id && styles.selectedPickerItem,
      ]}
      onPress={() => setTempMonth(item.id)}
    >
      <Text
        style={[
          styles.pickerItemText,
          tempMonth === item.id &&
            styles.selectedPickerItemText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

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
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState(new Date().getMonth() + 1);

  // Create render functions with current state
  const renderYearItem = createYearRenderItem(tempYear, setTempYear);
  const renderMonthItem = createMonthRenderItem(tempMonth, setTempMonth);

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
          key={currentMonth}
          current={`${currentMonth}-01`}
          style={styles.calendar}
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={getMarkedDates()}
          onMonthChange={(month) => {
            setCurrentMonth(
              `${month.year}-${String(month.month).padStart(2, "0")}`,
            );
            setSelected(""); // Clear selected date when month changes
          }}
          renderHeader={() => (
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.monthSelector}
                onPress={() => {
                  setShowMonthPicker(true);
                  const [year, month] = currentMonth.split("-");
                  setTempYear(parseInt(year));
                  setTempMonth(parseInt(month));
                }}
              >
                <Text style={styles.monthText}>
                  {formatMonthYear(currentMonth)}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#333"
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
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
          <UpcomingEvents showViewAll={false} currentMonth={currentMonth} />
        )}
      </ScrollView>

      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Month & Year</Text>
              <TouchableOpacity
                onPress={() => setShowMonthPicker(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <View style={styles.yearPicker}>
                <Text style={styles.pickerLabel}>Year</Text>
                <FlatList
                  data={years}
                  keyExtractor={(item) => item.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderYearItem}
                />
              </View>

              <View style={styles.monthPicker}>
                <Text style={styles.pickerLabel}>Month</Text>
                <FlatList
                  data={months}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderMonthItem}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                const newMonth = `${tempYear}-${String(tempMonth).padStart(2, "0")}`;
                setCurrentMonth(newMonth);
                setSelected(""); // Clear selected date
                setShowMonthPicker(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevronIcon: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    height: 300,
  },
  yearPicker: {
    flex: 1,
    marginRight: 10,
  },
  monthPicker: {
    flex: 1,
    marginLeft: 10,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 10,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedPickerItem: {
    backgroundColor: primaryColor,
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  selectedPickerItemText: {
    color: "#fff",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
