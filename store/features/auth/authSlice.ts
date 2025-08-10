import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/services/authApi";
import { AuthState, AuthTokens } from "@/types";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({
    authToken,
    provider,
  }: {
    authToken: string;
    provider: "kakao" | "google";
  }) => {
    const response = await authApi.authenticate(authToken, provider);
    return response;
  },
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const { accessToken } = state.auth;

    if (accessToken) {
      await authApi.logout(accessToken);
    }
    return null;
  },
);

export const refreshTokenAsync = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const { refreshToken } = state.auth;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await authApi.refreshToken(refreshToken);
    return response;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Logout failed";
        // Still clear tokens even if API call failed
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Refresh Token
      .addCase(refreshTokenAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Token refresh failed";
        // Clear tokens if refresh fails
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setTokens, clearTokens, clearError, setAuthenticated } =
  authSlice.actions;

// Selectors
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
