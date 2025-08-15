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
  Switch,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

import Button from "@/components/shared/Button";
import { Child, NotificationOption, RepeatOption } from "@/types";
import { showAlert } from "@/utils/alert";
import { mockChildren } from "@/mocks/user";

const primaryColor = "#00B493";

export interface EventData {
  title: string;
  isAllDay: boolean;
  startDate: Date;
  endDate: Date;
  child: Child;
  notification: NotificationOption;
  repeat: RepeatOption;
  repeatEndDate: Date;
}

interface CalendarEventFormProps {
  mode: "add" | "edit";
  eventData?: EventData;
  onSave: (data: EventData) => void;
  onDelete?: () => void;
  onCancel: () => void;
}


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

// Helper functions
const ChildItemRenderer = ({
  item,
  setSelectedChild,
  setShowDropdown,
}: {
  item: Child;
  setSelectedChild: (child: Child) => void;
  setShowDropdown: (show: boolean) => void;
}) => (
  <TouchableOpacity
    style={styles.dropdownItem}
    onPress={() => {
      setSelectedChild(item);
      setShowDropdown(false);
    }}
  >
    <Text style={styles.dropdownItemText}>{item.name}</Text>
  </TouchableOpacity>
);

const NotificationItemRenderer = ({
  item,
  setSelected,
  setShowDropdown,
  t,
}: {
  item: NotificationOption;
  setSelected: (item: NotificationOption) => void;
  setShowDropdown: (show: boolean) => void;
  t: any;
}) => (
  <TouchableOpacity
    style={styles.dropdownItem}
    onPress={() => {
      setSelected(item);
      setShowDropdown(false);
    }}
  >
    <Text style={styles.dropdownItemText}>
      {t("calendar:form.reminderOptions." + item.label)}
    </Text>
  </TouchableOpacity>
);

const RepeatItemRenderer = ({
  item,
  setSelected,
  setShowDropdown,
  t,
}: {
  item: RepeatOption;
  setSelected: (item: RepeatOption) => void;
  setShowDropdown: (show: boolean) => void;
  t: any;
}) => (
  <TouchableOpacity
    style={styles.dropdownItem}
    onPress={() => {
      setSelected(item);
      setShowDropdown(false);
    }}
  >
    <Text style={styles.dropdownItemText}>
      {t("calendar:form.repeatOptions." + item.value)}
    </Text>
  </TouchableOpacity>
);

// Factory functions for render items (defined outside component)
const createRenderChildItem =
  (
    setSelectedChild: (child: Child) => void,
    setShowDropdown: (show: boolean) => void,
  ) =>
  ({ item }: { item: Child }) => (
    <ChildItemRenderer
      item={item}
      setSelectedChild={setSelectedChild}
      setShowDropdown={setShowDropdown}
    />
  );

const createRenderNotificationItem =
  (
    setSelected: (item: NotificationOption) => void,
    setShowDropdown: (show: boolean) => void,
    t: any,
  ) =>
  ({ item }: { item: NotificationOption }) => (
    <NotificationItemRenderer
      item={item}
      setSelected={setSelected}
      setShowDropdown={setShowDropdown}
      t={t}
    />
  );

const createRenderRepeatItem =
  (
    setSelected: (item: RepeatOption) => void,
    setShowDropdown: (show: boolean) => void,
    t: any,
  ) =>
  ({ item }: { item: RepeatOption }) => (
    <RepeatItemRenderer
      item={item}
      setSelected={setSelected}
      setShowDropdown={setShowDropdown}
      t={t}
    />
  );

