import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  translateFileThunk,
  setCurrentRequest,
  clearTranslation,
  clearTranslationError,
  fetchTranslationHistoryThunk,
  selectCurrentRequest,
  selectIsTranslating,
  selectTranslationError,
  selectCurrentResult,
  selectHistory,
  selectIsLoadingHistory,
  selectHistoryError,
} from "@/store/features/translate/translateSlice";
import {
  FileTranslationRequest,
  FileTranslationResponse,
  HistoryItem,
} from "@/types/translate";

interface UseFileTranslationReturn {
  // State
  currentRequest: FileTranslationRequest | null;
  isTranslating: boolean;
  translationError: string | null;
  translationResult: FileTranslationResponse | null;

  // Actions
  translateFile: (request: FileTranslationRequest, refreshHistory?: boolean) => Promise<void>;
  clearTranslation: () => void;
  clearError: () => void;

  // Computed values
  hasActiveRequest: boolean;
  hasResult: boolean;
}

export function useFileTranslation(): UseFileTranslationReturn {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const currentRequest = useSelector(selectCurrentRequest);
  const isTranslating = useSelector(selectIsTranslating);
  const translationError = useSelector(selectTranslationError);
  const currentResult = useSelector(selectCurrentResult);

  // Actions
  const translateFile = useCallback(
    async (request: FileTranslationRequest, refreshHistory?: boolean): Promise<void> => {
      try {
        // Set current request first
        dispatch(setCurrentRequest(request));

        // Start translation
        const result = await dispatch(translateFileThunk(request)).unwrap();

        // Translation completed successfully
        console.log("Translation completed:", result.originalFileName);
        
        // Refresh history if requested
        if (refreshHistory) {
          try {
            await dispatch(fetchTranslationHistoryThunk()).unwrap();
            console.log("History refreshed after translation");
          } catch (historyError) {
            console.error("Failed to refresh history:", historyError);
            // Don't throw here, translation was successful
          }
        }
      } catch (error) {
        // Error is already handled by the thunk and stored in state
        console.error("Translation failed:", error);
        throw error; // Re-throw for component error handling if needed
      }
    },
    [dispatch],
  );

  const clearTranslationState = useCallback(() => {
    dispatch(clearTranslation());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearTranslationError());
  }, [dispatch]);

  // Computed values
  const hasActiveRequest = useMemo(() => {
    return currentRequest !== null;
  }, [currentRequest]);

  const hasResult = useMemo(() => {
    return currentResult !== null;
  }, [currentResult]);

  const translationResult = useMemo(() => {
    return currentResult;
  }, [currentResult]);

  return {
    // State
    currentRequest,
    isTranslating,
    translationError,
    translationResult,

    // Actions
    translateFile,
    clearTranslation: clearTranslationState,
    clearError,

    // Computed values
    hasActiveRequest,
    hasResult,
  };
}

/**
 * Utility hook for quick access to translation result data
 * Provides easy access to commonly used translation result fields
 */
export function useFileTranslationResult() {
  const { translationResult } = useFileTranslation();

  const summary = useMemo(
    () => translationResult?.summary || "",
    [translationResult?.summary],
  );
  const translatedText = useMemo(
    () => translationResult?.translatedText || "",
    [translationResult?.translatedText],
  );
  const extractedText = useMemo(
    () => translationResult?.extractedText || "",
    [translationResult?.extractedText],
  );
  const originalFileName = useMemo(
    () => translationResult?.originalFileName || "",
    [translationResult?.originalFileName],
  );
  const processingTime = useMemo(
    () => translationResult?.totalProcessingTimeMs || 0,
    [translationResult?.totalProcessingTimeMs],
  );

  return {
    result: translationResult,
    hasResult: translationResult !== null,
    summary,
    translatedText,
    extractedText,
    originalFileName,
    processingTime,
  };
}

/**
 * Hook for managing translation lifecycle
 * Provides utilities for translation state management
 */
export function useFileTranslationLifecycle() {
  const { isTranslating, clearTranslation, hasActiveRequest, hasResult } =
    useFileTranslation();

  const isIdle = useMemo(
    () => !isTranslating && !hasActiveRequest,
    [isTranslating, hasActiveRequest],
  );
  const isProcessing = useMemo(() => isTranslating, [isTranslating]);
  const isCompleted = useMemo(() => hasResult, [hasResult]);

  const resetTranslation = useCallback(() => {
    clearTranslation();
  }, [clearTranslation]);

  return {
    isIdle,
    isProcessing,
    isCompleted,
    resetTranslation,
  };
}

/**
 * Hook for translation history management
 */
export function useTranslationHistory() {
  const dispatch = useDispatch<AppDispatch>();

  const history = useSelector(selectHistory);
  const isLoadingHistory = useSelector(selectIsLoadingHistory);
  const historyError = useSelector(selectHistoryError);

  const fetchHistory = useCallback(async () => {
    try {
      await dispatch(fetchTranslationHistoryThunk()).unwrap();
    } catch (error) {
      console.error("Failed to fetch history:", error);
      throw error;
    }
  }, [dispatch]);

  const hasHistory = useMemo(() => history.length > 0, [history.length]);

  return {
    history,
    isLoadingHistory,
    historyError,
    fetchHistory,
    hasHistory,
  };
}
