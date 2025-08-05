import { Stack } from "expo-router";
import Header from "../../components/Header";

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
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="Calendar" icon="calendar" />,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add Event",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
