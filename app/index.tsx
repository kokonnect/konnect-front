import { Redirect } from "expo-router";

export default function RootIndex() {
  // Always start with splash screen for first launch detection
  return <Redirect href="/splash" />;
}