import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { AppDispatch } from "@/store/store";
import {
  selectAccessToken,
  selectRefreshToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  loginAsync,
  logoutAsync,
  refreshTokenAsync,
  clearError,
  setTokens,
  clearTokens,
} from "./authSlice";
import { setUser, clearUser } from "../user/userSlice";

export function useAppAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const login = useCallback(
    async (authToken: string, provider: "kakao" | "google") => {
      const result = await dispatch(loginAsync({ authToken, provider }));
      if (loginAsync.rejected.match(result)) {
        throw new Error(result.error.message || "Login failed");
      }

      // Set user data in user slice
      dispatch(setUser(result.payload.user));

      return result.payload;
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutAsync());
    // Clear user data
    dispatch(clearUser());
  }, [dispatch]);

  const refreshAccessToken = useCallback(async () => {
    const result = await dispatch(refreshTokenAsync());
    if (refreshTokenAsync.rejected.match(result)) {
      throw new Error(result.error.message || "Token refresh failed");
    }
    return result.payload;
  }, [dispatch]);

  const setAuthTokens = useCallback(
    (tokens: { accessToken: string; refreshToken?: string }) => {
      dispatch(setTokens(tokens));
    },
    [dispatch],
  );

  const clearAuthTokens = useCallback(() => {
    dispatch(clearTokens());
    dispatch(clearUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshAccessToken,
    setAuthTokens,
    clearAuthTokens,
    clearAuthError,
  };
}

// Backward compatibility hook for components
export function useAuth() {
  return useAppAuth();
}
