import { Redirect } from "expo-router";

export default function RootIndex() {
  // Redirect to main app (login is now optional)
  return <Redirect href="/(tabs)" />;
}