export default function CalendarEventForm({
  mode,
  eventData,
  onSave,
  onDelete,
  onCancel,
}: CalendarEventFormProps) {
  const { t } = useTranslation();

  // Form states - initialize with eventData if in edit mode
  const [eventTitle, setEventTitle] = useState(eventData?.title || "");
  const [isAllDay, setIsAllDay] = useState(eventData?.isAllDay || false);
  const [startDate, setStartDate] = useState(
    eventData?.startDate || new Date(),
  );
  const [endDate, setEndDate] = useState(eventData?.endDate || new Date());
  const [selectedChild, setSelectedChild] = useState<Child | null>(
    eventData?.child || null,
  );
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationOption>(
      eventData?.notification || notificationOptions[0],
    );
  const [selectedRepeat, setSelectedRepeat] = useState<RepeatOption>(
    eventData?.repeat || repeatOptions[0],
  );
  const [repeatEndDate, setRepeatEndDate] = useState(
    eventData?.repeatEndDate || new Date(),
  );

  // Update form state when eventData prop changes
  useEffect(() => {
    if (eventData) {
      setEventTitle(eventData.title);
      setIsAllDay(eventData.isAllDay);
      setStartDate(eventData.startDate);
      setEndDate(eventData.endDate);
      setSelectedChild(eventData.child);
      setSelectedNotification(eventData.notification);
      setSelectedRepeat(eventData.repeat);
      setRepeatEndDate(eventData.repeatEndDate);
    }
  }, [eventData]);

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

  // Create render functions using factory functions
  const renderChildItem = createRenderChildItem(
    setSelectedChild,
    setShowChildDropdown,
  );
  const renderNotificationItem = createRenderNotificationItem(
    setSelectedNotification,
    setShowNotificationDropdown,
    t,
  );
  const renderRepeatItem = createRenderRepeatItem(
    setSelectedRepeat,
    setShowRepeatDropdown,
    t,
  );

  const handleSave = () => {
    if (!eventTitle.trim() || !selectedChild) {
      showAlert("Error", "Please fill in all required fields");
      return;
    }

    const formData: EventData = {
      title: eventTitle,
      isAllDay,
      startDate,
      endDate,
      child: selectedChild,
      notification: selectedNotification,
      repeat: selectedRepeat,
      repeatEndDate,
    };

    onSave(formData);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Date/Time handler functions
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

      // Auto-adjust end time if it's before start time
      if (newStartDate >= endDate) {
        const newEndDate = new Date(newStartDate);
        newEndDate.setHours(newStartDate.getHours() + 1);
        setEndDate(newEndDate);
      }
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
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
      } else {
        showAlert("Error", "End date cannot be before start date");
      }
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

      if (newEndDate > startDate) {
        setEndDate(newEndDate);
      } else {
        showAlert("Error", "End time must be after start time");
      }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={onCancel}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "add"
            ? t("calendar:addEvent.title")
            : t("calendar:modifyEvent.title")}
        </Text>
        <Button
          title={t("calendar:form.save")}
          onPress={handleSave}
          disabled={!eventTitle.trim() || !selectedChild}
          style={styles.saveButton}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("calendar:form.eventTitle")} *</Text>
          <TextInput
            style={styles.textInput}
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholder={t("calendar:form.eventTitlePlaceholder")}
          />
        </View>

        {/* All Day Toggle */}
        <View style={styles.inputGroup}>
          <View style={styles.toggleRow}>
            <Text style={styles.label}>{t("calendar:form.allDay")}</Text>
            <Switch
              value={isAllDay}
              onValueChange={setIsAllDay}
              trackColor={{ false: "#e0e0e0", true: primaryColor }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Start Date/Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("calendar:form.start")}</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1, marginRight: 8 }]}
              onPress={() => {
                setShowStartDatePicker(true);
                setShowStartTimePicker(false);
                setShowEndDatePicker(false);
                setShowEndTimePicker(false);
              }}
            >
              <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {!isAllDay && (
              <TouchableOpacity
                style={[styles.dateTimeButton, { flex: 1, marginLeft: 8 }]}
                onPress={() => {
                  setShowStartTimePicker(true);
                  setShowStartDatePicker(false);
                  setShowEndDatePicker(false);
                  setShowEndTimePicker(false);
                }}
              >
                <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
                <MaterialCommunityIcons name="clock" size={20} color="#666" />
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
          {showStartTimePicker && Platform.OS === "ios" && !isAllDay && (
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
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("calendar:form.end")}</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1, marginRight: 8 }]}
              onPress={() => {
                setShowEndDatePicker(true);
                setShowStartDatePicker(false);
                setShowStartTimePicker(false);
                setShowEndTimePicker(false);
              }}
            >
              <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {!isAllDay && (
              <TouchableOpacity
                style={[styles.dateTimeButton, { flex: 1, marginLeft: 8 }]}
                onPress={() => {
                  setShowEndTimePicker(true);
                  setShowStartDatePicker(false);
                  setShowStartTimePicker(false);
                  setShowEndDatePicker(false);
                }}
              >
                <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
                <MaterialCommunityIcons name="clock" size={20} color="#666" />
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
          {showEndTimePicker && Platform.OS === "ios" && !isAllDay && (
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

        {/* Child Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("calendar:form.selectChild")} *</Text>
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
                : t("calendar:form.selectChildPlaceholder")}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Notification */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("calendar:form.reminder")}</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowNotificationDropdown(true)}
          >
            <Text style={styles.dropdownText}>
              {t("calendar:form.reminderOptions." + selectedNotification.label)}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Repeat */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("calendar:form.repeat")}</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowRepeatDropdown(true)}
          >
            <Text style={styles.dropdownText}>
              {t("calendar:form.repeatOptions." + selectedRepeat.value)}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Repeat End Date - only show if repeat is not "never" */}
        {selectedRepeat.value !== "never" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("calendar:form.repeatEnd")}</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => {
                setShowRepeatEndDatePicker(true);
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

        {/* Delete Button - only show in edit mode */}
        {mode === "edit" && onDelete && (
          <Button
            title={t("calendar:modifyEvent.deleteEvent")}
            onPress={onDelete}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
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
              {t("calendar:form.selectChild")}
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
              {t("calendar:form.reminder")}
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
              {t("calendar:form.repeat")}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: primaryColor,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
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
