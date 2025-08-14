export interface TranslationResult {
  summary: string;
  fullText: string;
  originalText: string;
  events: TranslationEvent[];
  vocabulary?: VocabularyItem[];
}

export interface TranslationEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description: string;
}

export type TabType = "summary" | "fullText" | "events";

export interface UploadedFile {
  name: string;
  type: "image" | "pdf";
}

export interface VocabularyItem {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  description: string;
  example?: string;
  exampleTranslation?: string;
}
