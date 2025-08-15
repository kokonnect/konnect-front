// Translation and Document processing related types

export interface TranslationResult {
  id: string;
  title?: string;
  fileName: string;
  fileType: "image" | "pdf";
  summary?: string;
  fullText?: string;
  originalText?: string;
  events?: TranslationEvent[];
  vocabulary?: VocabularyItem[];
  confidence?: number;
  datetime: Date | string;
}

export interface TranslationEvent {
  id: string;
  title: string; // ai generated title
  date: string;
  time?: string;
  description: string;
}

export interface VocabularyItem {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  description: string;
  example: string;
  exampleTranslation: string;
}

export interface TranslationHistoryItem {
  id: string;
  title: string;
  datetime: Date | string;
  summary?: string;
  fileName: string;
  fileType: "image" | "pdf";
  processingStatus: "completed" | "processing" | "failed";
  originalText?: string;
  translatedText?: string;
}

export interface UploadedFile {
  name: string;
  type: "image" | "pdf";
  uri?: string;
  size?: number;
  mimeType?: string;
}

export type TabType = "summary" | "fullText" | "events" | "vocabulary";
