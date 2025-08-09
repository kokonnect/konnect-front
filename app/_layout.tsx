import { Stack } from "expo-router";
import { AuthProvider } from "@/components/auth/AuthContext";
import { useEffect } from "react";
import { initI18n } from "@/locales/i18n";

export default function RootLayout() {
  useEffect(() => {
    initI18n();
  }, []);

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
