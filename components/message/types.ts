export interface HistoryItem {
  id: string;
  title: string;
  original: string;
  translated: string;
  date: Date;
}

export interface TranslationState {
  userInput: string;
  translatedText: string;
  isTranslating: boolean;
  showTranslation: boolean;
}
