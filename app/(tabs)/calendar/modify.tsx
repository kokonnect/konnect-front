import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Switch,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "@/components/shared/Button";
import { t } from "i18next";

const primaryColor = "#00B493";

interface Child {
  id: string;
  name: string;
}

interface NotificationOption {
  id: string;
  label: string;
  value: number; // minutes before event
}

interface RepeatOption {
  id: string;
  label: string;
  value: string;
}

const mockChildren: Child[] = [
  { id: "1", name: "Emma" },
  { id: "2", name: "Lucas" },
  { id: "3", name: "Sophia" },
  { id: "4", name: "Oliver" },
];
const notificationOptions: NotificationOption[] = [
  { id: "1", label: "none", value: 0 },
  { id: "2", label: "at", value: 0 },
  { id: "3", label: "5min", value: 5 },
  { id: "4", label: "15min", value: 15 },
  { id: "5", label: "30min", value: 30 },
  { id: "6", label: "1hour", value: 60 },
  { id: "7", label: "1day", value: 1440 },
];
const repeatOptions: RepeatOption[] = [
  { id: "1", label: "Never", value: "never" },
  { id: "2", label: "Daily", value: "daily" },
  { id: "3", label: "Weekly", value: "weekly" },
  { id: "4", label: "Monthly", value: "monthly" },
  { id: "5", label: "Yearly", value: "yearly" },
];

const createChildItemRenderer =
  (
    setSelectedChild: (child: Child) => void,
    setShowChildDropdown: (show: boolean) => void,
  ) =>
  ({ item }: { item: Child }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedChild(item);
        setShowChildDropdown(false);
      }}
    >
      <Text style={styles.dropdownItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

const createNotificationItemRenderer =
  (
    setSelectedNotification: (notification: NotificationOption) => void,
    setShowNotificationDropdown: (show: boolean) => void,
  ) =>
  ({ item }: { item: NotificationOption }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedNotification(item);
        setShowNotificationDropdown(false);
      }}
    >
      <Text style={styles.dropdownItemText}>
        {t("calendar:addEvent.form.reminderOptions." + item.label)}
      </Text>
    </TouchableOpacity>
  );

const createRepeatItemRenderer =
  (
    setSelectedRepeat: (repeat: RepeatOption) => void,
    setShowRepeatDropdown: (show: boolean) => void,
  ) =>
  ({ item }: { item: RepeatOption }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedRepeat(item);
        setShowRepeatDropdown(false);
      }}
    >
      <Text style={styles.dropdownItemText}>
        {t("calendar:addEvent.form.repeatOptions." + item.value)}
      </Text>
    </TouchableOpacity>
  );

