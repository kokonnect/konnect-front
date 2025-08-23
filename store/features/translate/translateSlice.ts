import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FileTranslationRequest,
  FileTranslationResponse,
  TargetLanguage,
} from "@/types/translate";
import { translateApi } from "@/services/translateApi";
import { getGuestTokenAsync } from "@/store/features/auth/authSlice";

// AsyncThunks

/**
 * Upload and translate a file
 */
export const translateFileThunk = createAsyncThunk(
  "translate/translateFile",
  async (request: FileTranslationRequest, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: any };
      let accessToken = state.auth.accessToken;

      // If no access token, get guest token
      if (!accessToken) {
        const guestTokenResponse = await dispatch(getGuestTokenAsync("ENGLISH")).unwrap();
        accessToken = guestTokenResponse.accessToken;
      }

      return await translateApi.translateFile(request, accessToken);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Translation failed",
      );
    }
  },
);

/**
 * Re-translate an existing file
 */
export const retranslateFileThunk = createAsyncThunk(
  "translate/retranslateFile",
  async (
    {
      originalFileName,
      targetLanguage,
      useSimpleLanguage,
      sourceLanguageHint,
    }: {
      originalFileName: string;
      targetLanguage: TargetLanguage;
      useSimpleLanguage?: boolean;
      sourceLanguageHint?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await translateApi.retranslateFile(
        originalFileName,
        targetLanguage,
        useSimpleLanguage,
        sourceLanguageHint,
      );
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Retranslation failed",
      );
    }
  },
);

// State Interface
export interface TranslationState {
  // Current translation request
  currentRequest: FileTranslationRequest | null;

  // Loading states
  isTranslating: boolean;

  // UI state
  activeTab: "summary" | "fullText" | "events" | "vocabulary";
  showWarning: boolean;

  // Error states
  error: string | null;
  uploadError: string | null;
  translationError: string | null;

  // Current translation result
  currentResult: FileTranslationResponse | null;
}

// Initial State
const initialState: TranslationState = {
  currentRequest: null,
  isTranslating: false,
  activeTab: "summary",
  showWarning: true,
  error: null,
  uploadError: null,
  translationError: null,
  currentResult: null,
};

// Slice
const translateSlice = createSlice({
  name: "translate",
  initialState,
  reducers: {
    // Reset translation state
    clearTranslation: (state) => {
      state.currentRequest = null;
      state.currentResult = null;
      state.activeTab = "summary";
      state.showWarning = true;
    },

    // UI state management
    setActiveTab: (
      state,
      action: PayloadAction<TranslationState["activeTab"]>,
    ) => {
      state.activeTab = action.payload;
    },

    setShowWarning: (state, action: PayloadAction<boolean>) => {
      state.showWarning = action.payload;
    },

    // Error management
    clearError: (state) => {
      state.error = null;
      state.uploadError = null;
      state.translationError = null;
    },

    clearUploadError: (state) => {
      state.uploadError = null;
    },

    clearTranslationError: (state) => {
      state.translationError = null;
    },

    // Set current translation request
    setCurrentRequest: (
      state,
      action: PayloadAction<FileTranslationRequest>,
    ) => {
      state.currentRequest = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Translate file thunk
    builder
      .addCase(translateFileThunk.pending, (state) => {
        state.isTranslating = true;
        state.translationError = null;
      })
      .addCase(translateFileThunk.fulfilled, (state, action) => {
        state.isTranslating = false;
        state.currentResult = action.payload;
      })
      .addCase(translateFileThunk.rejected, (state, action) => {
        state.isTranslating = false;
        state.translationError = action.payload as string;
      });
  },
});

// Actions
export const {
  clearTranslation,
  setActiveTab,
  setShowWarning,
  clearError,
  clearUploadError,
  clearTranslationError,
  setCurrentRequest,
} = translateSlice.actions;

// Selectors
export const selectCurrentRequest = (state: { translate: TranslationState }) =>
  state.translate.currentRequest;
export const selectIsTranslating = (state: { translate: TranslationState }) =>
  state.translate.isTranslating;
export const selectActiveTab = (state: { translate: TranslationState }) =>
  state.translate.activeTab;
export const selectShowWarning = (state: { translate: TranslationState }) =>
  state.translate.showWarning;
export const selectTranslationError = (state: {
  translate: TranslationState;
}) => state.translate.translationError;
export const selectCurrentResult = (state: { translate: TranslationState }) =>
  state.translate.currentResult;

export default translateSlice.reducer;
