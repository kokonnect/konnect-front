import { useAuth } from "./authHooks";
import { useUser } from "./userHooks";

// Combined hook for components that need both auth and user data
export function useAuthAndUser() {
  const auth = useAuth();
  const user = useUser();

  return {
    // Auth data
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    isAuthenticated: auth.isAuthenticated,
    authLoading: auth.isLoading,
    authError: auth.error,

    // User data
    user: user.user,
    hasChildren: user.hasChildren,
    children: user.children,
    userLoading: user.isLoading,
    userError: user.error,

    // Auth actions
    login: auth.login,
    logout: auth.logout,
    refreshAccessToken: auth.refreshAccessToken,
    clearAuthError: auth.clearAuthError,

    // User actions
    addChild: user.addChild,
    removeChild: user.removeChild,
    updateChild: user.updateChild,
    updateUser: user.updateUser,
    fetchUser: user.fetchUser,
    clearUserError: user.clearUserError,
  };
}

// Export individual hooks
export { useAuth, useAppAuth } from "./authHooks";
export { useUser } from "./userHooks";
export { useCalendar } from "./calendarHooks";
export { useMessageCompose } from "./messageHooks";
export {
  useFileTranslation,
  useFileTranslationResult,
  useFileTranslationLifecycle,
  useTranslationHistory,
} from "./fileTranslateHooks";
