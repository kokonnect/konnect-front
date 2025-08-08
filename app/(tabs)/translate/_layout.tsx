import { Stack } from "expo-router";

const primaryColor = "#00B493";

export default function TranslateLayout() {
  return (
    <Stack
      screenOptions={{
        // headerStyle: {
        //   backgroundColor: primaryColor,
        // },
        // headerTintColor: "#fff",
        // headerTitleStyle: {
        //   color: "#fff",
        //   fontSize: 18,
        //   fontWeight: "600",
        // },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="history"
        // options={{
        //   title: "Translation History",
        //   headerBackTitle: "Translate",
        // }}
      />
    </Stack>
  );
}
