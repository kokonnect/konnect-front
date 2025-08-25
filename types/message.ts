// Message and Communication related types

export interface MessageComposeRequest {
  message: string;
}

export interface MessageComposeResponse {
  originalMessage: string;
  translatedMessage: string;
  targetLanguage: string;
  processingTimeMs: number;
}

// legacy templates
export interface MessageTemplate {
  id: string;
  title: string;
  messageKr: string;
  messageEn: string;
  category: string;
  isFavorite?: boolean;
}

export interface MessageCategory {
  id: string;
  name: string;
  label: string;
}

export interface MessageTranslationHistoryItem {
  id: string;
  title: string;
  original: string;
  translated: string;
  date: Date;
}

// For message translation
export interface MessageTranslation {
  original: string;
  translated: string;
}
