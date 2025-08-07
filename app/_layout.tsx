import { Stack } from "expo-router";
import { AuthProvider } from "@/components/auth/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
            headerTintColor: "#00B493",
          }}
        />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
