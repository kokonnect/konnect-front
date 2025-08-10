import { Stack } from "expo-router";

const primaryColor = "#00B493";

export default function CalendarLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: primaryColor,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="add"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="modify"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
