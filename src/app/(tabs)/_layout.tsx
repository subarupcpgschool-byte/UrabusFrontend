import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";

export default function PublicLayout() {
  const [isReady, setIsReady] = useState(Platform.OS !== "web");

  useEffect(() => {
    if (Platform.OS === "web") {
      setIsReady(true);
    }
  }, []);

  // Webの初回描画ではSlotをマウントしない
  if (!isReady) {
    return <View />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
