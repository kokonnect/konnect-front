import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Profile",
          headerShown: true,
          headerBackTitle: "Back",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
