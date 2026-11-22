import { useLocaleVersion } from "@/i18n/display";
import { Stack } from "expo-router";

// Initial browser readiness is handled once by the root AppReadyGate.
export default function PublicLayout() {
  "use no memo";
  useLocaleVersion();
  return <Stack screenOptions={{ headerShown: false }} />;
}
