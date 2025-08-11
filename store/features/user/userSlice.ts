import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "@/services/userApi";
import { Child, User, UserState } from "@/types";

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const fetchUserAsync = createAsyncThunk(
  "user/fetchUser",
  async (accessToken: string) => {
    const user = await userApi.fetchUserProfile(accessToken);
    return user;
  },
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async ({
    accessToken,
    updates,
  }: {
    accessToken: string;
    updates: Partial<User>;
  }) => {
    const updatedUser = await userApi.updateUserProfile(accessToken, updates);
    return updatedUser;
  },
);

export const addChildAsync = createAsyncThunk(
  "user/addChild",
  async ({ accessToken, child }: { accessToken: string; child: Child }) => {
    const updatedUser = await userApi.addChild(accessToken, child);
    return updatedUser;
  },
);

export const removeChildAsync = createAsyncThunk(
  "user/removeChild",
  async ({
    accessToken,
    childId,
  }: {
    accessToken: string;
    childId: string;
  }) => {
    const updatedUser = await userApi.removeChild(accessToken, childId);
    return updatedUser;
  },
);

export const updateChildAsync = createAsyncThunk(
  "user/updateChild",
  async ({
    accessToken,
    childId,
    updates,
  }: {
    accessToken: string;
    childId: string;
    updates: Partial<Child>;
  }) => {
    const updatedUser = await userApi.updateChild(
      accessToken,
      childId,
      updates,
    );
    return updatedUser;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserLocal: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    addChildLocal: (state, action: PayloadAction<Child>) => {
      if (state.user) {
        state.user.children = [...(state.user.children || []), action.payload];
      }
    },
    removeChildLocal: (state, action: PayloadAction<string>) => {
      if (state.user && state.user.children) {
        state.user.children = state.user.children.filter(
          (child) => child.id !== action.payload,
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch user";
      })
      // Update User
      .addCase(updateUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update user";
      })
      // Add Child
      .addCase(addChildAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addChildAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(addChildAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to add child";
      })
      // Remove Child
      .addCase(removeChildAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeChildAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(removeChildAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to remove child";
      })
      // Update Child
      .addCase(updateChildAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateChildAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateChildAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update child";
      });
  },
});

export const {
  setUser,
  clearUser,
  clearError,
  updateUserLocal,
  addChildLocal,
  removeChildLocal,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectHasChildren = (state: { user: UserState }) =>
  !!(state.user.user?.children && state.user.user.children.length > 0);
export const selectChildren = (state: { user: UserState }) =>
  state.user.user?.children || [];

export default userSlice.reducer;
