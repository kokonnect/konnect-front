// Calendar and Event related types

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date | string;
  isAllDay: boolean;
  time?: string;
  childName: string;
  description?: string;
  notification: string;
  repeat?: string;
  reminder?: string;
}

export interface CalendarMarkedDate {
  customStyles?: {
    container?: {
      textAlign?: string;
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: number;
      justifyContent?: string;
      backgroundColor?: string;
    };
    text?: {
      color?: string;
      fontWeight?: string;
    };
  };
  selected?: boolean;
  selectedColor?: string;
}

// Notification and repeat options for calendar
export interface NotificationOption {
  id: string;
  label: string;
  value: number; // minutes before event
}

export interface RepeatOption {
  id: string;
  label: string;
  value: string;
}
export interface CalendarMarkedDates {
  [date: string]: CalendarMarkedDate;
}
