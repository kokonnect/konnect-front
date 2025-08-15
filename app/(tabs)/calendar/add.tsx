import React from "react";
import { useRouter } from "expo-router";

import CalendarEventForm, {
  EventData,
} from "@/components/shared/CalendarEventForm";
import { showAlert } from "@/utils/alert";

export default function AddCalendarScreen() {
  const router = useRouter();

  const handleSave = (_data: EventData) => {
    // Here you would typically save the event
    showAlert("Success", "Event added successfully!", [
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
