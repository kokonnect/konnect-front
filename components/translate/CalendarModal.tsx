import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Alert } from "react-native";
import CalendarEventForm, { EventData } from "@/components/shared/CalendarEventForm";
import { TranslationEvent } from "./types";
import { Child, NotificationOption, RepeatOption } from "@/types";

const mockChildren: Child[] = [
  { id: "1", name: "Emma", birthDate: "2015-03-15", school: "Sunshine Elementary", grade: "3rd Grade" },
  { id: "2", name: "Lucas", birthDate: "2013-07-22", school: "Riverside Elementary", grade: "5th Grade" },
  { id: "3", name: "Sophia", birthDate: "2016-11-08", school: "Oak Tree Elementary", grade: "2nd Grade" },
  { id: "4", name: "Oliver", birthDate: "2014-09-12", school: "Pine Valley Elementary", grade: "4th Grade" },
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
  const [formEventData, setFormEventData] = useState<EventData | undefined>(undefined);

  // Convert TranslationEvent to EventData format when eventData changes
  useEffect(() => {
    if (eventData && visible) {
      // Parse event date and time
      const eventDate = new Date(eventData.date);
      let isAllDay = true;
      
      if (eventData.time) {
        const [time, period] = eventData.time.split(" ");
        const [hours, minutes] = time.split(":");
        let hour = parseInt(hours);
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        eventDate.setHours(hour, parseInt(minutes));
        isAllDay = false;
      }

      const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // Add 1 hour

      setFormEventData({
        title: eventData.title,
        isAllDay,
        startDate: eventDate,
        endDate: endDate,
        child: mockChildren[0], // Default to first child
        notification: notificationOptions[3], // 15 minutes before
        repeat: repeatOptions[0], // Never
        repeatEndDate: new Date(),
      });
    } else if (!eventData) {
      setFormEventData(undefined);
    }
  }, [eventData, visible]);

  const handleSave = (_data: EventData) => {
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <CalendarEventForm
            mode="add"
            eventData={formEventData}
            onSave={handleSave}
            onCancel={onClose}
          />
        </View>
      </View>
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
});
