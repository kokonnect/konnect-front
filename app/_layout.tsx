import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const primaryColor = "#00B493";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e0e0e0",
          borderTopWidth: 2,
        },
        headerStyle: {
          backgroundColor: primaryColor,
        },
        headerTitle: "Konnect",
        headerTitleStyle: {
          color: "#fff",
          fontSize: 24,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Main",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="translate"
        options={{
          title: "Translate",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="language" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Message",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="envelope" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
