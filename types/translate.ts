// Translation and Document processing related types

// Enums to match backend
export enum FileType {
  IMAGE = "IMAGE",
  PDF = "PDF",
}

export enum TargetLanguage {
  ENGLISH = "ENGLISH",
  KOREAN = "KOREAN",
  VIETNAMESE = "VIETNAMESE",
  CHINESE = "CHINESE",
  THAI = "THAI",
  JAPANESE = "JAPANESE",
  FILIPINO = "FILIPINO",
  KHMER = "KHMER",
}

export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}
// Backend Request Model
export interface FileTranslationRequest {
  file: File | UploadFile | FormData;
  fileType: FileType;
  targetLanguage: TargetLanguage;
  useSimpleLanguage?: boolean;
  sourceLanguageHint?: string;
}

// Backend Response Model
export interface FileTranslationResponse {
  extractedText: string;
  translatedText: string;
  summary: string;
  originalFileName: string;
  fileType: FileType;
  targetLanguage: TargetLanguage;
  targetLanguageName: string;
  usedSimpleLanguage: boolean;
  fileSize: number;
  originalTextLength: number;
  translatedTextLength: number;
  totalProcessingTimeMs: number;
  pageCount: number;
  sourceLanguageHint?: string;
}

// Legacy interface (keep for backward compatibility)
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
