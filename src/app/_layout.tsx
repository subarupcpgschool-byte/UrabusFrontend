import InputFocusStyles from "@/components/common/InputFocusStyles";
import { WorkspaceProvider } from "@/features/workspace/WorkspaceProvider";
import AppReadyGate from "@/components/common/AppReadyGate";
import { AuthProvider } from "@/auth/AuthProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <InputFocusStyles />
      <WorkspaceProvider>
      <AppReadyGate>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F5F8FC" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="jobs/index" />
        <Stack.Screen name="jobs/[id]" />
        <Stack.Screen name="jobs/[id]/apply" />
        <Stack.Screen name="companies/index" />
      </Stack>
      </AppReadyGate>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
