// Common/Shared types

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
}

export interface DocumentHistoryItem {
  id: string;
  fileName: string;
  fileType: string;
  summary: string;
  fullText: string;
  originalText?: string;
  events?: Event[];
  date: Date;
}

export interface TranslationResult {
  summary: string;
  fullText: string;
  originalText: string;
  events: Event[];
}

export interface UploadedFile {
  name: string;
  type: "image" | "pdf";
}

export type TabType = "summary" | "fullText" | "events";

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