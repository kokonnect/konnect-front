// Re-export message types from centralized types
export type {
  MessageTemplate,
  MessageHistoryItem,
  MessageCategory,
  MessageDraft,
  TTSOptions,
  MessageTranslation,
} from '@/types/message';

// Additional component-specific types
export interface TranslationState {
  userInput: string;
  translatedText: string;
  isTranslating: boolean;
  showTranslation: boolean;
}

// Legacy alias for backward compatibility
export type HistoryItem = MessageHistoryItem;