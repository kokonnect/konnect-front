import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import UpcomingEvents from "@/components/shared/UpcomingEvents";
import SelectedDateSchedule from "@/components/calendar/SelectedDateSchedule";
import MonthYearPicker from "@/components/calendar/MonthYearPicker";
import { formatMonthYear } from "@/utils/formatDate";
import { mockCalendarEvents } from "@/mocks/calendar";

const primaryColor = "#00B493";

const setLocaleConfig = (currLanguage: string, t: any) => {
  LocaleConfig.locales[currLanguage] = {
    monthNames: [
      t("calendar:months.january"),
      t("calendar:months.february"),
      t("calendar:months.march"),
      t("calendar:months.april"),
      t("calendar:months.may"),
      t("calendar:months.june"),
      t("calendar:months.july"),
      t("calendar:months.august"),
      t("calendar:months.september"),
      t("calendar:months.october"),
      t("calendar:months.november"),
      t("calendar:months.december"),
    ],
    monthNamesShort: [
      t("calendar:monthShort.january"),
      t("calendar:monthShort.february"),
      t("calendar:monthShort.march"),
      t("calendar:monthShort.april"),
      t("calendar:monthShort.may"),
      t("calendar:monthShort.june"),
      t("calendar:monthShort.july"),
      t("calendar:monthShort.august"),
      t("calendar:monthShort.september"),
      t("calendar:monthShort.october"),
      t("calendar:monthShort.november"),
      t("calendar:monthShort.december"),
    ],
    dayNames: [
      t("calendar:weekDays.sunday"),
      t("calendar:weekDays.monday"),
      t("calendar:weekDays.tuesday"),
      t("calendar:weekDays.wednesday"),
      t("calendar:weekDays.thursday"),
      t("calendar:weekDays.friday"),
      t("calendar:weekDays.saturday"),
    ],
    dayNamesShort: [
      t("calendar:weekDaysShort.sunday"),
      t("calendar:weekDaysShort.monday"),
      t("calendar:weekDaysShort.tuesday"),
      t("calendar:weekDaysShort.wednesday"),
      t("calendar:weekDaysShort.thursday"),
      t("calendar:weekDaysShort.friday"),
      t("calendar:weekDaysShort.saturday"),
    ],
    today: t("calendar:today"),
  };
  LocaleConfig.defaultLocale = currLanguage;
};

export default function CalendarScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState("");
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().split("T")[0].substring(0, 7),
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempMonth, setTempMonth] = useState(0);
  const [tempYear, setTempYear] = useState(0);
  const [calendarKey, setCalendarKey] = useState(0);

  const currentLanguageCode = i18n.language;

  useEffect(() => {
    setLocaleConfig(currentLanguageCode, t);
    // Force calendar to re-render with new locale
    setCalendarKey((prev) => prev + 1);
  }, [currentLanguageCode, t]);

  // Combine events data with selected date
  const getMarkedDates = () => {
    const marked: any = {};

    // Mark all event dates
    mockCalendarEvents.forEach((event) => {
      const dateStr = new Date(event.date).toISOString().split("T")[0];
      marked[dateStr] = {
        customStyles: {
          container: {
            borderColor: primaryColor,
            borderWidth: 1,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
          },
        },
      };
    });

    // Add selected date styling
    if (selected) {
      marked[selected] = {
        ...marked[selected],
        customStyles: {
          container: {
            ...(marked[selected]?.customStyles?.container || {}),
          },
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Calendar
          key={`${currentMonth}-${calendarKey}`}
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
                  {formatMonthYear(currentMonth, currentLanguageCode)}
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
          hideExtraDays={true}
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
            todayTextColor: primaryColor,
          }}
        />
        {selected ? (
          <SelectedDateSchedule selectedDate={selected} />
        ) : (
          <UpcomingEvents
            showViewAll={false}
            currentMonth={currentMonth}
            events={mockCalendarEvents.filter((event) => {
              const eventMonth = new Date(event.date)
                .toISOString()
                .substring(0, 7);
              return eventMonth === currentMonth;
            })}
          />
        )}
      </ScrollView>
      <MonthYearPicker
        visible={showMonthPicker}
        currentMonth={currentMonth}
        onClose={() => setShowMonthPicker(false)}
        onConfirm={(year, month) => {
          setCurrentMonth(`${year}-${String(month).padStart(2, "0")}`);
          setSelected("");
        }}
      />
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
