import { Stack } from "expo-router";

// Initial browser readiness is handled once by the root AppReadyGate.
export default function PublicLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
