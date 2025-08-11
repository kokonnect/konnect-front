import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import CalendarEventForm, { EventData } from "@/components/shared/CalendarEventForm";
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

export default function ModifyCalendarScreen() {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | undefined>(undefined);

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

    const eventData: EventData = {
      title: mockEventData.title,
      isAllDay: mockEventData.isAllDay,
      startDate: mockEventData.startDate,
      endDate: mockEventData.endDate,
      child: mockChildren.find((child) => child.id === mockEventData.childId)!,
      notification: notificationOptions.find(
        (opt) => opt.value === mockEventData.notificationValue,
      ) || notificationOptions[0],
      repeat: repeatOptions.find((opt) => opt.value === mockEventData.repeatValue) ||
        repeatOptions[0],
      repeatEndDate: new Date(),
    };

    setEventData(eventData);
  }, []);

  const handleSave = (_data: EventData) => {
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

  return (
    <CalendarEventForm
      mode="edit"
      eventData={eventData}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancel={handleCancel}
    />
  );
}
