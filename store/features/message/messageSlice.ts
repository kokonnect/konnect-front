import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MessageComposeRequest, MessageComposeResponse } from "@/types/message";
import { getGuestTokenAsync } from "@/store/features/auth/authSlice";
import { messageApi } from "@/services/messageApi";

// AsyncThunks

/**
 * Compose and translate a message
 */
export const composeMessageThunk = createAsyncThunk(
  "message/composeMessage",
  async (
    request: MessageComposeRequest,
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as { auth: any };
      let accessToken = state.auth.accessToken;

      // If no access token, get guest token
      if (!accessToken) {
        const guestTokenResponse = await dispatch(
          getGuestTokenAsync("ENGLISH"),
        ).unwrap();
        accessToken = guestTokenResponse.accessToken;
      }

      return await messageApi.composeMessage(request, accessToken);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Message composition failed",
      );
    }
  },
);

// Redux state interface
export interface MessageState {
  // Current composition
  currentRequest: MessageComposeRequest | null;
  currentResult: MessageComposeResponse | null;

  // Loading states
  isComposing: boolean;
  isLoading: boolean;

  // Error states
  composeError: string | null;
}

// Initial State
const initialState: MessageState = {
  currentRequest: null,
  currentResult: null,
  isComposing: false,
  isLoading: false,
  composeError: null,
};

// Slice
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Clear message state
    clearMessage: (state) => {
      state.currentRequest = null;
      state.currentResult = null;
    },

    clearComposeError: (state) => {
      state.composeError = null;
    },

    // Set current request
    setCurrentRequest: (
      state,
      action: PayloadAction<MessageComposeRequest>,
    ) => {
      state.currentRequest = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Compose message thunk
    builder
      .addCase(composeMessageThunk.pending, (state) => {
        state.isComposing = true;
        state.composeError = null;
      })
      .addCase(composeMessageThunk.fulfilled, (state, action) => {
        state.isComposing = false;
        state.currentResult = action.payload;
      })
      .addCase(composeMessageThunk.rejected, (state, action) => {
        state.isComposing = false;
        state.composeError = action.payload as string;
      });
  },
});

// Actions
export const { clearMessage, clearComposeError, setCurrentRequest } =
  messageSlice.actions;

// Selectors
export const selectCurrentRequest = (state: { message: MessageState }) =>
  state.message.currentRequest;
export const selectCurrentResult = (state: { message: MessageState }) =>
  state.message.currentResult;
export const selectIsComposing = (state: { message: MessageState }) =>
  state.message.isComposing;
export const selectIsLoading = (state: { message: MessageState }) =>
  state.message.isLoading;
export const selectComposeError = (state: { message: MessageState }) =>
  state.message.composeError;

export default messageSlice.reducer;
