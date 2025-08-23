import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { AppDispatch } from "@/store/store";
import {
  selectUser,
  selectUserLoading,
  selectUserError,
  selectHasChildren,
  selectChildren,
  fetchUserAsync,
  updateUserAsync,
  addChildAsync,
  removeChildAsync,
  updateChildAsync,
  setUser,
  clearUser,
  clearError,
} from "@/store/features/user/userSlice";
import { selectAccessToken } from "@/store/features/auth/authSlice";
import { Child, User } from "@/types";

export function useUser() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const hasChildren = useSelector(selectHasChildren);
  const children = useSelector(selectChildren);
  const accessToken = useSelector(selectAccessToken);

  const fetchUser = useCallback(async () => {
    if (!accessToken) {
      throw new Error("No access token available");
    }
    const result = await dispatch(fetchUserAsync(accessToken));
    if (fetchUserAsync.rejected.match(result)) {
      throw new Error(result.error.message || "Failed to fetch user");
    }
    return result.payload;
  }, [dispatch, accessToken]);

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const result = await dispatch(updateUserAsync({ accessToken, updates }));
      if (updateUserAsync.rejected.match(result)) {
        throw new Error(result.error.message || "Failed to update user");
      }
      return result.payload;
    },
    [dispatch, accessToken]
  );

  const addChild = useCallback(
    async (child: Child) => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const result = await dispatch(addChildAsync({ accessToken, child }));
      if (addChildAsync.rejected.match(result)) {
        throw new Error(result.error.message || "Failed to add child");
      }
      return result.payload;
    },
    [dispatch, accessToken]
  );

  const removeChild = useCallback(
    async (childId: string) => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const result = await dispatch(removeChildAsync({ accessToken, childId }));
      if (removeChildAsync.rejected.match(result)) {
        throw new Error(result.error.message || "Failed to remove child");
      }
      return result.payload;
    },
    [dispatch, accessToken]
  );

  const updateChild = useCallback(
    async (childId: string, updates: Partial<Child>) => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const result = await dispatch(updateChildAsync({ accessToken, childId, updates }));
      if (updateChildAsync.rejected.match(result)) {
        throw new Error(result.error.message || "Failed to update child");
      }
      return result.payload;
    },
    [dispatch, accessToken]
  );

  const setUserData = useCallback(
    (userData: User | null) => {
      dispatch(setUser(userData));
    },
    [dispatch]
  );

  const clearUserData = useCallback(() => {
    dispatch(clearUser());
  }, [dispatch]);

  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isLoading,
    error,
    hasChildren,
    children,
    fetchUser,
    updateUser,
    addChild,
    removeChild,
    updateChild,
    setUserData,
    clearUserData,
    clearUserError,
  };
}