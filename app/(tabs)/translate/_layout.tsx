import { Stack } from "expo-router";

const primaryColor = "#00B493";

export default function TranslateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="history" />
    </Stack>
  );
}
