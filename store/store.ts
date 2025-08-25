import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import translateReducer from "./features/translate/translateSlice";
import messageReducer from "./features/message/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    translate: translateReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "auth/login/fulfilled", 
          "user/addChild/fulfilled",
          "user/updateUser/fulfilled",
          "user/fetchUser/fulfilled",
          "translate/translateFile/fulfilled",
          "translate/retranslateFile/fulfilled",
          "message/composeMessage/fulfilled",
        ],
        ignoredPaths: [
          "translate.currentSession.createdAt",
          "translate.currentSession.request.file",
        ],
      },
    }),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
