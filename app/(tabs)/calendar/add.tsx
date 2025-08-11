import React from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import CalendarEventForm, {
  EventData,
} from "@/components/shared/CalendarEventForm";

export default function AddCalendarScreen() {
  const router = useRouter();

  const handleSave = (_data: EventData) => {
    // Here you would typically save the event
    Alert.alert("Success", "Event added successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <CalendarEventForm mode="add" onSave={handleSave} onCancel={handleCancel} />
  );
}
