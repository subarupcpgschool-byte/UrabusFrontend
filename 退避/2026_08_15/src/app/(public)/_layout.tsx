import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

import FooterComponent from "@/components/public/Footer";
import HeaderComponent from "@/components/public/Header";

export default function PublicLayout() {
  const [isReady, setIsReady] = useState(Platform.OS !== "web");

  useEffect(() => {
    if (Platform.OS === "web") {
      setIsReady(true);
    }
  }, []);

  // Webの初回描画ではSlotをマウントしない
  if (!isReady) {
    return <View style={styles.initialRender} />;
  }

  return (
    <View style={styles.container}>
      <HeaderComponent />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          <Slot />
        </View>

        <FooterComponent />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  body: {
    flex: 1,
  },

  initialRender: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
});
