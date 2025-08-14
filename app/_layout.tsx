import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { useEffect, useState } from "react";
import { initI18n } from "@/locales/i18n";
import { Platform } from "react-native";

export default function RootLayout() {
  const [isI18nReady, setIsI18nReady] = useState(Platform.OS === 'web');

  useEffect(() => {
    // For mobile platforms, initialize i18n asynchronously
    if (Platform.OS !== 'web') {
      initI18n().then(() => {
        setIsI18nReady(true);
      });
    }
    // For web, i18n is already initialized at module level
  }, []);

  // Don't render until i18n is ready
  if (!isI18nReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen
          name="login"
          options={{
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
            headerTintColor: "#00B493",
          }}
        />
        <Stack.Screen
          name="add-child"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Provider>
  );
}
