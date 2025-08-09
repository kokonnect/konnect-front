import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { useEffect } from "react";
import { initI18n } from "@/locales/i18n";

export default function RootLayout() {
  useEffect(() => {
    initI18n();
  }, []);

  return (
    <Provider store={store}>
      <AuthContainer>
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
      </AuthContainer>
    </Provider>
  );
}
