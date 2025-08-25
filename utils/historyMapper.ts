import { HistoryItem, TranslationResult } from "@/types/translate";

/**
 * Convert API history item to legacy TranslationResult format
 * for backward compatibility with existing UI components
 */
export function mapHistoryItemToTranslationResult(item: HistoryItem): TranslationResult {
  return {
    id: item.documentId.toString(),
    title: item.title,
    fileName: item.fileName,
    fileType: item.fileType.toLowerCase() as "image" | "pdf",
    summary: item.summary,
    fullText: item.translatedText,
    originalText: item.extractedText,
    datetime: item.createdAt,
    events: [], // Events extraction not implemented yet in API
    vocabulary: [], // Vocabulary not implemented yet in API
    confidence: 1, // Not provided by API, default to 1
  };
}

/**
 * Convert array of API history items to TranslationResult array
 */
export function mapHistoryToTranslationResults(history: HistoryItem[]): TranslationResult[] {
  return history.map(mapHistoryItemToTranslationResult);
}