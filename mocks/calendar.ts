import { CalendarEvent, CalendarMarkedDates } from "@/types/calendar";

// Re-export types for convenience
export type { CalendarEvent, CalendarMarkedDates };

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Parent-Teacher Conference",
    date: new Date("2025-08-20"),
    time: "3:30 PM",
    childName: "Emma",
    isAllDay: false,
    notification: "none",
    reminder: "none",
    description: "Discuss academic progress and goals for the semester",
  },
  {
    id: "2",
    title: "Science Fair",
    date: new Date("2025-08-22"),
    time: "9:00 AM",
    childName: "Lucas",
    isAllDay: false,
    notification: "none",
    reminder: "none",
    description: "Annual school science fair exhibition",
  },
  {
    id: "3",
    title: "Soccer Practice",
    date: new Date("2025-08-20"),
    time: "6:00 PM",
    childName: "Emma",
    isAllDay: false,
    notification: "none",
    reminder: "none",
    description: "Weekly soccer practice session",
  },
  {
    id: "4",
    title: "Math Competition",
    date: new Date("2025-09-05"),
    time: "10:00 AM",
    childName: "Lucas",
    isAllDay: false,
    notification: "none",
    reminder: "none",
    description: "Regional mathematics competition",
  },
  {
    id: "5",
    title: "School Field Trip",
    date: new Date("2025-09-15"),
    time: "8:00 AM",
    childName: "Emma",
    isAllDay: false,
    notification: "none",
    reminder: "none",
    description: "Field trip to Natural History Museum",
  },
  {
    id: "6",
    title: "Piano Recital",
    date: new Date("2025-10-10"),
    time: "7:00 PM",
    childName: "Lucas",
    isAllDay: false,
    notification: "none",
    reminder: "none",
    description: "Annual piano recital performance",
  },
];

// Helper function to get events for a specific month
export const getEventsForMonth = (
  year: number,
  month: number,
): CalendarEvent[] => {
  return mockCalendarEvents.filter((event) => {
    const eventDate =
      typeof event.date === "string" ? new Date(event.date) : event.date;
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
};

// Helper function to get events for a specific date
export const getEventsForDate = (date: Date | string): CalendarEvent[] => {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const targetDateStr = targetDate.toISOString().split("T")[0];

  return mockCalendarEvents.filter((event) => {
    const eventDate =
      typeof event.date === "string" ? new Date(event.date) : event.date;
    const eventDateStr = eventDate.toISOString().split("T")[0];
    return eventDateStr === targetDateStr;
  });
};
