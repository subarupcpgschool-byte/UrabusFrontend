import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