export default function ModifyCalendarScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get event ID from params (in real app, use this to fetch event data)
  // const eventId = params.eventId;

  const [eventTitle, setEventTitle] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationOption>(notificationOptions[0]);
  const [selectedRepeat, setSelectedRepeat] = useState<RepeatOption>(
    repeatOptions[0],
  );
  const [repeatEndDate, setRepeatEndDate] = useState(new Date());

  // Modal states
  const [showChildDropdown, setShowChildDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showRepeatDropdown, setShowRepeatDropdown] = useState(false);

  // DateTimePicker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showRepeatEndDatePicker, setShowRepeatEndDatePicker] = useState(false);

  // Load existing event data (in real app, this would come from props/params)
  useEffect(() => {
    // Mock data - in real app, you'd fetch this based on event ID from params
    const mockEventData = {
      title: "Parent-Teacher Conference",
      isAllDay: false,
      startDate: new Date("2025-08-20T15:30:00"),
      endDate: new Date("2025-08-20T16:30:00"),
      childId: "1", // Emma
      notificationValue: 15,
      repeatValue: "never",
    };

    setEventTitle(mockEventData.title);
    setIsAllDay(mockEventData.isAllDay);
    setStartDate(mockEventData.startDate);
    setEndDate(mockEventData.endDate);
    setSelectedChild(
      mockChildren.find((child) => child.id === mockEventData.childId) || null,
    );
    setSelectedNotification(
      notificationOptions.find(
        (opt) => opt.value === mockEventData.notificationValue,
      ) || notificationOptions[0],
    );
    setSelectedRepeat(
      repeatOptions.find((opt) => opt.value === mockEventData.repeatValue) ||
        repeatOptions[0],
    );
  }, []);

  const handleSave = () => {
    if (!eventTitle.trim() || !selectedChild) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert("Success", "Event updated successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Event deleted successfully!", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          },
        },
      ],
    );
  };

  const handleCancel = () => {
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android" && event.type === "dismissed") {
      setShowStartDatePicker(false);
      return;
    }

    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }

    if (Platform.OS === "android") {
      setShowStartDatePicker(false);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android" && event.type === "dismissed") {
      setShowStartTimePicker(false);
      return;
    }

    if (selectedTime) {
      const newStartDate = new Date(startDate);
      newStartDate.setHours(selectedTime.getHours());
      newStartDate.setMinutes(selectedTime.getMinutes());
      setStartDate(newStartDate);
    }

    if (Platform.OS === "android") {
      setShowStartTimePicker(false);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android" && event.type === "dismissed") {
      setShowEndDatePicker(false);
      return;
    }

    if (selectedDate) {
      setEndDate(selectedDate);
    }

    if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android" && event.type === "dismissed") {
      setShowEndTimePicker(false);
      return;
    }

    if (selectedTime) {
      const newEndDate = new Date(endDate);
      newEndDate.setHours(selectedTime.getHours());
      newEndDate.setMinutes(selectedTime.getMinutes());
      setEndDate(newEndDate);
    }

    if (Platform.OS === "android") {
      setShowEndTimePicker(false);
    }
  };

  const handleRepeatEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android" && event.type === "dismissed") {
      setShowRepeatEndDatePicker(false);
      return;
    }

    if (selectedDate) {
      setRepeatEndDate(selectedDate);
    }

    if (Platform.OS === "android") {
      setShowRepeatEndDatePicker(false);
    }
  };

  // Create render functions with state setters
  const renderChildItem = createChildItemRenderer(
    setSelectedChild,
    setShowChildDropdown,
  );
  const renderNotificationItem = createNotificationItemRenderer(
    setSelectedNotification,
    setShowNotificationDropdown,
  );
  const renderRepeatItem = createRepeatItemRenderer(
    setSelectedRepeat,
    setShowRepeatDropdown,
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleCancel}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("calendar:addEvent.title")}</Text>
        <Button
          title={t("calendar:addEvent.form.save")}
          onPress={handleSave}
          disabled={!eventTitle.trim() || !selectedChild}
          style={styles.saveButton}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Title */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t("calendar:addEvent.form.eventTitle")}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t("calendar:addEvent.form.eventTitlePlaceholder")}
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholderTextColor="#999"
          />
        </View>

        {/* All Day Toggle */}
        <View style={styles.formGroup}>
          <View style={styles.toggleRow}>
            <Text style={styles.label}>
              {t("calendar:addEvent.form.allDayEvent")}
            </Text>
            <Switch
              value={isAllDay}
              onValueChange={setIsAllDay}
              trackColor={{ false: "#e0e0e0", true: primaryColor }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Start Date/Time */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("common:start")}</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 2 }]}
              onPress={() => {
                setShowStartDatePicker(!showStartDatePicker);
                setShowStartTimePicker(false);
                setShowEndDatePicker(false);
                setShowEndTimePicker(false);
                setShowRepeatEndDatePicker(false);
              }}
            >
              <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {!isAllDay && (
              <TouchableOpacity
                style={[styles.dateTimeButton, { flex: 1, marginLeft: 12 }]}
                onPress={() => {
                  setShowStartTimePicker(!showStartTimePicker);
                  setShowStartDatePicker(false);
                  setShowEndDatePicker(false);
                  setShowEndTimePicker(false);
                  setShowRepeatEndDatePicker(false);
                }}
              >
                <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            )}
          </View>
          {showStartDatePicker && Platform.OS === "ios" && (
            <View style={styles.inlinePicker}>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="spinner"
                onChange={handleStartDateChange}
                style={styles.dateTimePicker}
              />
            </View>
          )}
          {showStartTimePicker && Platform.OS === "ios" && (
            <View style={styles.inlinePicker}>
              <DateTimePicker
                value={startDate}
                mode="time"
                display="spinner"
                onChange={handleStartTimeChange}
                style={styles.dateTimePicker}
              />
            </View>
          )}
        </View>

        {/* End Date/Time */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("common:end")}</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 2 }]}
              onPress={() => {
                setShowEndDatePicker(!showEndDatePicker);
                setShowStartDatePicker(false);
                setShowStartTimePicker(false);
                setShowEndTimePicker(false);
                setShowRepeatEndDatePicker(false);
              }}
            >
              <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {!isAllDay && (
              <TouchableOpacity
                style={[styles.dateTimeButton, { flex: 1, marginLeft: 12 }]}
                onPress={() => {
                  setShowEndTimePicker(!showEndTimePicker);
                  setShowStartDatePicker(false);
                  setShowStartTimePicker(false);
                  setShowEndDatePicker(false);
                  setShowRepeatEndDatePicker(false);
                }}
              >
                <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            )}
          </View>
          {showEndDatePicker && Platform.OS === "ios" && (
            <View style={styles.inlinePicker}>
              <DateTimePicker
                value={endDate}
                mode="date"
                display="spinner"
                onChange={handleEndDateChange}
                style={styles.dateTimePicker}
              />
            </View>
          )}
          {showEndTimePicker && Platform.OS === "ios" && (
            <View style={styles.inlinePicker}>
              <DateTimePicker
                value={endDate}
                mode="time"
                display="spinner"
                onChange={handleEndTimeChange}
                style={styles.dateTimePicker}
              />
            </View>
          )}
        </View>

        {/* Child Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("common:child")}</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowChildDropdown(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                !selectedChild && styles.placeholder,
              ]}
            >
              {selectedChild
                ? selectedChild.name
                : t("calendar:addEvent.form.selectChildPlaceholder")}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Notification */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {t("calendar:addEvent.form.reminder")}
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowNotificationDropdown(true)}
          >
            <Text style={styles.dropdownText}>
              {t(
                "calendar:addEvent.form.reminderOptions." +
                  selectedNotification.label,
              )}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Repeat */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t("calendar:addEvent.form.repeat")}</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowRepeatDropdown(true)}
          >
            <Text style={styles.dropdownText}>
              {t(
                "calendar:addEvent.form.repeatOptions." + selectedRepeat.value,
              )}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Repeat End Date - only show if repeat is not "Never" */}
        {selectedRepeat.value !== "never" && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              {t("calendar:addEvent.form.repeatEnd")}
            </Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => {
                setShowRepeatEndDatePicker(!showRepeatEndDatePicker);
                setShowStartDatePicker(false);
                setShowStartTimePicker(false);
                setShowEndDatePicker(false);
                setShowEndTimePicker(false);
              }}
            >
              <Text style={styles.dateTimeText}>
                {formatDate(repeatEndDate)}
              </Text>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {showRepeatEndDatePicker && Platform.OS === "ios" && (
              <View style={styles.inlinePicker}>
                <DateTimePicker
                  value={repeatEndDate}
                  mode="date"
                  display="spinner"
                  onChange={handleRepeatEndDateChange}
                  style={styles.dateTimePicker}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Child Dropdown Modal */}
      <Modal
        visible={showChildDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChildDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowChildDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownTitle}>
              {t("calendar:addEvent.form.selectChild")}
            </Text>
            <FlatList
              data={mockChildren}
              keyExtractor={(item) => item.id}
              renderItem={renderChildItem}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Notification Dropdown Modal */}
      <Modal
        visible={showNotificationDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotificationDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotificationDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownTitle}>
              {t("calendar:addEvent.form.reminder")}
            </Text>
            <FlatList
              data={notificationOptions}
              keyExtractor={(item) => item.id}
              renderItem={renderNotificationItem}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Repeat Dropdown Modal */}
      <Modal
        visible={showRepeatDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRepeatDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRepeatDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownTitle}>
              {t("calendar:addEvent.form.repeat")}
            </Text>
            <FlatList
              data={repeatOptions}
              keyExtractor={(item) => item.id}
              renderItem={renderRepeatItem}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Android DateTimePickers */}
      {Platform.OS === "android" && showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {Platform.OS === "android" && showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {Platform.OS === "android" && showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      {Platform.OS === "android" && showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}

      {Platform.OS === "android" && showRepeatEndDatePicker && (
        <DateTimePicker
          value={repeatEndDate}
          mode="date"
          display="default"
          onChange={handleRepeatEndDateChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    maxHeight: 300,
    minWidth: 250,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    textAlign: "center",
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333",
  },
  inlinePicker: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  dateTimePicker: {
    backgroundColor: "#fff",
  },
  deleteButton: {
    backgroundColor: "#ff4757",
    marginTop: 20,
  },
  deleteButtonText: {
    color: "#fff",
  },
});
