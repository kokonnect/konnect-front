import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../shared/Button";
import { TranslationEvent } from "./types";

const primaryColor = "#00B493";

interface Child {
  id: string;
  name: string;
}

interface NotificationOption {
  id: string;
  label: string;
  value: number;
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
  { id: "1", label: "None", value: 0 },
  { id: "2", label: "At time of event", value: 0 },
  { id: "3", label: "5 minutes before", value: 5 },
  { id: "4", label: "15 minutes before", value: 15 },
  { id: "5", label: "30 minutes before", value: 30 },
  { id: "6", label: "1 hour before", value: 60 },
  { id: "7", label: "1 day before", value: 1440 },
];

const repeatOptions: RepeatOption[] = [
  { id: "1", label: "Never", value: "never" },
  { id: "2", label: "Daily", value: "daily" },
  { id: "3", label: "Weekly", value: "weekly" },
  { id: "4", label: "Monthly", value: "monthly" },
  { id: "5", label: "Yearly", value: "yearly" },
];

// Optimized render functions
const createChildRenderItem =
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

const createNotificationRenderItem =
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
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

const createRepeatRenderItem =
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
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  eventData?: TranslationEvent | null;
}

export default function CalendarModal({
  visible,
  onClose,
  onSave,
  eventData,
}: CalendarModalProps) {
  const [eventTitle, setEventTitle] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationOption>(notificationOptions[3]);
  const [selectedRepeat, setSelectedRepeat] = useState<RepeatOption>(
    repeatOptions[0],
  );
  const [repeatEndDate, setRepeatEndDate] = useState(new Date());

  // Dropdown states
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

  // Pre-fill form when eventData changes
  useEffect(() => {
    if (eventData && visible) {
      setEventTitle(eventData.title);

      // Parse event date and time
      const eventDate = new Date(eventData.date);
      if (eventData.time) {
        const [time, period] = eventData.time.split(" ");
        const [hours, minutes] = time.split(":");
        let hour = parseInt(hours);
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        eventDate.setHours(hour, parseInt(minutes));
        setIsAllDay(false);
      } else {
        setIsAllDay(true);
      }

      setStartDate(eventDate);
      setEndDate(new Date(eventDate.getTime() + 60 * 60 * 1000)); // Add 1 hour

      // Reset other fields to defaults
      setSelectedChild(null);
      setSelectedNotification(notificationOptions[3]); // 15 minutes before
      setSelectedRepeat(repeatOptions[0]); // Never
      setRepeatEndDate(new Date());
    }
  }, [eventData, visible]);

  const handleSave = () => {
    if (!eventTitle.trim() || !selectedChild) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    Alert.alert("Success", "Event added to calendar successfully!", [
      {
        text: "OK",
        onPress: () => {
          onSave();
          onClose();
        },
      },
    ]);
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

  // Create render functions with current state
  const renderChildItem = createChildRenderItem(
    setSelectedChild,
    setShowChildDropdown,
  );
  const renderNotificationItem = createNotificationRenderItem(
    setSelectedNotification,
    setShowNotificationDropdown,
  );
  const renderRepeatItem = createRepeatRenderItem(
    setSelectedRepeat,
    setShowRepeatDropdown,
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add to Calendar</Text>
            <Button
              title="Save"
              onPress={handleSave}
              disabled={!eventTitle.trim() || !selectedChild}
              style={styles.saveButton}
            />
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Event Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter event title"
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholderTextColor="#999"
              />
            </View>

            {/* All Day Toggle */}
            <View style={styles.formGroup}>
              <View style={styles.toggleRow}>
                <Text style={styles.label}>All Day</Text>
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
              <Text style={styles.label}>Start *</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  style={[styles.dateTimeButton, { flex: 2 }]}
                  onPress={() => setShowStartDatePicker(!showStartDatePicker)}
                >
                  <Text style={styles.dateTimeText}>
                    {formatDate(startDate)}
                  </Text>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
                {!isAllDay && (
                  <TouchableOpacity
                    style={[styles.dateTimeButton, { flex: 1, marginLeft: 12 }]}
                    onPress={() => setShowStartTimePicker(!showStartTimePicker)}
                  >
                    <Text style={styles.dateTimeText}>
                      {formatTime(startDate)}
                    </Text>
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
                  />
                </View>
              )}
            </View>

            {/* End Date/Time */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>End *</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  style={[styles.dateTimeButton, { flex: 2 }]}
                  onPress={() => setShowEndDatePicker(!showEndDatePicker)}
                >
                  <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
                {!isAllDay && (
                  <TouchableOpacity
                    style={[styles.dateTimeButton, { flex: 1, marginLeft: 12 }]}
                    onPress={() => setShowEndTimePicker(!showEndTimePicker)}
                  >
                    <Text style={styles.dateTimeText}>
                      {formatTime(endDate)}
                    </Text>
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
                  />
                </View>
              )}
            </View>

            {/* Child Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Child *</Text>
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
                  {selectedChild ? selectedChild.name : "Select a child"}
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
              <Text style={styles.label}>Notification</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowNotificationDropdown(true)}
              >
                <Text style={styles.dropdownText}>
                  {selectedNotification.label}
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
              <Text style={styles.label}>Repeat</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowRepeatDropdown(true)}
              >
                <Text style={styles.dropdownText}>{selectedRepeat.label}</Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Repeat End Date */}
            {selectedRepeat.value !== "never" && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>End Repeat</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() =>
                    setShowRepeatEndDatePicker(!showRepeatEndDatePicker)
                  }
                >
                  <Text style={styles.dateTimeText}>
                    {formatDate(repeatEndDate)}
                  </Text>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
                {showRepeatEndDatePicker && Platform.OS === "ios" && (
                  <View style={styles.inlinePicker}>
                    <DateTimePicker
                      value={repeatEndDate}
                      mode="date"
                      display="spinner"
                      onChange={handleRepeatEndDateChange}
                    />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Dropdown Modals */}
      <Modal
        visible={showChildDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChildDropdown(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowChildDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownTitle}>Select Child</Text>
            <FlatList
              data={mockChildren}
              keyExtractor={(item) => item.id}
              renderItem={renderChildItem}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showNotificationDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotificationDropdown(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowNotificationDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownTitle}>Select Notification</Text>
            <FlatList
              data={notificationOptions}
              keyExtractor={(item) => item.id}
              renderItem={renderNotificationItem}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showRepeatDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRepeatDropdown(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowRepeatDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownTitle}>Select Repeat</Text>
            <FlatList
              data={repeatOptions}
              keyExtractor={(item) => item.id}
              renderItem={renderRepeatItem}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
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
  modalBody: {
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
  dropdownOverlay: {
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
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
});
