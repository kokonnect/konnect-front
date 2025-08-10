import { Stack } from "expo-router";
import { t } from "i18next";

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
          title: t("profile:editProfile.title"),
          headerShown: true,
          headerBackTitle: t("back"),
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
